"""
🍳 Culinary Crafts - Pydantic Models
Data models for API requests and responses
"""

from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# =================================
# 🔢 ENUMS
# =================================

class DietaryType(str, Enum):
    """Dietary restriction types"""
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    GLUTEN_FREE = "gluten_free"
    DAIRY_FREE = "dairy_free"
    KETO = "keto"
    PALEO = "paleo"
    LOW_CARB = "low_carb"
    HALAL = "halal"
    KOSHER = "kosher"

class CookingDifficulty(str, Enum):
    """Cooking difficulty levels"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class CookingSkill(str, Enum):
    """User cooking skill levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class CuisineType(str, Enum):
    """Cuisine types"""
    THAI = "thai"
    ITALIAN = "italian"
    JAPANESE = "japanese"
    CHINESE = "chinese"
    MEXICAN = "mexican"
    INDIAN = "indian"
    FRENCH = "french"
    AMERICAN = "american"
    MEDITERRANEAN = "mediterranean"
    KOREAN = "korean"

# =================================
# 📤 REQUEST MODELS
# =================================

class ChatContext(BaseModel):
    """Context information for chat requests"""
    dietary_preferences: Optional[List[DietaryType]] = Field(
        default=[], 
        description="User's dietary restrictions and preferences"
    )
    available_ingredients: Optional[List[str]] = Field(
        default=[], 
        description="Ingredients currently available to the user"
    )
    cooking_skill: Optional[CookingSkill] = Field(
        default=CookingSkill.BEGINNER,
        description="User's cooking skill level"
    )
    kitchen_equipment: Optional[List[str]] = Field(
        default=[],
        description="Available kitchen equipment (oven, stovetop, microwave, etc.)"
    )
    allergies: Optional[List[str]] = Field(
        default=[],
        description="User's food allergies"
    )
    preferred_cuisines: Optional[List[CuisineType]] = Field(
        default=[],
        description="User's preferred cuisine types"
    )

class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="User's message to the AI cooking assistant",
        examples=["How do I make Thai green curry for beginners?"] # แก้ตรงนี้
    )
    user_id: Optional[str] = Field(
        default=None,
        description="Unique user identifier for conversation tracking",
        examples=["user_12345"]
    )
    conversation_id: Optional[str] = Field(
        default=None,
        description="Conversation ID for multi-turn conversations",
        examples=["conv_67890"]
    )
    context: Optional[ChatContext] = Field(
        default=None,
        description="Additional context about user preferences and situation"
    )

class UserPreferences(BaseModel):
    """User cooking preferences and settings"""
    class Config:
        allow_population_by_field_name = True
        extra = "ignore"

    # 1. เปลี่ยนจาก dietary_preferences เป็น dietary_types (ให้ตรงกับ DB และ Frontend)
    dietary_types: List[str] = Field(
        default=[],
        description="User's dietary restrictions"
    )
    
    allergies: List[str] = Field(
        default=[],
        description="Food allergies"
    )

    # 2. ฟิลด์ที่หน้าบ้านไม่ได้ส่งมา ให้ใส่ default ไว้เพื่อไม่ให้มันฟ้อง 422
    cooking_skill: str = Field(
        default="beginner"
    )

    favorite_cuisines: List[str] = Field(
        default=[],
        description="User's favorite cuisine types"
    )

    # 3. มั่นใจว่าชื่อฟิลด์นี้สะกดถูกตามที่ Frontend ส่ง (kitchen_equipment)
    kitchen_equipment: List[str] = Field(
        default=[],
        description="Available kitchen equipment"
    )

    spice_level: str = Field(
        default="medium"
    )

    measurement_units: str = Field(
        default="metric"
    )

    ingredients_to_avoid: List[str] = Field(
        default=[],
        alias="ingredientsToAvoid",
        description="Ingredients the user wants to avoid"
    )

    @validator("spice_level", pre=True)
    def normalize_spice_level(cls, value):
        """Accept both numeric and string spice levels from frontend payloads."""
        if isinstance(value, int):
            mapping = {
                0: "mild",
                1: "medium",
                2: "hot",
                3: "very_hot",
            }
            return mapping.get(value, "medium")
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized.isdigit():
                return cls.normalize_spice_level(int(normalized))
            return normalized or "medium"
        return "medium"

# =================================
# 📥 RESPONSE MODELS  
# =================================

class APIInfo(BaseModel):
    """API root information"""
    message: str = Field(description="Welcome message")
    description: str = Field(description="API description")
    version: str = Field(description="API version")
    endpoints: Dict[str, str] = Field(description="Available endpoints")

class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(description="Service health status", examples=["healthy"])
    service: str = Field(description="Service name", examples=["culinary-crafts-api"])
    version: str = Field(description="Service version", examples=["1.0.0"])
    timestamp: Optional[datetime] = Field(default=None, description="Health check timestamp")
    uptime: Optional[str] = Field(default=None, description="Service uptime")

class ChatResponse(BaseModel):
    """AI assistant chat response"""
    conversation_id: str = Field(description="Unique conversation identifier")
    response: str = Field(description="AI assistant's response message")
    suggestions: List[str] = Field(
        default=[],
        description="Suggested follow-up actions or questions"
    )
    recipe_id: Optional[str] = Field(
        default=None,
        description="Related recipe ID if applicable"
    )
    estimated_time: Optional[int] = Field(
        default=None,
        description="Estimated cooking time in minutes"
    )
    state: Dict[str, Any] = Field(
        default={},
        description="Current conversation state for state machine"
    )

class NutritionInfo(BaseModel):
    """Nutritional information for recipes"""
    calories: int = Field(description="Calories per serving")
    protein: str = Field(
        description="Protein content", 
        examples=["12g"]
    )
    carbs: str = Field(
        description="Carbohydrate content", 
        examples=["25g"]
    )
    fat: str = Field(
        description="Fat content", 
        examples=["8g"]
    )
    
    # สำหรับตัวเลือก (Optional)
    fiber: Optional[str] = Field(
        default=None, 
        description="Fiber content", 
        examples=["5g"]
    )
    sodium: Optional[str] = Field(
        default=None, 
        description="Sodium content", 
        examples=["400mg"]
    )

class Recipe(BaseModel):
    """Recipe information"""
    recipe_id: str = Field(description="Unique recipe identifier")
    title: str = Field(description="Recipe title")
    description: str = Field(description="Recipe description")
    image_url: Optional[str] = Field(default=None, description="Recipe image URL")
    cooking_time: int = Field(description="Total cooking time in minutes")
    prep_time: Optional[int] = Field(default=None, description="Preparation time in minutes")
    difficulty: CookingDifficulty = Field(description="Cooking difficulty level")
    rating: Optional[float] = Field(default=None, description="Recipe rating (0-5)", ge=0, le=5)
    servings: int = Field(description="Number of servings", gt=0)
    cuisine_type: Optional[CuisineType] = Field(default=None, description="Cuisine type")
    dietary_tags: List[DietaryType] = Field(default=[], description="Dietary compatibility")
    ingredients: List[str] = Field(description="List of ingredients")
    instructions: List[str] = Field(description="Step-by-step cooking instructions")
    nutrition: Optional[NutritionInfo] = Field(default=None, description="Nutritional information")
    equipment_needed: List[str] = Field(
        default=[],
        description="Required kitchen equipment"
    )

class RecipeSearchResponse(BaseModel):
    """Recipe search results"""
    query: str = Field(description="Search query used")
    results: List[Recipe] = Field(description="List of matching recipes")
    total_results: int = Field(description="Total number of results found")
    page: int = Field(description="Current page number")
    per_page: int = Field(description="Results per page")
    filters_applied: Dict[str, Any] = Field(
        default={},
        description="Filters that were applied to the search"
    )

class CookingHistory(BaseModel):
    """User's cooking history"""
    recipes_tried: int = Field(description="Number of recipes attempted")
    favorite_recipes: List[str] = Field(description="List of favorite recipe IDs")
    saved_recipes: int = Field(description="Number of saved recipes")
    recent_activity: List[Dict[str, Any]] = Field(
        default=[],
        description="Recent cooking activities"
    )

class UserProfile(BaseModel):
    """Complete user profile"""
    user_id: str = Field(description="Unique user identifier")
    name: str = Field(description="User's display name")
    email: Optional[str] = Field(default=None, description="User's email address")
    profile_image: Optional[str] = Field(default=None, description="Profile image URL")
    preferences: UserPreferences = Field(description="User cooking preferences")
    cooking_history: CookingHistory = Field(description="User's cooking history")
    created_at: datetime = Field(description="Account creation timestamp")
    last_active: datetime = Field(description="Last activity timestamp")

class ErrorResponse(BaseModel):
    """Error response model"""
    detail: str = Field(description="Error description")
    status_code: int = Field(description="HTTP status code")
    timestamp: datetime = Field(description="Error occurrence timestamp")
    error_code: Optional[str] = Field(default=None, description="Internal error code")

# =================================
# 🔍 QUERY MODELS
# =================================

class RecipeSearchQuery(BaseModel):
    """Recipe search query parameters"""
    query: Optional[str] = Field(
            default=None,
            description="Search term for recipes",
            examples=["thai curry"]
    )
    dietary: Optional[List[DietaryType]] = Field(
        default=None,
        description="Dietary restrictions filter"
    )
    difficulty: Optional[CookingDifficulty] = Field(
        default=None,
        description="Cooking difficulty filter"
    )
    cuisine: Optional[CuisineType] = Field(
        default=None,
        description="Cuisine type filter"
    )
    max_cooking_time: Optional[int] = Field(
        default=None,
        description="Maximum cooking time in minutes",
        gt=0
    )
    available_ingredients: Optional[List[str]] = Field(
        default=None,
        description="Filter by available ingredients"
    )
    page: int = Field(default=1, description="Page number", ge=1)
    per_page: int = Field(default=10, description="Results per page", ge=1, le=100)
