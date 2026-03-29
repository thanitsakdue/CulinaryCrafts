# 🔄 User Workflows & Interaction Flows

> **Last Updated**: March 29, 2026  
> **Version**: 2.0 - PostgreSQL Implementation  
> **Audience**: Product & Engineering Teams

---

## 🎯 Workflow Overview

The system supports three main user workflows:

1. **Authentication Flow** - User login and session management
2. **Recipe Discovery Flow** - Text or image-based recipe search
3. **Personalization Flow** - User preference management and customization

---

## 📋 Workflow 1: Authentication & Onboarding

### User Story

> As a new user, I want to quickly authenticate with my Google account and access the app without complicated setup

### Step-by-Step Workflow

```mermaid
sequenceDiagram
    actor User
    participant Browser as Next.js 14
    participant NextAuth as NextAuth.js
    participant OAuth as Google OAuth
    participant Backend as FastAPI
    participant DB as PostgreSQL
    participant Redis as Redis

    User->>Browser: Visit app (localhost:3000)
    Browser->>Browser: Check session cookie

    alt No session
        Browser->>User: Show login page
        User->>Browser: Click "Continue with Google"
        Browser->>NextAuth: Trigger OAuth flow
        NextAuth->>OAuth: Redirect to Google login
        OAuth->>User: Show login form
        User->>OAuth: Enter credentials
        OAuth->>NextAuth: Return auth code
        NextAuth->>Backend: POST /api/auth/verify
        Backend->>DB: Check if user exists

        alt User exists
            Backend->>DB: Update last_login
        else New user
            Backend->>DB: CREATE new user record
            Backend->>DB: CREATE default preferences
        end

        Backend->>Redis: Store session (TTL: 24h)
        Backend->>NextAuth: Return JWT + user data
        NextAuth->>Browser: Set session cookie
        Browser->>User: Redirect to dashboard
    else Session exists
        Browser->>User: Show dashboard
    end

    User->>Browser: Fill in preferences (optional)
    Browser->>Backend: PATCH /api/v1/user/preferences
    Backend->>DB: Update user_preferences
    Backend->>Redis: Invalidate cache
    Backend->>Browser: Return success
```

### Success Criteria

- ✅ User logged in within 3 seconds
- ✅ Session persists across browser refreshes
- ✅ User preferences saved to database
- ✅ No manual password entry

### Error Handling

| Error          | Cause                       | Resolution                 |
| -------------- | --------------------------- | -------------------------- |
| OAuth mismatch | Redirect URI not registered | Check Google Cloud Console |
| Session lost   | Redis expired               | User re-authenticates      |
| Database error | Connection failed           | Show retry message         |

---

## 📸 Workflow 2: Recipe Discovery (Text-based)

### User Story

> As a home cook, I want to quickly find recipes based on available ingredients and preferences with AI assistance

### Detailed Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Chat UI
    participant Frontend as Next.js
    participant Backend as FastAPI
    participant Redis as Redis Cache
    participant DB as PostgreSQL
    participant Gemini as Google Gemini

    User->>UI: Type ingredient list<br/>"pasta, tomato, garlic"
    UI->>UI: Show typing indicator

    User->>UI: Click Send
    Frontend->>Backend: POST /api/v1/chat<br/>{"message": "...", "type": "text"}

    Backend->>Redis: GET session:{user_id}
    Redis->>Backend: Return user context

    Backend->>DB: SELECT user_preferences
    DB->>Backend: Return allergies, restrictions

    Backend->>Redis: CHECK recipe_cache:{hash}

    alt Cache HIT (< 1 minute old)
        Redis->>Backend: Return cached recipes
        Backend->>Backend: Format response
    else Cache MISS
        Backend->>Gemini: POST generateContent<br/>ingredients + preferences
        Gemini->>Backend: Return recipe recommendations<br/>(JSON with title, steps, nutrition)
        Backend->>DB: INSERT conversation log
        Backend->>Redis: SET recipe_cache:{hash} (TTL: 1h)
    end

    Backend->>Frontend: Return recipes + metadata
    Frontend->>UI: Parse and render recipes
    UI->>User: Display 3-5 recipe options<br/>with images and ratings

    User->>UI: Click recipe → View details
    UI->>User: Show full ingredients, steps, prep time
```

### UI Mockup Flow

```
┌─────────────────────────────────────┐
│  Culinary Crafts Chat               │
├─────────────────────────────────────┤
│                                     │
│ You: pasta, tomato, garlic          │
│                            [✓]      │
│                                     │
│ AI: Based on your ingredients I     │
│ found these recipes:                │
│                                     │
│ ┌────────────────────────────────┐ │
│ │ 🍝 Pasta al Pomodoro           │ │
│ │ Prep: 15 min | Cook: 20 min    │ │
│ │ ⭐ 4.8 (245 reviews)           │ │
│ │ [View Recipe]                  │ │
│ └────────────────────────────────┘ │
│                                     │
│ ┌────────────────────────────────┐ │
│ │ 🍝 Aglio e Olio                │ │
│ │ Prep: 10 min | Cook: 5 min     │ │
│ │ ⭐ 4.5 (189 reviews)           │ │
│ │ [View Recipe]                  │ │
│ └────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [Input field] Type ingredients...   │
└─────────────────────────────────────┘
```

---

## 📸 Workflow 3: Recipe Discovery (Image-based)

### User Story

> As a busy home cook, I want to take a photo of my fridge ingredients and get recipe recommendations without typing

### Multimodal Flow

```mermaid
sequenceDiagram
    actor User
    participant Camera as Camera/Upload
    participant Frontend as Next.js
    participant Backend as FastAPI
    participant Gemini as Gemini Vision
    participant DB as PostgreSQL
    participant UI as Chat UI

    User->>Camera: Take photo or select from gallery
    Camera->>Frontend: Return image file

    Frontend->>Frontend: Create FormData with image
    Frontend->>Frontend: Show image preview

    User->>UI: [Optional] Add text context<br/>"Can you make a vegetarian dish?"

    User->>UI: Click Send
    Frontend->>Backend: POST /api/v1/chat/multimodal<br/>{image_file, text_context}

    Backend->>Backend: Validate image (format, size)
    Backend->>Backend: Resize if needed

    Backend->>DB: SELECT user_preferences
    DB->>Backend: Return allergies, dietary restrictions

    Backend->>Gemini: POST generateContent<br/>model: gemini-1.5-pro-vision<br/>(image + prompt)

    Gemini->>Backend: Return detected ingredients<br/>["tomato", "basil", "mozzarella", ...]

    Backend->>Gemini: Generate recipes based on<br/>detected ingredients + preferences

    Gemini->>Backend: Return personalized recipes

    Backend->>DB: INSERT conversation<br/>(user_id, image_url, message, response)

    Backend->>Frontend: Return recipes + detected ingredients

    Frontend->>UI: Display detected items + recipes
    UI->>User: Show "We found: tomato, basil..."<br/>+ Recipe recommendations
```

### Image Processing Pipeline

```
1. Upload & Validation (Frontend)
   ├─ Check file type (JPEG, PNG)
   ├─ Check file size (< 5MB)
   └─ Show preview

2. Backend Processing
   ├─ Save to disk/storage
   ├─ Generate thumbnail
   └─ Create secure URL

3. Gemini Vision Analysis
   ├─ Send image to Gemini 1.5 Pro Vision
   ├─ Extract detected ingredients
   ├─ Assess freshness/quality
   └─ Cross-reference with DB

4. Recipe Generation
   ├─ Filter by allergies
   ├─ Filter by dietary restrictions
   ├─ Rank by convenience
   └─ Return top 5 recipes

5. Response to User
   ├─ Show detected ingredients
   ├─ Show confidence scores
   └─ Display recipe cards
```

---

## ⚙️ Workflow 4: Preference Management

### User Story

> As a user with allergies, I want to save my dietary restrictions so recommendations are always safe

### Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Settings UI
    participant Frontend as Next.js
    participant Backend as FastAPI
    participant DB as PostgreSQL
    participant Redis as Redis

    User->>UI: Go to Profile/Settings
    Frontend->>Backend: GET /api/v1/user/preferences
    Backend->>Redis: CHECK preference_cache:{user_id}

    alt Cache HIT
        Redis->>Backend: Return cached preferences
    else Cache MISS
        Backend->>DB: SELECT user_preferences
        DB->>Backend: Return preferences
        Backend->>Redis: SET preference_cache
    end

    Backend->>Frontend: Return current preferences
    UI->>User: Show preference form with current values

    User->>UI: Update allergies<br/>Add "peanut, shellfish"
    User->>UI: Update dietary restrictions<br/>Check "vegetarian"
    User->>UI: Update preferred cuisines<br/>Select "Italian, Thai"

    User->>UI: Click Save

    Frontend->>Backend: PATCH /api/v1/user/preferences<br/>{allergies, dietary_restrictions, cuisines}

    Backend->>DB: UPDATE user_preferences
    Backend->>Redis: DELETE preference_cache:{user_id}
    Backend->>Backend: Log preference change

    Backend->>Frontend: Return {"status": "success"}
    UI->>User: Show "Preferences saved! ✓"
    UI->>UI: Clear form, show new values
```

### Preference Fields

```json
{
  "allergies": ["peanut", "shellfish", "soy"],
  "dietary_restrictions": ["vegetarian", "gluten-free"],
  "preferred_cuisines": ["Italian", "Thai", "Mediterranean"],
  "ingredients_available": ["rice", "pasta", "eggs"],
  "cooking_skill_level": "intermediate",
  "available_time": "30-minutes"
}
```

---

## 🚨 Workflow 5: Error Recovery

### Scenario: Failed API Call

```mermaid
graph TD
    A["User sends message"] -->|Network error| B["Show error message"]
    B -->|Auto-retry| C{Retry successful?}
    C -->|Yes| D["Show recipe results"]
    C -->|No| E["Show 'Try Again' button"]
    E -->|User clicks| A

    F["API times out"] -->|Timeout > 10s| G["Show timeout message"]
    G -->|Suggestion| H["Check internet connection"]
```

### Error Codes & Messages

| Error            | Status | User Message                                                | Action                |
| ---------------- | ------ | ----------------------------------------------------------- | --------------------- |
| Invalid token    | 401    | "Session expired, please login again"                       | Redirect to login     |
| Rate limited     | 429    | "Too many requests, please wait 1 minute"                   | Disable submit button |
| Server error     | 500    | "Something went wrong, we're investigating"                 | Show support link     |
| No recipes found | 404    | "No recipes match your criteria. Try different ingredients" | Suggest alternatives  |

---

## 📊 Workflow Performance Targets

| Metric                  | Target    | Typical          |
| ----------------------- | --------- | ---------------- |
| Login time              | < 2s      | 1.5s             |
| Text search latency     | < 3s      | 2.2s             |
| Image upload + analysis | < 8s      | 5.5s             |
| Cache hit response      | < 500ms   | 300ms            |
| Preference save         | < 1s      | 0.8s             |
| Error recovery          | Immediate | Auto-retry in 2s |

---

## 🎨 State Diagram for Chat Interface

```mermaid
stateDiagram-v2
    [*] --> Authenticated

    Authenticated --> Idle: Login successful

    Idle --> Typing: User types message
    Typing --> Typing: Continue typing
    Typing --> Waiting: Send message
    Typing --> Idle: Cancel

    Waiting --> Processing: Backend received
    Processing --> Streaming: Gemini API calling
    Streaming --> DisplayRecipes: Recipes received
    DisplayRecipes --> Idle: Done

    Waiting --> Error: Network error
    Processing --> Error: API error
    Streaming --> Error: Timeout
    Error --> Retry: User clicks retry
    Retry --> Waiting
    Error --> Idle: User dismisses

    Idle --> Logout: User logs out
    Logout --> [*]
```

---

## 📱 Mobile-First Considerations

### Responsive Breakpoints

```
Mobile (< 640px)
├─ Single column layout
├─ Large touch targets (48px minimum)
└─ Optimize image sizes

Tablet (640px - 1024px)
├─ Two column layout
├─ Standard touch targets
└─ Balanced spacing

Desktop (> 1024px)
├─ Three column layout
├─ Mouse-optimized UI
└─ Rich typography
```

### Mobile Optimization

1. **Image Handling**
   - Compress before upload (< 1MB)
   - Progressive JPEG
   - WebP fallback

2. **Touch Interactions**
   - Larger buttons (48px+)
   - Haptic feedback where possible
   - Gesture support (swipe between recipes)

3. **Network Awareness**
   - Detect connection type
   - Show retry on offline
   - Cache recipes locally

---

## 🔐 Security in Workflows

### Data Validation

```
User Input → Sanitization → Type Checking → Database Storage

Text Input:
├─ Max 500 characters
├─ Remove special characters
└─ SQL injection protection

Image Input:
├─ Validate MIME type
├─ Check file size
├─ Scan for malware
└─ Apply access controls
```

### Session Management

```
Login → JWT Created → Stored in Redis → Sent to Client
         ├─ TTL: 24 hours
         ├─ Stored in HTTP-only cookie
         └─ Validated on each request

Logout → Delete from Redis & Cookie
```

---

## 📈 Workflow Metrics & Analytics

### Key Metrics by Workflow

**Authentication**

- Login success rate
- OAuth provider breakdown
- Session duration
- Account creation rate

**Recipe Discovery**

- Average search time
- Cache hit rate
- Gemini API latency
- Recipe click-through rate

**Personalization**

- Preference completion rate
- Preference update frequency
- Allergy addition rate

### Sample Analytics Query

```sql
SELECT
    DATE(timestamp) as date,
    COUNT(*) as total_searches,
    AVG(response_time_ms) as avg_latency,
    SUM(CASE WHEN cache_hit THEN 1 ELSE 0 END) as cache_hits
FROM conversations
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

---

**Next Steps**:

1. Review workflows with product team
2. Validate UX flows with users
3. Implement A/B testing on alternatives
4. Monitor performance metrics in production
