"""
🛡️ Culinary Crafts - Security Middleware
Security headers and protection middleware
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import time
import logging

logger = logging.getLogger(__name__)

class SecurityMiddleware(BaseHTTPMiddleware):
    """Security middleware for adding security headers and protection."""
    
    async def dispatch(self, request: Request, call_next):
        """Process request with security enhancements."""
        
        # Record start time for performance monitoring
        start_time = time.time()
        
        try:
            # Call the next middleware/endpoint
            response = await call_next(request)
            
            # Add security headers
            response.headers["X-Content-Type-Options"] = "nosniff"
            response.headers["X-Frame-Options"] = "DENY"
            response.headers["X-XSS-Protection"] = "1; mode=block"
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
            response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
            response.headers["Content-Security-Policy"] = "default-src 'self'"
            
            # Add custom headers
            response.headers["X-API-Version"] = "1.0.0"
            response.headers["X-Service"] = "culinary-crafts"
            
            # Add timing header for debugging (remove in production)
            process_time = time.time() - start_time
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
            
        except Exception as e:
            logger.error(f"Security middleware error: {e}")
            # Re-raise the exception to be handled by global exception handler
            raise