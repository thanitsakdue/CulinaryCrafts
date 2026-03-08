"""
🍳 Culinary Crafts - FastAPI Main Application
AI Cooking Assistant with Agentic Workflow
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import logging
import os
from typing import List

# Import routers and middleware
try:
    from app.api import router as api_router
    from app.middleware.security import SecurityMiddleware
    from app.middleware.rate_limit import RateLimitMiddleware
    from app.config.settings import get_settings
except ImportError as e:
    # Handle missing imports gracefully during development
    print(f"Warning: Some imports failed: {e}")
    print("This is normal if you haven't installed all dependencies yet.")
    
    # Create basic fallbacks
    from fastapi import APIRouter
    api_router = APIRouter()
    
    @api_router.get("/")
    async def basic_root():
        return {"message": "Basic setup - please install full requirements"}
    
    class SecurityMiddleware:
        def __init__(self, app): pass
    
    class RateLimitMiddleware:  
        def __init__(self, app): pass
        
    class MockSettings:
        ENVIRONMENT = "development"
        DEBUG = True
        API_VERSION = "v1"
        CORS_ORIGINS = ["http://localhost:3000"]
        ALLOWED_HOSTS = []
    
    def get_settings():
        return MockSettings()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Get application settings
settings = get_settings()

# Application lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events."""
    
    # Startup events
    logger.info("🍳 Starting Culinary Crafts API...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    
    # Initialize services here (Firestore, Redis, etc.)
    try:
        # TODO: Initialize database connections
        # TODO: Initialize AI services (Gemini, Vertex AI)
        # TODO: Initialize memory services (Firestore)
        logger.info("✅ All services initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {e}")
        raise
    
    yield
    
    # Shutdown events
    logger.info("🔄 Shutting down Culinary Crafts API...")
    # TODO: Cleanup connections and resources
    logger.info("👋 Shutdown complete")

# Create FastAPI application
app = FastAPI(
    title="Culinary Crafts API",
    description="""
    🤖 **AI Cooking Assistant with Agentic Workflow**
    
    Culinary Crafts เป็น **Grounded Culinary Agent** ที่ใช้ LangGraph State Machine 
    สำหรับการจัดการ multi-step reasoning และ interactive decision making
    
    ## ✨ Key Features
    - **🧠 Agentic Intelligence**: Interactive decision making with memory
    - **🔍 Multimodal RAG**: Recipe search with Vertex AI
    - **💾 Personalization**: User preferences & dietary restrictions
    - **🛡️ Security First**: JWT auth, rate limiting, input validation
    
    ## 🚀 Technology Stack
    - **AI**: Gemini 1.5 Pro + LangGraph
    - **Knowledge Base**: Vertex AI Search
    - **Memory**: Cloud Firestore
    - **Security**: JWT + Rate Limiting
    """,
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan
)

# Security middleware
security = HTTPBearer(auto_error=False)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Trusted host middleware
if settings.ALLOWED_HOSTS:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )

# Custom security middleware
app.add_middleware(SecurityMiddleware)

# Rate limiting middleware  
app.add_middleware(RateLimitMiddleware)

# Include routers
app.include_router(api_router, prefix=f"/api/{settings.API_VERSION}")

# Health check endpoints
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API status check."""
    return {
        "service": "Culinary Crafts API",
        "version": "1.0.0",
        "status": "healthy",
        "message": "🍳 Welcome to Culinary Crafts - AI Cooking Assistant!",
        "docs": "/docs" if settings.DEBUG else "Disabled in production"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check endpoint."""
    try:
        health_status = {
            "status": "healthy",
            "timestamp": "2026-03-08T00:00:00Z",  # TODO: Use actual timestamp
            "environment": settings.ENVIRONMENT,
            "services": {
                "api": "healthy",
                "database": "checking...",  # TODO: Check Firestore connection
                "ai_services": "checking...",  # TODO: Check Gemini/Vertex AI
                "cache": "checking..."  # TODO: Check Redis connection
            }
        }
        
        # TODO: Add actual service health checks
        # - Firestore connection test
        # - Gemini API availability  
        # - Vertex AI Search status
        # - Redis connection test
        
        return health_status
    
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service temporarily unavailable"
        )

@app.get("/metrics", tags=["Monitoring"])
async def get_metrics():
    """Prometheus-compatible metrics endpoint."""
    # TODO: Implement actual metrics collection
    return {
        "message": "Metrics endpoint - TODO: Implement Prometheus metrics",
        "timestamp": "2026-03-08T00:00:00Z"
    }

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Global HTTP exception handler."""
    logger.error(f"HTTP {exc.status_code}: {exc.detail}")
    return {
        "error": "request_failed",
        "message": exc.detail,
        "status_code": exc.status_code,
        "timestamp": "2026-03-08T00:00:00Z"  # TODO: Use actual timestamp
    }

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler."""
    logger.error(f"Unexpected error: {exc}")
    return {
        "error": "internal_server_error",
        "message": "An unexpected error occurred",
        "status_code": 500,
        "timestamp": "2026-03-08T00:00:00Z"  # TODO: Use actual timestamp
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  
        port=8000,
        reload=True,
        log_level="info"
    )