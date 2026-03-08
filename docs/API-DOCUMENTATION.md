# 🍳 Culinary Crafts - Backend API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:8000`  
**API Prefix:** `/api/v1`

---

## 🔐 Authentication

Currently using **development mode** - production will implement JWT authentication.

```http
Authorization: Bearer <jwt_token>
```

---

## 📋 API Endpoints Overview

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|---------|
| `/` | GET | API Root & Info | ✅ Ready |
| `/health` | GET | Health Check | ✅ Ready |
| `/chat` | POST | AI Assistant Chat | 🚧 Coming Soon |
| `/recipes` | GET | Recipe Search | 🚧 Coming Soon |
| `/user/profile` | GET | User Profile | 🚧 Coming Soon |

---

## 🚀 API Endpoints Details

### 1. **Root Endpoint**
Get API information and available endpoints.

```http
GET /
```

**Response:**
```json
{
  "message": "🍳 Culinary Crafts API",
  "description": "AI Cooking Assistant with Agentic Workflow",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/v1/health",
    "chat": "/api/v1/chat", 
    "recipes": "/api/v1/recipes",
    "user": "/api/v1/user"
  }
}
```

### 2. **Health Check**
Monitor API status and health.

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "culinary-crafts-api",
  "version": "1.0.0"
}
```

### 3. **Chat with AI Assistant** 🤖
Interact with the AI cooking assistant using LangGraph state machine.

```http
POST /chat
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "How do I make Thai green curry?",
  "user_id": "user_123",
  "context": {
    "dietary_preferences": ["vegetarian"],
    "available_ingredients": ["coconut milk", "green curry paste"],
    "cooking_skill": "beginner"
  }
}
```

**Response:**
```json
{
  "message": "Chat endpoint - Coming soon!",
  "input": { /* your request */ },
  "response": "🤖 AI Agent will be implemented here with LangGraph State Machine"
}
```

**Coming Soon (LangGraph Integration):**
```json
{
  "conversation_id": "conv_456",
  "response": {
    "message": "I'll help you make Thai green curry! Here's a beginner-friendly recipe...",
    "suggestions": ["Show recipe", "Alternative ingredients", "Cooking tips"],
    "recipe_id": "recipe_789",
    "estimated_time": "30 minutes"
  },
  "state": {
    "current_step": "recipe_selection",
    "user_preferences": { /* saved preferences */ }
  }
}
```

### 4. **Recipe Search** 🔍
Search for recipes using Vertex AI RAG implementation.

```http
GET /recipes?query=thai curry&dietary=vegetarian&difficulty=easy
```

**Query Parameters:**
- `query` (string): Recipe search term
- `dietary` (string): Dietary restrictions (vegetarian, vegan, gluten-free)
- `difficulty` (string): Cooking difficulty (easy, medium, hard)
- `cuisine` (string): Cuisine type (thai, italian, mexican, etc.)
- `cooking_time` (integer): Maximum cooking time in minutes

**Current Response:**
```json
{
  "message": "Recipe search endpoint - Coming soon!",
  "response": "🔍 Vertex AI Search integration will be implemented here"
}
```

**Coming Soon (Vertex AI Integration):**
```json
{
  "query": "thai curry",
  "results": [
    {
      "recipe_id": "recipe_789",
      "title": "Easy Thai Green Curry",
      "description": "A simple and delicious vegetarian Thai green curry",
      "image_url": "https://storage.googleapis.com/recipes/thai-curry.jpg",
      "cooking_time": 30,
      "difficulty": "easy",
      "rating": 4.8,
      "ingredients": [
        "2 cans coconut milk",
        "2 tbsp green curry paste",
        "Mixed vegetables"
      ],
      "instructions": [
        "Heat coconut milk in a large pan",
        "Add curry paste and stir well",
        "Add vegetables and simmer"
      ],
      "nutrition": {
        "calories": 320,
        "protein": "12g",
        "carbs": "25g",
        "fat": "18g"
      }
    }
  ],
  "total_results": 15,
  "page": 1,
  "per_page": 10
}
```

### 5. **User Profile** 👤
Manage user profiles and preferences with Firestore.

```http
GET /user/profile
Authorization: Bearer <jwt_token>
```

**Current Response:**
```json
{
  "message": "User profile endpoint - Coming soon!",
  "response": "👤 Firestore user profile management will be implemented here"
}
```

**Coming Soon (Firestore Integration):**
```json
{
  "user_id": "user_123",
  "profile": {
    "name": "Alex Chen",
    "email": "alex@example.com",
    "dietary_preferences": ["vegetarian"],
    "allergies": ["nuts", "shellfish"],
    "cooking_skill": "intermediate",
    "favorite_cuisines": ["thai", "italian", "japanese"],
    "kitchen_equipment": ["oven", "stovetop", "microwave", "blender"]
  },
  "cooking_history": {
    "recipes_tried": 25,
    "favorite_recipes": ["recipe_789", "recipe_456"],
    "saved_recipes": 12
  },
  "preferences": {
    "language": "en",
    "measurement_units": "metric",
    "spice_level": "medium"
  }
}
```

---

## 🔮 Upcoming Features (Roadmap)

### **LangGraph State Machine Integration** 🤖
- **Conversational AI**: Multi-turn conversations with context
- **Recipe Guidance**: Step-by-step cooking guidance
- **Ingredient Substitution**: Smart ingredient alternatives
- **Cooking Assistance**: Real-time cooking help

### **Vertex AI Search (RAG)** 🔍
- **Semantic Recipe Search**: Natural language recipe queries
- **Ingredient-based Search**: Find recipes by available ingredients
- **Nutritional Filtering**: Search by dietary requirements
- **Image Search**: Find recipes by food photos

### **Advanced User Management** 👤
- **LINE Login Integration**: Seamless authentication
- **Preference Learning**: AI learns user preferences
- **Cooking History**: Track cooking achievements
- **Social Features**: Share recipes and reviews

### **Real-time Features** ⚡
- **WebSocket Support**: Real-time cooking assistance
- **Timer Management**: Multiple cooking timers
- **Voice Commands**: Hands-free cooking assistance
- **Image Recognition**: Identify ingredients and dishes

---

## 🛠️ Testing the API

### **Using curl:**
```bash
# Health check
curl http://localhost:8000/health

# Get API info
curl http://localhost:8000/

# Test chat (current)
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello AI chef!"}'

# Test recipe search
curl "http://localhost:8000/recipes?query=pasta"
```

### **Using Python requests:**
```python
import requests

# Health check
response = requests.get("http://localhost:8000/health")
print(response.json())

# Chat with AI
chat_data = {
    "message": "How do I make carbonara?",
    "user_id": "test_user",
    "context": {"cooking_skill": "beginner"}
}
response = requests.post("http://localhost:8000/chat", json=chat_data)
print(response.json())
```

### **Using JavaScript fetch:**
```javascript
// Health check
fetch('http://localhost:8000/health')
  .then(response => response.json())
  .then(data => console.log(data));

// Chat with AI
const chatData = {
  message: "What's for dinner?",
  user_id: "test_user",
  context: { dietary_preferences: ["vegetarian"] }
};

fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(chatData)
})
.then(response => response.json())
.then(data => console.log(data));
```

---

## 🐳 Docker API Testing

When running with Docker, the API is available at:
- **Internal Docker network**: `http://backend:8000`
- **External access**: `http://localhost:8000`

---

## 🔧 Development Notes

### **Adding New Endpoints:**
1. Add route to `backend/app/api/router.py`
2. Import required dependencies
3. Add proper type hints and documentation
4. Test with FastAPI docs: `http://localhost:8000/docs`

### **Database Integration:**
- **Firestore**: User profiles, preferences, history
- **Redis**: Session management, caching
- **PostgreSQL**: Structured data, analytics

### **Error Handling:**
All endpoints return consistent error formats:
```json
{
  "detail": "Error description",
  "status_code": 400,
  "timestamp": "2026-03-09T10:30:00Z"
}
```

---

## 📊 Interactive API Documentation

**Swagger UI**: http://localhost:8000/docs  
**ReDoc**: http://localhost:8000/redoc

> **Note**: Start the backend server first:
> ```bash
> # Local development
> .\scripts\ultra-start.bat
> 
> # Or with Docker
> .\scripts\docker-start.bat
> ```

---

**🍳 Ready to build the ultimate AI cooking assistant!** 🚀