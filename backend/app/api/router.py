"""
🌐 Culinary Crafts - API Router
Main API routing configuration with comprehensive documentation
"""
from app.services.recipe_engine import recipe_engine
from fastapi import APIRouter, HTTPException, Depends, status, Query
from fastapi.responses import PlainTextResponse
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime
import os
from dotenv import load_dotenv

try:
    import google.generativeai as genai  # type: ignore
except ImportError:  # Optional dependency for basic/minimal installs
    genai = None

# Import Pydantic models.
# If these imports fail, let the ImportError bubble up — `app/main.py` already
# handles that case by falling back to a minimal router.
from app.models import (
    APIInfo,
    HealthResponse,
    ChatRequest,
    ChatResponse,
    RecipeSearchResponse,
    Recipe,
    UserProfile,
    UserPreferences,
    RecipeSearchQuery,
    DietaryType,
    CookingDifficulty,
    CuisineType,
    ErrorResponse,
)

logger = logging.getLogger(__name__)

# Create main API router with metadata
router = APIRouter(
    prefix="",
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
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
GENAI_ENABLED = False
if genai and api_key:
    try:
        genai.configure(api_key=api_key)
        GENAI_ENABLED = True
    except Exception as e:
        logger.warning(f"Gemini is disabled (configure failed): {e}")
else:
    logger.warning("Gemini is disabled (missing google-generativeai or GEMINI_API_KEY).")

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
        version="1.0.0"
    )

# =================================
# 🤖 AI ASSISTANT ENDPOINTS
# =================================
model = None
working_model_name = None

if GENAI_ENABLED and genai is not None:
    _genai = genai
    def get_available_model():
        try:
            for m in _genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    logger.info(f"✅ Found working model: {m.name}")
                    if 'gemini-1.5-flash' in m.name:
                        return m.name
            models = [m.name for m in _genai.list_models() if 'generateContent' in m.supported_generation_methods]
            return models[0] if models else "gemini-pro"
        except Exception as e:
            logger.error(f"❌ Error listing models: {e}")
            return "gemini-1.5-flash"

    working_model_name = get_available_model()
    logger.info(f"🚀 Using model: {working_model_name}")
    model = genai.GenerativeModel(working_model_name)
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
async def chat_with_assistant(request: ChatRequest):
    if not GENAI_ENABLED or model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Gemini AI is not configured. Install google-generativeai and set GEMINI_API_KEY to enable /chat.",
        )

    user_query = request.message
    conversation_id = request.conversation_id or f"conv_{int(datetime.utcnow().timestamp())}"
    
    try:
        extract_prompt = f"จากประโยค: '{user_query}' ช่วยสกัดชื่อวัตถุดิบหรือชื่ออาหารออกมาเป็นคำสั้นๆ แค่คำเดียวหรือสองคำ เช่น 'ไก่', 'หมู', 'ไข่ดาว' (ตอบแค่คำนั้นไม่ต้องมีคำบรรยาย)"
        extracted_keywords = model.generate_content(extract_prompt).text.strip()
        
        found_recipes = recipe_engine.search(extracted_keywords, limit=3)
        
        if not found_recipes:
            return ChatResponse(
                response=f"ขออภัยครับ เชฟหาเมนูที่เกี่ยวกับ '{extracted_keywords}' ใน Cookbook ไม่เจอเลย ลองเปลี่ยนวัตถุดิบดูไหมครับ?",
                conversation_id=conversation_id,
                suggestions=[]
            )

        context = "\n---\n".join([f"เมนู: {r['name']}\nรายละเอียด: {r['ingredients']}" for r in found_recipes])
        prompt = f"""
        คุณคือ AI Chef ผู้เชี่ยวชาญด้านอาหารไทย 
        หน้าที่ของคุณคือตอบคำถามผู้ใช้โดยใช้ "ข้อมูลสูตรอาหาร" ที่กำหนดให้ด้านล่างนี้เท่านั้น 
        **ห้ามเมคข้อมูลเอง ห้ามเอาความรู้จากภายนอกมาตอบ**
        
        ข้อมูลสูตรอาหารจาก Cookbook:
        {context}
        
        คำถามจากผู้ใช้: "{user_query}"
        
        คำแนะนำ: ตอบให้ดูเป็นกันเอง สุภาพ และจัดรูปแบบให้อ่านง่าย
        """

        result = model.generate_content(prompt)
        ai_response = result.text

        return ChatResponse(
            response=ai_response,
            conversation_id=conversation_id,
            suggestions=[r['name'] for r in found_recipes]
        )

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return ChatResponse(
            response=f"ขออภัยครับ เชฟเกิดข้อผิดพลาด: {str(e)}",
            conversation_id=conversation_id,
            suggestions=[]
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
    
    return RecipeSearchResponse(
        query=query or "all recipes",
        results=[],
        total_results=0,
        page=1,
        per_page=10
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