# 🏗️ Culinary Crafts System Architecture (v2.0)

> **Last Updated**: March 29, 2026  
> **Version**: 2.0 - PostgreSQL Phase  
> **Status**: Production Ready

---

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CULINARY CRAFTS                          │
│                    (AI Cooking Assistant)                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐
│   Web Browser    │         │   Mobile App     │
│  (Next.js 14+)   │         │   (Web-based)    │
└────────┬─────────┘         └────────┬─────────┘
         │                           │
         │      HTTP/HTTPS           │
         └───────────┬───────────────┘
                     │
         ┌───────────▼───────────┐
         │   API Gateway Layer   │
         │  ├─ CORS Handling     │
         │  ├─ Rate Limiting     │
         │  └─ Request Logging   │
         └───────────┬───────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    │                │                │
┌───▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
│  Auth    │  │  API        │  │  Static    │
│ Service  │  │ Routes      │  │  Content   │
└───┬──────┘  └──────┬──────┘  └─────┬──────┘
    │                │               │
    │  JWT Verify    │ Business Logic│
    │                │               │
    └────────┬───────┼───────────────┘
             │       │
             │   ┌───▼─────────────────┐
             │   │  FastAPI Backend    │
             │   │  ├─ /api/v1/auth    │
             │   │  ├─ /api/v1/chat    │
             │   │  ├─ /api/v1/recipes │
             │   │  └─ /api/v1/user    │
             │   └───┬─────────────────┘
             │       │
    ┌────────┴───────┼──────────────────┐
    │                │                  │
    │                │                  │
┌───▼──────┐  ┌──────▼──────┐  ┌───────▼───┐
│  Google  │  │ PostgreSQL  │  │   Redis   │
│  Gemini  │  │   Database  │  │   Cache   │
│  API     │  │             │  │           │
└──────────┘  └─────────────┘  └───────────┘

┌─────────────────────────────────────────┐
│         Infrastructure Layer            │
├─────────────────────────────────────────┤
│  Docker Compose                         │
│  ├─ PostgreSQL (15-alpine)              │
│  ├─ Redis                               │
│  ├─ pgAdmin                             │
│  └─ Backend Service                     │
└─────────────────────────────────────────┘
```

---

## 🔄 Component Interaction Flow

```mermaid
graph TB
    User["👤 User"]
    Browser["🌐 Browser<br/>Next.js 14"]
    NextAuth["🔐 NextAuth.js<br/>Google OAuth"]
    API["⚡ FastAPI Backend<br/>Python 3.11+"]
    Gemini["🤖 Google Gemini<br/>Vision + Text Pro"]
    PG["🗄️ PostgreSQL<br/>users, conversations<br/>preferences"]
    Redis["⚙️ Redis Cache<br/>Session, API Response"]

    User -->|Login| Browser
    Browser -->|OAuth Flow| NextAuth
    NextAuth -->|Create Session| Redis
    Browser -->|Message + Image| API
    API -->|Verify JWT| Redis
    API -->|Analyze Image<br/>Generate Recipe| Gemini
    API -->|Store Data| PG
    API -->|Check Cache| Redis
    PG -->|Query User Pref| API
    API -->|Return JSON| Browser
    Browser -->|Display Chat| User
```

---

## 🛡️ Security Architecture

### Authentication & Authorization

```mermaid
sequenceDiagram
    actor User
    participant Browser as Next.js Browser
    participant OAuth as Google OAuth 2.0
    participant NextAuth as NextAuth.js
    participant Backend as FastAPI Backend
    participant DB as PostgreSQL

    User->>Browser: Click "Continue with Google"
    Browser->>OAuth: Send auth request
    OAuth->>User: Show Google login form
    User->>OAuth: Enter credentials
    OAuth->>Browser: Return auth code
    Browser->>NextAuth: Exchange code for session
    NextAuth->>Backend: Get user info
    Backend->>DB: Check/Create user
    DB->>Backend: Return user data
    Backend->>NextAuth: Return JWT token
    NextAuth->>Browser: Set session cookie
    Browser->>User: Redirect to dashboard
```

### Data Security Layers

```
Layer 1: Network Security
├─ HTTPS TLS 1.3
├─ CORS Validation
└─ Request Signing

Layer 2: API Security
├─ JWT Token Validation
├─ Rate Limiting (10 req/min per IP)
└─ Input Sanitization

Layer 3: Database Security
├─ Prepared Statements (SQL Injection Prevention)
├─ Role-Based Access Control
└─ Encrypted Passwords (bcrypt)

Layer 4: Application Security
├─ Environment Variable Secrets
├─ No hardcoded credentials
└─ Secure session management
```

---

## 📦 Data Architecture

### Core Tables

```mermaid
graph LR
    Users["👤 users<br/>id, email, name<br/>google_id, created_at"]

    Preferences["⚙️ user_preferences<br/>user_id, allergies<br/>ingredients<br/>dietary_restrictions"]

    Conversations["💬 conversations<br/>id, user_id<br/>message, response<br/>timestamp"]

    Users -->|1:1| Preferences
    Users -->|1:N| Conversations
```

### Database Schema SQL

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    allergies JSONB DEFAULT '[]',  -- ["peanut", "shellfish"]
    ingredients_available JSONB DEFAULT '[]',
    dietary_restrictions VARCHAR(255)[],  -- ['vegetarian', 'gluten-free']
    preferred_cuisines VARCHAR(100)[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    message_type VARCHAR(50),  -- 'text', 'image', 'multimodal'
    message_image_url TEXT,
    response_text TEXT,
    response_recipes JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE
);

-- Indexes for Performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id, timestamp DESC);
CREATE INDEX idx_preferences_user_id ON user_preferences(user_id);
```

---

## 🔗 Service Integration Points

### 1. **Google OAuth Integration**

```
Configuration:
├─ GOOGLE_CLIENT_ID
├─ GOOGLE_CLIENT_SECRET
└─ NEXTAUTH_SECRET

Flow:
User → NextAuth → Google Console → User Session → JWT Token
```

### 2. **Google Gemini Integration**

```
API Calls:
├── Image Analysis (Vision Pro)
│  └─ POST /v1/models/gemini-1.5-pro-vision:generateContent
│
└── Text Generation (Text Pro)
   └─ POST /v1/models/gemini-1.5-pro:generateContent

Response:
├─ Recipe recommendations
├─ Ingredient analysis
└─ Personalized suggestions
```

### 3. **PostgreSQL Integration**

```
Connection String:
postgresql://user:password@localhost:5432/culinary

Operations:
├─ Read: User preferences, conversation history
├─ Write: New conversations, preference updates
└─ Query: Filter recipes by allergies/restrictions
```

### 4. **Redis Integration**

```
Cache Keys:
├─ session:{user_id} → JWT tokens
├─ recipe_cache:{query_hash} → Query results
└─ rate_limit:{ip} → Request count

Operations:
├─ SET session data (TTL: 24h)
├─ GET cached recipes
└─ INCR rate limit counters
```

---

## 🚀 Deployment Architecture

### Local Development Stack

```
Docker Services (Background)
├─ PostgreSQL 15-alpine → :5432
├─ Redis → :6379
└─ pgAdmin → :5050

Local Processes (with hot-reload)
├─ FastAPI Backend → :8000
│  Command: uvicorn app.main:app --reload
│
└─ Next.js Frontend → :3000
   Command: npm run dev
```

### Production Stack (Future)

```
Cloud Platform (e.g., Azure/AWS)
├─ Frontend Deployment
│  └─ Vercel / Static Host
│
├─ Backend Deployment
│  └─ Container Service (Azure Container Apps)
│
├─ Database
│  └─ Managed PostgreSQL (RDS/Database for PostgreSQL)
│
└─ Caching
   └─ Managed Redis (ElastiCache/Azure Cache)
```

---

## 📊 Performance Considerations

### Caching Strategy

```
Request Flow:
User Query
  ├─ Check Redis Cache (5ms)
  │  ├─ HIT → Return cached response
  │  └─ MISS → Continue
  ├─ Query PostgreSQL (50-200ms)
  ├─ Call Gemini API (2-5s)
  ├─ Store in Redis (TTL: 1h)
  └─ Return response (< 6s total)
```

### Scalability Design

```
Horizontal Scaling:
┌────────────────────────────────┐
│   Load Balancer                │
├────────────────────────────────┤
│ Backend Instance 1 → :8000     │
│ Backend Instance 2 → :8001     │
│ Backend Instance 3 → :8002     │
├────────────────────────────────┤
│   Shared PostgreSQL Database   │
│   Shared Redis Cache           │
└────────────────────────────────┘
```

---

## 🔍 Monitoring & Logging

### Log Aggregation

```
Application Logs → Structured JSON → Log Storage
├─ Request/Response logs
├─ Authentication events
├─ Database queries
└─ API errors

Query Types:
└─ Show errors in last 1 hour
└─ Find slow database queries
└─ Track user login patterns
```

### Health Checks

```
Endpoint: /api/v1/health

Response:
{
  "status": "healthy",
  "timestamp": "2026-03-29T10:30:00Z",
  "components": {
    "database": "connected",
    "redis": "connected",
    "gemini_api": "reachable"
  }
}

Check Interval: Every 30 seconds
```

---

## 📋 Architecture Decision Records

### Decision 1: PostgreSQL vs Firestore

| Criteria    | PostgreSQL      | Firestore    |
| ----------- | --------------- | ------------ |
| Cost        | Low (free tier) | Pay-per-read |
| Control     | Full ownership  | Limited      |
| Scalability | Manual          | Automatic    |
| **Choice**  | ✅              | ❌           |

**Reason**: Development speed, cost control, full schema design flexibility.

---

### Decision 2: Google Gemini vs OpenAI

| Feature        | Gemini             | OpenAI      |
| -------------- | ------------------ | ----------- |
| Vision Model   | Pro with free tier | GPT-4V paid |
| Cost           | Free\*             | $$          |
| Response Speed | Fast               | Moderate    |
| **Choice**     | ✅                 | ❌          |

**Reason**: Free tier access, multimodal capabilities, fast response times.

---

### Decision 3: NextAuth.js vs Custom Auth

| Aspect              | NextAuth       | Custom                 |
| ------------------- | -------------- | ---------------------- |
| Implementation Time | 2 hours        | 40+ hours              |
| Security            | Battle-tested  | Custom vulnerabilities |
| OAuth Support       | Multi-provider | DIY                    |
| **Choice**          | ✅             | ❌                     |

**Reason**: Rapid development, industry-standard security, OAuth simplicity.

---

## 🔐 Environment Variables

```bash
# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# NextAuth
NEXTAUTH_SECRET=random-32-chars-minimum
NEXTAUTH_URL=http://localhost:3000

# Backend
GEMINI_API_KEY=AIzaSyD...
DATABASE_URL=postgresql://user:pass@localhost/culinary
REDIS_URL=redis://default:password@localhost:6379/0

# API Configuration
CORS_ORIGINS=["http://localhost:3000"]
ALLOWED_HOSTS=["localhost"]
API_PORT=8000
DEBUG=true
```

---

## 🎯 Next Architecture Steps

1. **Q2 2026**: Add message queue (Kafka/RabbitMQ) for async tasks
2. **Q2 2026**: Implement microservice separation (Auth, Recipe, Chat)
3. **Q3 2026**: Add CDN for static assets and image delivery
4. **Q3 2026**: Implement GraphQL API layer for optimization
5. **Q4 2026**: Add real-time WebSocket for live chat updates

---

**For detailed diagrams in visual format, see:**

- [Mermaid Diagrams](#mermaid-diagrams) (text-based)
- [Draw.io Export Ready](#draw-io-prompt) (diagram tool)
- [Architecture as Code](#), coming soon
