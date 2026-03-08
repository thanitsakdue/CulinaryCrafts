"""
⚡ Culinary Crafts - Rate Limiting Middleware
API rate limiting and throttling
"""

from fastapi import Request, Response, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
import time
import logging
from typing import Dict
from collections import defaultdict, deque

logger = logging.getLogger(__name__)

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Simple in-memory rate limiting middleware.
    TODO: Replace with Redis-based rate limiting for production
    """
    
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, deque] = defaultdict(deque)
        
    def _get_client_identifier(self, request: Request) -> str:
        """Get client identifier for rate limiting."""
        # Use IP address as identifier
        # TODO: Use user ID from JWT token when authentication is implemented
        client_ip = request.client.host if request.client else "unknown"
        return f"ip:{client_ip}"
    
    def _is_rate_limited(self, client_id: str) -> bool:
        """Check if client has exceeded rate limit."""
        now = time.time()
        minute_ago = now - 60  # 60 seconds ago
        
        # Get or create client request queue
        client_requests = self.requests[client_id]
        
        # Remove old requests (older than 1 minute)
        while client_requests and client_requests[0] < minute_ago:
            client_requests.popleft()
        
        # Check if rate limit exceeded
        if len(client_requests) >= self.requests_per_minute:
            return True
        
        # Add current request
        client_requests.append(now)
        return False
    
    async def dispatch(self, request: Request, call_next):
        """Process request with rate limiting."""
        
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        try:
            # Get client identifier
            client_id = self._get_client_identifier(request)
            
            # Check rate limit
            if self._is_rate_limited(client_id):
                logger.warning(f"Rate limit exceeded for client: {client_id}")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail={
                        "error": "rate_limit_exceeded",
                        "message": f"Too many requests. Limit: {self.requests_per_minute} requests per minute",
                        "retry_after": 60
                    },
                    headers={"Retry-After": "60"}
                )
            
            # Process request
            response = await call_next(request)
            
            # Add rate limit headers
            remaining = max(0, self.requests_per_minute - len(self.requests[client_id]))
            response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
            response.headers["X-RateLimit-Remaining"] = str(remaining)
            response.headers["X-RateLimit-Reset"] = str(int(time.time()) + 60)
            
            return response
            
        except HTTPException:
            # Re-raise HTTP exceptions (like rate limit exceeded)
            raise
        except Exception as e:
            logger.error(f"Rate limit middleware error: {e}")
            # Continue with request if middleware fails
            return await call_next(request)