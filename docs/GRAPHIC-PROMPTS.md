# 📊 Technical Diagram Prompts (ข้อความสำหรับแผนผังเทคนิคal)

> **สำหรับสร้างแผนผังระบบเทคนิคมืออาชีพ**  
> **พร้อมใช้กับ**: Draw.io, Lucidchart, Miro, Excalidraw, Figma

---

## 🏗️ System Architecture Diagrams

### 1️⃣ System Architecture Diagram

    ```
    Create a system architecture diagram showing all components of Culinary Crafts:

    Layout: Layered architecture (left to right: Client → Services → Data)

    Layer 1: User Interface (Top)
    - Next.js Frontend (web/mobile browser)
    - Desktop icon
    - Mobile icon
    - Tablet icon

    Layer 2: API Gateway & Authentication
    - Auth Service (Google OAuth 2.0)
    - JWT Token Exchange
    - Rate Limiter
    - Request Router

    Layer 3: Backend Services (FastAPI)
    - Chat Service
    - Recipe Engine
    - User Service
    - Preference Service
    - All with async/await

    Layer 4: External AI Service
    - Google Gemini API (Vision + Text)
    - Multimodal processing box
    - Credential manager connection

    Layer 5: Data Layer
    - PostgreSQL Database (main data store)
    - Redis Cache (session/recipe cache)
    - Arrows showing: database queries, cache hits, cache misses

    Layer 6: Infrastructure & Monitoring
    - pgAdmin (database admin)
    - Docker containers (4 services shown)
    - Logs aggregation
    - Metrics collection

    Connections (Arrows):
    - All services → PostgreSQL (solid lines)
    - Service calls → Redis (dotted for cache)
    - Frontend → API Gateway (bold)
    - API → Gemini (external, dashed)
    - Services → Monitoring (thin lines)

    Color Scheme:
    - User Interface: Blue (#3498DB)
    - Authentication: Purple (#8E44AD)
    - Backend Services: Green (#27AE60)
    - External Service (Gemini): Orange (#F39C12)
    - Data Layer: Pink (#E91E63)
    - Infrastructure: Teal (#1ABC9C)
    - Text: Dark gray (#333333)

    Annotations:
    - Layer labels on left
    - Service names in boxes
    - Connection types labeled (HTTP, SQL, WebSocket, etc.)
    - Technology stack noted (Node.js, Python 3.11, PostgreSQL 15, etc.)

    Style:
    - Rounded rectangles for services
    - Arrows with labels
    - Grid background (subtle)
    - Clear hierarchy
    - Readable at any zoom level
    ```

---

### 2️⃣ Database Schema (ER Diagram) Prompt

```
Create an Entity-Relationship (ER) diagram for Culinary Crafts database:

Entities:

1. Users Table
   - user_id (PK)
   - email (UNIQUE)
   - google_id
   - username
   - created_at
   - updated_at
   - profile_picture_url
   - last_login

2. UserPreferences Table
   - preference_id (PK)
   - user_id (FK → Users)
   - dietary_type (enum: vegetarian, vegan, keto, etc.)
   - allergies (JSON array)
   - preferred_cuisines (JSON array)
   - skill_level (1-5)
   - meal_types (JSON: breakfast, lunch, dinner)
   - updated_at

3. Conversations Table
   - conversation_id (PK)
   - user_id (FK → Users)
   - title
   - created_at
   - updated_at
   - summary (cached summary for list view)

4. Messages Table
   - message_id (PK)
   - conversation_id (FK → Conversations)
   - user_id (FK → Users)
   - content
   - message_type (enum: text, image, system)
   - attachments (JSON array for images)
   - created_at

5. Recipes Table
   - recipe_id (PK)
   - title
   - ingredients (JSON array)
   - instructions (JSON array)
   - prep_time (minutes)
   - cook_time (minutes)
   - servings
   - dietary_info (JSON)
   - allergen_warnings (JSON array)
   - rating (average rating)
   - created_by (user or system)
   - source (Gemini generated or database)
   - created_at

6. SavedRecipes Table (Junction)
   - saved_recipe_id (PK)
   - user_id (FK → Users)
   - recipe_id (FK → Recipes)
   - saved_at
   - notes (user notes)

7. CacheEntries Table
   - cache_id (PK)
   - key (UNIQUE)
   - value (JSON)
   - ttl (time to live)
   - created_at
   - expires_at

8. AuditLog Table
   - log_id (PK)
   - user_id (FK → Users)
   - action (enum: login, search, recipe_save, etc.)
   - details (JSON)
   - timestamp

Relationships:
- Users (1) → (Many) Conversations
- Users (1) → (Many) Messages
- Conversations (1) → (Many) Messages
- Users (1) → (Many) SavedRecipes
- Recipes (1) → (Many) SavedRecipes
- Users (1) → (1) UserPreferences
- Users (1) → (Many) AuditLog

Cardinality Labels:
- 1 to Many: Line with crow's foot
- 1 to 1: Line with single end
- Optional: Broken line

Indexes:
- Users: email, google_id
- Conversations: user_id, created_at
- Messages: conversation_id, created_at
- SavedRecipes: user_id, recipe_id
- CacheEntries: expires_at (for cleanup)

Color Coding:
- User tables: Blue
- Content tables: Green
- System tables: Orange
- Foreign keys: Red arrows
- Primary keys: Bold text with key symbol

Style:
- Crow's foot notation
- Clear table structure
- Visible field types (INT, VARCHAR, JSON, etc.)
- Indexed fields marked with 🔑
```

---

### 3️⃣ User Workflows & Sequence Diagram Prompt

```
Create detailed sequence diagrams for 5 user workflows:

Workflow 1: Authentication Flow
Participants:
- User (Client)
- Next.js Frontend
- Auth API
- Google OAuth
- FastAPI Backend
- PostgreSQL

Sequence:
1. User clicks "Sign in with Google"
2. Frontend redirects to Google OAuth
3. Google auth page loads
4. User authenticates and grants permission
5. Google redirects with authorization code
6. Frontend exchanges code for token with Auth API
7. Auth API validates with Google
8. Auth API creates JWT token
9. Frontend stores JWT in secure cookie
10. Backend stores user session in PostgreSQL
11. Backend returns user profile
12. Frontend redirects to dashboard
13. User logged in successfully

Workflow 2: Text Search Flow (with Cache)
Participants:
- User
- Frontend
- API Gateway
- Backend Service
- Redis Cache
- PostgreSQL
- Gemini API

Sequence:
1. User types search query
2. Frontend sends query with user preferences
3. API Gateway receives request
4. Backend checks Redis cache for query
5. Cache HIT: Return cached recipes (3 seconds)
   OR Cache MISS:
6. Backend calls Gemini with query + preferences
7. Gemini analyzes and returns recipes (5 seconds)
8. Backend saves recipes to PostgreSQL
9. Backend caches result in Redis (TTL: 1 hour)
10. Backend returns recipes to frontend
11. Frontend displays recipes
12. User can save or share

Workflow 3: Image Search (Multimodal)
Participants:
- User
- Frontend (Camera)
- API Gateway
- Image Upload Service
- Gemini Vision API
- Backend Processing
- PostgreSQL
- Redis Cache

Sequence:
1. User opens camera or uploads photo
2. Frontend compresses image to 2MB max
3. Frontend sends image + preferences to API
4. API stores image temporarily
5. Backend sends image to Gemini Vision API
6. Gemini analyzes ingredients (2-3 seconds)
7. Gemini identifies N ingredients with confidence
8. Backend generates recipe query from ingredients
9. Backend checks Redis cache (might have similar query)
10. If cached: return with "cached" badge
11. If not cached: call Gemini text API for recipes
12. Backend validates recipes against allergens
13. Backend filters by user preferences
14. Backend returns recipes + ingredient analysis
15. Frontend displays "📸 Detected" badge
16. User selects recipe to view details

Workflow 4: User Preference Update
Participants:
- User
- Frontend Settings
- API Gateway
- Backend
- PostgreSQL
- Redis Cache

Sequence:
1. User navigates to Preferences
2. Frontend loads current preferences
3. Backend queries PostgreSQL
4. Returns current settings
5. User modifies allergies (add: peanuts)
6. User adjusts skill level (Beginner → Intermediate)
7. User clicks "Save"
8. Frontend sends updated preferences
9. Backend validates data
10. Backend updates PostgreSQL
11. Backend invalidates relevant Redis cache entries
12. Backend returns confirmation
13. Frontend shows "✅ Preferences saved"
14. System ready for next search with new filters

Workflow 5: Error Recovery (Timeout Scenario)
Participants:
- User
- Frontend
- API Gateway
- Backend
- Gemini API
- Fallback System

Sequence:
1. User sends search query
2. Frontend shows loading state
3. Backend queries Gemini
4. Gemini processing (slow, >8 seconds)
5. Frontend timeout triggered (8 seconds)
6. Backend still waiting on Gemini
7. Frontend shows retry button: "Request taking longer..."
8. Gemini API responds (12 seconds total)
9. Backend receives and processes results
10. Backend checks if frontend already timed out
11. Backend returns error response
12. User clicks "Try Again"
13. Frontend resends WITH cache preference
14. This time: cache hit or faster response
15. Results displayed
16. Backend logs timeout incident to audit log

Style for All Diagrams:
- Vertical time progression
- Clear participant columns
- Numbered sequence steps
- Decision points shown as diamonds (Cache hit/miss)
- Async calls shown with dashed arrows
- Timing annotations on some steps
- Color-coded by service type
- Clearly marked error paths
```

---

### 4️⃣ API Interaction Diagram Prompt

```
Create an API endpoint interaction diagram:

API Base URL: https://api.culinarycrafts.com/v1

Endpoints (Grouped by resource):

Authentication Endpoints:
POST   /auth/google/callback
  Input: { code, state }
  Output: { access_token, user }
  Auth: None (OAuth)

GET    /auth/me
  Input: None
  Output: { user_id, email, username, preferences }
  Auth: JWT

Chef Endpoints:
POST   /chat/message
  Input: { conversation_id, message, attachments }
  Output: { message_id, ai_response, recipes }
  Auth: JWT

POST   /chat/multimodal
  Input: { conversation_id, image_file, preferences }
  Output: { detected_ingredients, recipes, analysis }
  Auth: JWT

GET    /chat/history/{conversation_id}
  Input: conversation_id
  Output: [ { message_id, content, timestamp }, ... ]
  Auth: JWT

Recipe Endpoints:
GET    /recipes/search?query=pasta&diet=vegetarian
  Input: query, dietary_type, allergies, skill_level
  Output: [ { recipe_id, title, ingredients, rating }, ... ]
  Auth: JWT (optional)

GET    /recipes/{recipe_id}
  Input: recipe_id
  Output: { recipe_id, title, ingredients, instructions, nutrition }
  Auth: JWT (optional)

POST   /recipes/{recipe_id}/save
  Input: recipe_id, notes (optional)
  Output: { saved_recipe_id, saved_at }
  Auth: JWT

GET    /recipes/saved
  Input: None
  Output: [ { recipe_id, title, saved_at }, ... ]
  Auth: JWT

User Endpoints:
GET    /user/profile
  Input: None
  Output: { user_id, email, username, preferences, saved_recipes_count }
  Auth: JWT

PUT    /user/preferences
  Input: { allergies, dietary_type, cuisines, skill_level, meal_types }
  Output: { preference_id, updated_at }
  Auth: JWT

DELETE /user/preferences/allergy/{allergen}
  Input: allergen
  Output: { success, message }
  Auth: JWT

Health Endpoints:
GET    /health
  Input: None
  Output: { status, timestamp, services_status }
  Auth: None

Error Responses (All Endpoints):
- 400: Bad Request (validation error)
- 401: Unauthorized (missing JWT)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error
- 503: Service Unavailable

All responses include:
{
  "success": boolean,
  "data": { ... },
  "error": null or { "code", "message" },
  "timestamp": ISO8601
}

Performance Targets:
- /auth/me: < 100ms
- /chat/message: < 2s
- /chat/multimodal: < 8s
- /recipes/search: < 3s
- /recipes/saved: < 500ms
- Cache hit: < 500ms

Rate Limits:
- Authenticated users: 100 requests/minute
- Anonymous: 20 requests/minute
- Image upload: 5 per minute

Visual Layout:
- Three columns: Method | Endpoint | Response
- Color code by HTTP method (POST=green, GET=blue, PUT=orange, DELETE=red)
- Show auth requirement clearly
- Display timing targets
- Grouped by logical resource area
```

---

### 5️⃣ Deployment Architecture Diagram Prompt

```
Create a deployment architecture showing environments and services:

Development Environment:
- Docker Compose (Local machine)
- 4 Services in containers
- Ports 3000 (frontend), 8000 (API), 5432 (DB), 6379 (Redis)
- All services connect through docker network
- Volumes mounted for live reload

Production Environment (Azure):

Compute:
- Azure Container App (Frontend)
  - Auto-scale: 1-5 instances
  - CDN: Azure Front Door
  - SSL/TLS termination

- Azure Container App (API Backend)
  - Auto-scale: 2-10 instances
  - Load balancer: Layer 7 (HTTP)
  - Environment variables encrypted

Database & Cache:
- Azure Database for PostgreSQL
  - Single server (15-alpine)
  - Automated backups (daily)
  - SSL connection required
  - Private endpoint access

- Azure Cache for Redis
  - Standard tier (C1)
  - Persistence enabled
  - Virtual network integration

External Services:
- Google Gemini API
  - API key in Key Vault
  - Rate limiting: 60 requests/minute
  - Error handling for API outages

Security:
- Azure Key Vault
  - Stores API keys, DB passwords
  - Managed identities for access
  - Rotation policies

- Application Insights
  - Logs all API errors
  - Performance metrics
  - Alert rules (error rate > 1%)

- Network Security Group
  - Inbound: Only from Load Balancer
  - Outbound: To Gemini API only

Storage:
- Azure Blob Storage
  - User uploaded images (temporary)
  - Cleanup: 24 hour retention
  - Encrypted at rest

Networking:
- Virtual Network (Private)
- Subnets: Frontend, Backend, Database
- NAT Gateway for outbound IP stability
- Network Peering (if using on-premises)

Monitoring & Alerting:
- Azure Monitor
  - CPU usage
  - Memory usage
  - Request latency
  - Error rates

- Alerts trigger:
  - API response time > 5s
  - Error rate > 1%
  - Cache hit ratio < 50%
  - Database connections > threshold

CI/CD Pipeline:
GitHub → GitHub Actions → Build → Test → Push to ACR → Deploy to ACA

Flow:
1. Push to main branch
2. GitHub Actions runs tests
3. Docker image built
4. Pushed to Azure Container Registry
5. Triggers deployment to Container Apps
6. Health checks validate deployment
7. Old version rolled back if failed

Disaster Recovery:
- Database geo-redundant backup (secondary region)
- Regular restore testing (monthly)
- RTO: 4 hours
- RPO: 1 hour

Visual Layout:
- Local dev environment (top-left)
- Cloud infrastructure (center/right)
- External services (top-right)
- Monitoring/Alerting (bottom)
- Arrows showing data flow
- Color coding: Dev=gray, Production=blue, External=orange
```

---

### 6️⃣ Cache Strategy Diagram Prompt

```
Create a caching strategy diagram showing cache layers:

Request Flow with Cache Decision:

Step 1: User Search Request
↓
Step 2: Check Cache Layer 1 (In-Memory)
- Query hash computed
- Is it in Redis?
  ✅ YES → Return immediately (< 100ms) [Cache HIT]
  ❌ NO → Continue to Step 3

Step 3: Database Query
- Check if recipe exists in PostgreSQL
  ✅ YES → Load from DB (< 500ms)
  ❌ NO → Continue to Step 4

Step 4: Gemini API Call
- Send query to Google Gemini
- Wait for response (2-5s)
- Error handling: Fallback to popular recipes

Step 5: Store Results
- Save to Redis with TTL
  - Recipe results: TTL = 1 hour (3600s)
  - Search queries: TTL = 24 hours (86400s)
  - User sessions: TTL = 7 days

Step 6: Return to User
- Frontend receives recipes
- Shows "⚡ From Cache" badge if cache hit
- Timeline: 100ms-5000ms total

Cache Invalidation:
1. Time-based (TTL expires)
2. Event-based:
   - User updates preferences → Invalidate related cache
   - New recipe added → Check for related cache entries
   - Gemini API changes → Full cache clear

Cache Keys Structure:
- Recipe search: cache_key = "recipe:search:{query}:{user_preferences_hash}"
- User session: cache_key = "session:{user_id}"
- Popular recipes: cache_key = "popular:recipes:{category}"

Performance Metrics:
- Cache hit ratio target: > 60%
- Cache miss penalty: + 2-5 seconds
- Storage: Redis max 2GB (auto-cleanup oldest entries)

Monitoring Metrics:
- Cache hit rate (by query type)
- Cache memory usage
- Eviction rate (if full)
- TTL expiration rate

Visual Elements:
- Decision tree showing cache logic
- Timing bars for each operation layer
- Cache hit vs miss paths (different colors)
- TTL durations shown on nodes
- Redis memory usage gauge
- Performance impact annotations
```

---

### 7️⃣ Security Architecture Diagram Prompt

```
Create a security architecture diagram showing all security layers:

Layer 1: Network Security (Outer)
- Azure Front Door (DDoS protection)
- WAF (Web Application Firewall)
- Rate limiting at edge
- Blocks suspicious patterns

Layer 2: Transport Security
- TLS 1.3 encryption (all traffic)
- Certificate: Managed by Azure
- HTTPS only (redirect HTTP → HTTPS)
- API endpoints: HTTPS only

Layer 3: Authentication & Authorization
- Google OAuth 2.0 integration
- JWT token issuance (RS256)
- Token expiration: 1 hour
- Refresh token: 7 days
- Roles: User, Admin, Moderator

Layer 4: API Gateway Security
- Request validation (schema)
- Input sanitization (prevent SQL injection)
- Rate limiting per user (100 req/min)
- CORS configuration (trusted domains only)
- Headers validation

Layer 5: Backend Service Security
- Service-to-service authentication (mTLS)
- Environment variables encrypted
- Secrets in Azure Key Vault
- Encrypted at rest: AES-256

Layer 6: Database Security
- PostgreSQL SSL connection required
- Row-level security (users see only their data)
- Encrypted passwords (bcrypt)
- Audit logging for sensitive operations
- Regular backups encrypted
- Firewall: Allow only from application subnet

Layer 7: Data Protection
- User PII encrypted at rest
- API keys rotated monthly
- Image uploads scanned for malware
- Temporary images deleted after 24hrs
- GDPR compliance: Deletion pipeline in place

Layer 8: Monitoring & Logging
- Application Insights: All API calls logged
- Failed auth attempts logged
- Suspicious patterns trigger alerts
- Log retention: 90 days
- Logs encrypted and access-controlled

Secrets Management:
- All credentials in Azure Key Vault
- Managed Identity for service access
- No secrets in code/config/environment
- Rotation policy: Every 90 days

Vulnerability Management:
- Dependency scanning (monthly)
- Container image scanning
- Penetration testing (quarterly)
- Bug bounty program

Compliance:
- GDPR ready (user data export/deletion)
- PCI DSS (no payment data stored)
- SOC 2 type II audit trail
- Privacy policy available

Security Response:
- Incident response team on-call
- Max response time: 1 hour
- Communication protocol defined
- Post-incident review process

Visual Elements:
- Concentric circles for layers
- Each layer shows specific controls
- External threats on outside
- Internal critical assets in center
- Color coding by area (Auth=purple, Network=blue, etc.)
- Success vs security pathways highlighted
```

---

### 8️⃣ Component Dependencies Diagram Prompt

```
Create a component dependency graph:

Frontend (next.js-app)
├── Dependencies
│   ├── next@14.0
│   ├── react@18.2
│   ├── typescript@5.2
│   ├── tailwindcss@3.3
│   ├── next-auth@5.0 → depends on: Google OAuth SDK
│   ├── axios@1.4 → for API calls
│   └── framer-motion@10.0 → animations
└── External
    ├── Google OAuth Library
    └── CSS Framework (Tailwind)

Backend (FastAPI-app)
├── Core Dependencies
│   ├── fastapi@0.100
│   ├── uvicorn@0.23 → ASGI server
│   ├── pydantic@2.3
│   ├── sqlalchemy@2.0
│   ├── alembic@1.12 → database migrations
│   └── python@3.11
├── API Integration
│   ├── google-auth@2.3 → OAuth validation
│   ├── google-generativeai@0.3 → Gemini API
│   └── httpx@0.24 → async HTTP client
├── Database
│   ├── psycopg[binary]@3.2 → PostgreSQL adapter
│   └── redis@5.0 → cache client
├── Security
│   ├── python-jose@3.3 → JWT handling
│   ├── passlib@1.7 → password hashing
│   └── python-multipart@0.0 → form data handling
└── Development
    ├── pytest@7.4 → testing
    ├── black@23.8 → code formatting
    └── flake8@6.0 → linting

Database Layer
├── PostgreSQL@15
│   ├── pgAdmin@7 → admin interface
│   ├── psycopg → adapter to FastAPI
│   └── sqlalchemy → ORM
├── Redis@7
│   ├── redis-py → Python client
│   └── Cache management

External Services
├── Google Gemini API
│   └── google-generativeai package
├── Google OAuth 2.0
│   └── google-auth package
└── Monitoring
    ├── Application Insights (Azure)
    └── Log Analytics

Docker & Orchestration
├── Docker@latest
├── Docker Compose
├── Kubernetes (optional, future)
│   └── Helm charts

Dependency Hierarchy:
- Level 0 (Core): Python, Node.js runtime
- Level 1 (Framework): FastAPI, Next.js, React
- Level 2 (Support): Pydantic, Tailwind, TypeScript
- Level 3 (Integration): google-generativeai, next-auth
- Level 4 (Infrastructure): PostgreSQL, Redis
- Level 5 (Monitoring): Application Insights

Conflict Resolution:
- No conflicting versions detected ✅
- All packages aligned with Python 3.11+ / Node 18+
- Security patches applied monthly

Dependency Tree by Concern:
```

Authentication Branch:
next-auth → Google OAuth SDK
│ → python-jose (JWT)
│ → passlib (hashing)

AI Integration Branch:
google-generativeai → google-auth
→ httpx (async calls)

Database Branch:
sqlalchemy → psycopg
→ redis-py
→ alembic (migrations)

UI/Styling Branch:
tailwindcss → postcss
→ autoprefixer
next-auth (UI components)

```

Visual Layout:
- Nodes for each package
- Arrows showing dependencies
- Color coding by type:
  - Framework: Blue
  - API/Integration: Orange
  - Database: Green
  - Security: Purple
  - Utility: Gray
- Dependency version conflicts shown in red
- Security vulnerabilities flagged with ⚠️
```

---

## 🔍 Ready-to-Use Diagram Tools

**Best Tools for Each Diagram Type**:

| Diagram              | Best Tool                | Format                    |
| -------------------- | ------------------------ | ------------------------- |
| System Architecture  | Draw.io, Lucidchart      | SVG, PNG                  |
| Database Schema (ER) | Lucidchart, dbdiagram.io | SVG, SQL                  |
| Sequence Workflows   | Miro, Draw.io            | Flowchart, SVG            |
| API Endpoints        | Stoplight, Swagger UI    | Interactive, OpenAPI      |
| Deployment           | Lucidchart, Miro         | SVG, Architecture drawing |
| Cache Strategy       | Draw.io, Excalidraw      | Flowchart, SVG            |
| Security             | Lucidchart, Miro         | Layered diagram           |
| Dependencies         | Miro, Excalidraw         | Graph, SVG                |

**Export Recommendations**:

- For presentations: SVG or high-res PNG (300 DPI)
- For documentation: SVG (scalable) or embedded interactive links
- For printing: PDF or high-res PNG

**Mermaid.js Ready** (Can embed directly in docs):

- Flowcharts (workflows)
- Sequence diagrams (user interactions)
- ER diagrams (database schema)
- State diagrams (cache logic)
- Deployment diagrams (architecture)

---

## 💡 Design System Reference

### Color Palette for Diagrams

```
Primary:     Cream (#FFFCF2)      - Backgrounds
Accent:      Terracotta (#FF6B35)  - Highlights
Secondary:   Sage Green (#4F772D)  - Supporting
Dark Gray:   #333333              - Text
Light Gray:  #EEEEEE              - Borders

Architecture & Service Colors:
Frontend:    Blue (#3498DB)
Backend:     Green (#27AE60)
Database:    Pink (#E91E63)
Cache:       Purple (#8E44AD)
External:    Orange (#F39C12)
Infrastructure: Teal (#1ABC9C)
Error:       Red (#E74C3C)
Success:     Green (#27AE60)
```

### Diagram Typography

```
Headers:     Poppins Bold (14-18px)
Body:        Inter Regular (11-13px)
Labels:      Inter Regular (10-12px)
```

---

**Ready to create technical diagrams?**
Use **Draw.io**, **Lucidchart**, **Miro**, or **Excalidraw** with these 8 prompts! 📊

---

---

## 💡 Design System Reference
