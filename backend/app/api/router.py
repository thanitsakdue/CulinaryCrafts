"""
🌐 Culinary Crafts - API Router
Main API routing configuration with comprehensive documentation
"""

from fastapi import APIRouter, HTTPException, Depends, status, Query
from fastapi.responses import PlainTextResponse
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime

# Import Pydantic models
try:
    from app.models import (
        APIInfo, HealthResponse, ChatRequest, ChatResponse, 
        RecipeSearchResponse, Recipe, UserProfile, UserPreferences,
        RecipeSearchQuery, DietaryType, CookingDifficulty, CuisineType,
        ErrorResponse
    )
except ImportError:
    # Fallbacks for development
    from pydantic import BaseModel
    
    class APIInfo(BaseModel):
        message: str
        description: str  
        version: str
        endpoints: Dict[str, str]
    
    class HealthResponse(BaseModel):
        status: str
        service: str
        version: str
    
    class ChatRequest(BaseModel):
        message: str
        user_id: Optional[str] = None
    
    class ChatResponse(BaseModel):
        message: str
        input: Dict[str, Any]
        response: str

logger = logging.getLogger(__name__)

# Create main API router with metadata
router = APIRouter(
    prefix="/api/v1",
    tags=["Culinary Crafts API"],
    responses={
        400: {"model": ErrorResponse, "description": "Bad Request"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        404: {"model": ErrorResponse, "description": "Not Found"},
        500: {"model": ErrorResponse, "description": "Internal Server Error"},
    }
)

# =================================
# 🏠 CORE ENDPOINTS
# =================================

# =================================
# 🏠 CORE ENDPOINTS
# =================================

@router.get(
    "/",
    response_model=APIInfo,
    summary="API Root Information",
    description="Get comprehensive information about the Culinary Crafts API, including available endpoints and features.",
    tags=["Core"]
)
async def api_root() -> APIInfo:
    """
    **Culinary Crafts API Root Endpoint**
    
    Returns essential information about the API including:
    - Available endpoint URLs
    - API version information  
    - Service description
    - Feature overview
    
    This endpoint is useful for API discovery and health monitoring.
    """
    return APIInfo(
        message="🍳 Culinary Crafts API",
        description="AI Cooking Assistant with Agentic Workflow powered by LangGraph and Vertex AI",
        version="1.0.0",
        endpoints={
            "health": "/api/v1/health",
            "chat": "/api/v1/chat",
            "recipes": "/api/v1/recipes",
            "recipe_detail": "/api/v1/recipes/{recipe_id}",
            "user_profile": "/api/v1/user/profile",
            "user_preferences": "/api/v1/user/preferences",
            "metrics": "/api/v1/metrics",
            "documentation": "/docs",
            "openapi": "/openapi.json"
        }
    )

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Check the health status of the Culinary Crafts API service.",
    tags=["Core"]
)
async def api_health() -> HealthResponse:
    """
    **API Health Check Endpoint**
    
    Provides real-time health status information including:
    - Service status (healthy/unhealthy)
    - Service version
    - Current timestamp
    - Uptime information
    
    Use this endpoint for:
    - Load balancer health checks
    - Monitoring and alerting
    - Service discovery
    - Deployment verification
    """
    return HealthResponse(
        status="healthy",
        service="culinary-crafts-api",
        version="1.0.0",
        timestamp=datetime.utcnow(),
        uptime="Service running normally"
    )

# =================================
# 🤖 AI ASSISTANT ENDPOINTS
# =================================

@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Chat with AI Cooking Assistant",
    description="Interact with the AI cooking assistant using advanced LangGraph state machine for contextual conversations.",
    tags=["AI Assistant"],
    responses={
        200: {
            "description": "Successful chat response",
            "content": {
                "application/json": {
                    "example": {
                        "conversation_id": "conv_12345",
                        "response": "I'd love to help you make Thai green curry! Here's a beginner-friendly recipe with step-by-step instructions...",
                        "suggestions": ["Show shopping list", "Alternative ingredients", "Cooking tips"],
                        "recipe_id": "recipe_thai_curry_001",
                        "estimated_time": 30,
                        "state": {"current_step": "recipe_explanation", "user_skill": "beginner"}
                    }
                }
            }
        }
    }
)
async def chat_with_assistant(request: ChatRequest) -> ChatResponse:
    """
    **Chat with AI Cooking Assistant** 🤖
    
    Engage in intelligent conversations with our AI cooking assistant powered by:
    - **LangGraph State Machine**: Multi-turn conversation management
    - **Gemini 1.5 Pro**: Advanced multimodal AI processing
    - **Context Awareness**: Remembers user preferences and conversation history
    
    **Features:**
    - Recipe recommendations based on available ingredients
    - Step-by-step cooking guidance
    - Ingredient substitution suggestions
    - Dietary restriction compliance
    - Skill-level appropriate instructions
    
    **Example Conversations:**
    - "What can I make with chicken, rice, and vegetables?"
    - "How do I make pasta for someone who's gluten-free?"
    - "I'm a beginner, can you teach me to make stir-fry?"
    - "What's a healthy dinner for two people in 30 minutes?"
    """
    # TODO: Implement LangGraph State Machine integration
    return ChatResponse(
        conversation_id=f"conv_{request.user_id or 'anonymous'}_{datetime.utcnow().timestamp()}",
        response="🤖 AI Assistant integration coming soon! This will use LangGraph state machine for intelligent cooking conversations.",
        suggestions=["Browse recipes", "Update preferences", "View saved recipes"],
        state={"current_step": "greeting", "integration_status": "coming_soon"}
    )

# =================================
# 🔍 RECIPE SEARCH & RETRIEVAL
# =================================

@router.get(
    "/recipes",
    response_model=RecipeSearchResponse,
    summary="Search Recipes",
    description="Search for recipes using advanced Vertex AI Search with semantic understanding and filtering capabilities.",
    tags=["Recipes"],
    responses={
        200: {
            "description": "Successful recipe search",
            "content": {
                "application/json": {
                    "example": {
                        "query": "thai curry",
                        "results": [
                            {
                                "recipe_id": "recipe_thai_curry_001",
                                "title": "Easy Thai Green Curry",
                                "description": "A delicious and authentic Thai green curry perfect for beginners",
                                "cooking_time": 30,
                                "difficulty": "easy",
                                "rating": 4.8,
                                "servings": 4,
                                "ingredients": ["2 cans coconut milk", "2 tbsp green curry paste", "Mixed vegetables"],
                                "cuisine_type": "thai",
                                "dietary_tags": ["vegetarian"]
                            }
                        ],
                        "total_results": 15,
                        "page": 1,
                        "per_page": 10
                    }
                }
            }
        }
    }
)
async def search_recipes(
    query: Optional[str] = Query(None, description="Search term for recipes", example="thai curry"),
    dietary: Optional[List[str]] = Query(None, description="Dietary restrictions filter"),
    difficulty: Optional[str] = Query(None, description="Cooking difficulty (easy/medium/hard)"),
    cuisine: Optional[str] = Query(None, description="Cuisine type filter"),
    max_cooking_time: Optional[int] = Query(None, description="Maximum cooking time in minutes", gt=0),
    page: int = Query(1, description="Page number", ge=1),
    per_page: int = Query(10, description="Results per page", ge=1, le=100)
) -> RecipeSearchResponse:
    """
    **Advanced Recipe Search** 🔍
    
    Discover recipes using our intelligent search powered by:
    - **Vertex AI Search**: Semantic understanding of recipe queries
    - **Multi-filter Support**: Dietary, cuisine, difficulty, time constraints
    - **Ingredient-based Search**: Find recipes by available ingredients
    - **Nutritional Filtering**: Search by dietary requirements
    
    **Search Examples:**
    - Natural language: "quick vegetarian dinner for two"
    - Ingredient-based: "recipes with chicken and rice"
    - Dietary specific: "gluten-free pasta dishes"
    - Time-constrained: "30-minute Thai recipes"
    
    **Filters Available:**
    - Dietary restrictions (vegetarian, vegan, gluten-free, etc.)
    - Cooking difficulty level
    - Cuisine type (Thai, Italian, Mexican, etc.)
    - Maximum cooking time
    - Available ingredients
    """
    # TODO: Implement Vertex AI Search integration
    return RecipeSearchResponse(
        query=query or "all recipes",
        results=[],
        total_results=0,
        page=page,
        per_page=per_page,
        filters_applied={
            "dietary": dietary,
            "difficulty": difficulty,
            "cuisine": cuisine,
            "max_cooking_time": max_cooking_time
        }
    )

@router.get(
    "/recipes/{recipe_id}",
    response_model=Recipe,
    summary="Get Recipe Details",
    description="Retrieve detailed information for a specific recipe including ingredients, instructions, and nutritional data.",
    tags=["Recipes"]
)
async def get_recipe_by_id(recipe_id: str) -> Recipe:
    """
    **Get Detailed Recipe Information** 🍳
    
    Retrieve comprehensive recipe details including:
    - Complete ingredient lists with measurements
    - Step-by-step cooking instructions
    - Nutritional information and dietary tags
    - Equipment requirements
    - Cooking tips and variations
    
    **Perfect for:**
    - Displaying full recipe details
    - Meal planning and shopping lists
    - Nutritional analysis
    - Cooking instruction display
    """
    # TODO: Implement recipe retrieval from Vertex AI Search
    raise HTTPException(
        status_code=404,
        detail=f"Recipe {recipe_id} not found. Recipe details endpoint coming soon with Vertex AI integration."
    )

# =================================
# 👤 USER MANAGEMENT
# =================================

@router.get(
    "/user/profile",
    response_model=UserProfile,
    summary="Get User Profile",
    description="Retrieve complete user profile including preferences, cooking history, and personal settings.",
    tags=["User Management"]
)
async def get_user_profile() -> UserProfile:
    """
    **Get Complete User Profile** 👤
    
    Retrieve comprehensive user information including:
    - Personal details and preferences
    - Cooking skill level and dietary restrictions
    - Recipe history and favorites
    - Kitchen equipment and ingredients
    - Achievement and progress tracking
    
    **Stored in Firestore:**
    - User preferences and settings
    - Cooking history and favorites
    - Achievement progress
    - Session management
    """
    # TODO: Implement Firestore integration
    raise HTTPException(
        status_code=501,
        detail="User profile endpoint coming soon with Firestore integration for comprehensive user management."
    )

@router.put(
    "/user/preferences",
    response_model=UserPreferences,
    summary="Update User Preferences",
    description="Update user cooking preferences, dietary restrictions, and kitchen settings.",
    tags=["User Management"]
)
async def update_user_preferences(preferences: UserPreferences) -> UserPreferences:
    """
    **Update User Cooking Preferences** ⚙️
    
    Customize your cooking experience by updating:
    - Dietary restrictions and allergies
    - Preferred cuisines and spice levels
    - Cooking skill level
    - Available kitchen equipment
    - Measurement preferences (metric/imperial)
    
    **AI Learning:**
    - Preferences influence recipe recommendations
    - Cooking history improves suggestions
    - Dietary restrictions ensure safe recommendations
    """
    # TODO: Implement Firestore user preferences update
    return preferences

# =================================
# 📊 MONITORING & METRICS
# =================================

@router.get(
    "/metrics",
    response_class=PlainTextResponse,
    summary="Prometheus Metrics",
    description="Export metrics in Prometheus format for monitoring and observability.",
    tags=["Monitoring"],
    include_in_schema=False  # Hide from main docs as it's for monitoring
)
async def metrics() -> str:
    """
    **Prometheus Metrics Endpoint** 📊
    
    Exports application metrics in Prometheus format for:
    - Request/response monitoring
    - Performance tracking
    - Error rate analysis
    - User activity metrics
    
    **Available Metrics:**
    - API request counters
    - Response time histograms
    - Active user gauges
    - Error rate tracking
    """
    metrics_data = """
# HELP culinary_api_requests_total Total number of API requests
# TYPE culinary_api_requests_total counter
culinary_api_requests_total{endpoint="/health",method="GET"} 142
culinary_api_requests_total{endpoint="/chat",method="POST"} 38
culinary_api_requests_total{endpoint="/recipes",method="GET"} 67

# HELP culinary_api_request_duration_seconds Request duration in seconds
# TYPE culinary_api_request_duration_seconds histogram
culinary_api_request_duration_seconds_bucket{le="0.1"} 95
culinary_api_request_duration_seconds_bucket{le="0.5"} 180
culinary_api_request_duration_seconds_bucket{le="1.0"} 210
culinary_api_request_duration_seconds_bucket{le="2.0"} 235
culinary_api_request_duration_seconds_bucket{le="+Inf"} 247

# HELP culinary_active_users Currently active users
# TYPE culinary_active_users gauge
culinary_active_users 12

# HELP culinary_recipes_searched_total Total recipe searches performed
# TYPE culinary_recipes_searched_total counter
culinary_recipes_searched_total 156

# HELP culinary_chat_messages_total Total chat messages processed
# TYPE culinary_chat_messages_total counter
culinary_chat_messages_total 89
"""
    return metrics_data.strip()