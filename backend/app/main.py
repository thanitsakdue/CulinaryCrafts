"""
🍳 Culinary Crafts - FastAPI Main Application
AI Cooking Assistant with Agentic Workflow
"""
from app.services.recipe_engine import recipe_engine
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
from fastapi.openapi.utils import get_openapi
from contextlib import asynccontextmanager
import logging
import os
from typing import List
from app.api import router as api_router
from app.middleware.security import SecurityMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.config.settings import get_settings
from .database import engine
from . import models_db

logger = logging.getLogger(__name__)
models_db.Base.metadata.create_all(bind=engine)
settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events."""

    logger.info("🍳 Starting Culinary Crafts API...")
    
    try:
        # แก้ไขตรงนี้: ให้ Log บอกว่ากำลังโหลด PDF
        logger.info("📦 Initializing Recipe Engine (Loading PDF Knowledge Base)...")
        
        # เรียกใช้ initialize() ที่เราเขียนไว้ใน recipe_engine.py
        recipe_engine.initialize() 
        
        app.state.recipe_engine = recipe_engine 
        
        logger.info("✅ All services (including PDF Recipe Engine) initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {e}")
        raise
    
    yield
    
    # Shutdown events
    logger.info("🔄 Shutting down Culinary Crafts API...")
    # TODO: Cleanup connections and resources
    logger.info("👋 Shutdown complete")

# Create FastAPI application
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="🍳 Culinary Crafts API",
        version="1.0.0",
        description="""
        ## 🤖 AI Cooking Assistant with Agentic Workflow
        
        **Culinary Crafts** is a sophisticated Grounded Culinary Agent that combines:
        - **LangGraph State Machine** for intelligent conversation management
        - **Gemini 1.5 Pro** for multimodal AI processing  
        - **Vertex AI Search** for semantic recipe discovery
        - **Cloud Firestore** for personalized user experiences
        
        ### ✨ Key Features
        
        🧠 **Agentic Intelligence**
        - Multi-turn conversations with context awareness
        - Interactive decision making and recipe guidance
        - State-based cooking assistance with memory
        
        🔍 **Advanced Recipe Search**
        - Semantic search powered by Vertex AI
        - Ingredient-based recipe discovery
        - Dietary restriction filtering
        - Nutritional analysis and suggestions
        
        💾 **Personalization Engine**
        - User preference learning and adaptation
        - Cooking history tracking and recommendations
        - Dietary restriction compliance
        - Kitchen equipment awareness
        
        🛡️ **Enterprise Security**
        - JWT-based authentication
        - Rate limiting and request throttling
        - Input validation and sanitization
        - CORS protection and security headers
        
        ### 🎯 Use Cases
        
        **For Home Cooks:**
        - "What can I make with ingredients in my fridge?"
        - "Teach me to cook Thai curry step by step"
        - "Find healthy recipes for my dietary restrictions"
        
        **For Meal Planning:**
        - Weekly meal planning with shopping lists
        - Nutritional goal tracking
        - Budget-conscious recipe suggestions
        
        **For Learning:**
        - Skill-level appropriate cooking guidance
        - Ingredient substitution education
        - Cooking technique explanations
        
        ### 🚀 Getting Started
        
        1. **Health Check**: `GET /health`
        2. **Start Chatting**: `POST /api/v1/chat`
        3. **Search Recipes**: `GET /api/v1/recipes`
        4. **Manage Profile**: `GET /api/v1/user/profile`
        
        ### 📚 Documentation
        
        - **Interactive Docs**: Available at `/docs` (this page)
        - **ReDoc**: Alternative docs at `/redoc`
        - **OpenAPI Schema**: Raw schema at `/openapi.json`
        
        ---
        
        **Built with ❤️ using FastAPI, LangGraph, and Google Cloud AI**
        """,
        routes=app.routes,
        servers=[
            {"url": "http://localhost:8000", "description": "Development server"},
            {"url": "https://api.culinarycrafts.ai", "description": "Production server"}
        ]
    )
    
    # Add additional metadata
    openapi_schema["info"]["x-logo"] = {
        "url": "https://storage.googleapis.com/culinary-crafts/logo.png",
        "altText": "Culinary Crafts Logo"
    }
    
    # Add contact information
    openapi_schema["info"]["contact"] = {
        "name": "Culinary Crafts Support",
        "url": "https://culinarycrafts.ai/support",
        "email": "support@culinarycrafts.ai"
    }
    
    # Add license information
    openapi_schema["info"]["license"] = {
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    }
    
    # Add external documentation
    openapi_schema["externalDocs"] = {
        "description": "Find more info about Culinary Crafts",
        "url": "https://docs.culinarycrafts.ai"
    }
    
    # Enhance tag descriptions
    openapi_schema["tags"] = [
        {
            "name": "Core",
            "description": "Essential API endpoints for health checks and service information"
        },
        {
            "name": "AI Assistant", 
            "description": "🤖 Intelligent cooking assistant powered by LangGraph and Gemini 1.5 Pro"
        },
        {
            "name": "Recipes",
            "description": "🔍 Recipe search and discovery using Vertex AI Search with semantic understanding"
        },
        {
            "name": "User Management",
            "description": "👤 User profiles, preferences, and personalization features"
        },
        {
            "name": "Health",
            "description": "🏥 System health and monitoring endpoints"
        },
        {
            "name": "Monitoring",
            "description": "📊 Application metrics and observability endpoints"
        }
    ]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app = FastAPI(
    title="🍳 Culinary Crafts API",
    description="AI Cooking Assistant with Agentic Workflow - Powered by LangGraph, Gemini 1.5 Pro, and Vertex AI",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan,
    openapi_tags=[
        {"name": "Core", "description": "Essential API endpoints"},
        {"name": "AI Assistant", "description": "🤖 Intelligent cooking conversations"},
        {"name": "Recipes", "description": "🔍 Recipe search and discovery"},
        {"name": "User Management", "description": "👤 User profiles and preferences"},
    ]
)

# Apply custom OpenAPI schema
app.openapi = custom_openapi

# Security middleware
security = HTTPBearer(auto_error=False)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
if settings.ALLOWED_HOSTS:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )

# Custom security middleware
#app.add_middleware(SecurityMiddleware)

# Rate limiting middleware  
#app.add_middleware(RateLimitMiddleware)

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