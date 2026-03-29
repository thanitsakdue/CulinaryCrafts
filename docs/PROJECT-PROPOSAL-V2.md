# 🍳 Culinary Crafts - Updated Project Proposal (v2.0)

> **Version**: 2.0 - PostgreSQL Implementation Phase  
> **Last Updated**: March 29, 2026  
> **Status**: Active Development

---

## 📋 Executive Summary

**Culinary Crafts** is an AI-powered cooking assistant that helps home cooks discover personalized recipes based on available ingredients, dietary restrictions, and allergies. Using Google's Gemini vision and language models, the app analyzes ingredient photos and generates safe, personalized recipe recommendations in real-time.

### Key Innovation

Unlike generic recipe apps, Culinary Crafts **learns** your preferences (allergies, cuisines, skill level) and provides **grounded recommendations** from verified sources—eliminating AI hallucination and food safety risks.

---

## 🎯 Problem Statement

### Current Challenges

1. **Decision Paralysis** - Users waste time deciding what to cook with limited ingredients
2. **Food Waste** - Ingredients spoil before being used effectively
3. **AI Hallucination** - Recipe apps generate non-existent recipes or recommend unsafe ingredients
4. **One-Size-Fits-All** - Generic recommendations ignore user allergies and preferences
5. **Manual Ingredient Entry** - Typing ingredients is tedious and error-prone

### Target Users

- 👩‍🍳 **Home Cooks** (age 25-55) who want faster meal planning
- 👨‍⚕️ **Health-Conscious Users** with dietary restrictions (vegetarian, gluten-free, etc.)
- 🥜 **People with Allergies** who need safe recommendation filtering
- 📱 **Mobile-First Users** who prefer visual/image-based interfaces

---

## ✨ Proposed Solution

### What is Culinary Crafts?

A **multimodal AI cooking assistant** that:

1. **Accepts multimodal input**
   - Text: "What can I make with pasta and tomato?"
   - Image: Photo of fridge or ingredients on counter
   - Hybrid: Image + context ("Can you make it vegetarian?")

2. **Analyzes with AI**
   - Detects ingredients from images using Gemini 1.5 Pro Vision
   - Identifies allergens and restrictions
   - Filters recipes by user preferences
   - Ranks by convenience and skill level

3. **Recommends safely**
   - Only recommends recipes user can safely make
   - Cites sources (grounded recommendations)
   - Stores preferences to personalize over time
   - Explains ingredient substitutions

4. **Remembers users**
   - Saves dietary preferences (allergies, restrictions)
   - Learns cuisine preferences
   - Tracks favorite recipes
   - Suggests based on history

---

## 🏗️ System Architecture (v2.0)

### Technology Stack

```
Frontend:
├─ Next.js 14 (React 18+ with TypeScript)
├─ NextAuth.js (OAuth 2.0 with Google)
├─ Tailwind CSS (Responsive design)
└─ Framer Motion (Smooth animations)

Backend:
├─ FastAPI (Python 3.11+ with async/await)
├─ Google Gemini API (Vision + Text Pro)
├─ PostgreSQL 15 (Persistent data)
└─ Redis (Session & query caching)

Infrastructure:
├─ Docker Compose (Local dev)
├─ GitHub Actions (CI/CD)
└─ Azure/AWS (Production deployment)
```

### Architecture Diagram

```
┌─ User Interface Layer ──────────────────┐
│  Next.js + React + Tailwind CSS         │
│  ├─ Chat Interface                      │
│  ├─ Image Upload/Camera                 │
│  ├─ Google OAuth Login                  │
│  └─ Preference Settings                 │
└──────────┬──────────────────────────────┘
           │
           │ HTTP/HTTPS
           │
┌──────────▼──────────────────────────────┐
│ API Gateway & Auth Layer                │
│  ├─ JWT Token Validation                │
│  ├─ Rate Limiting                       │
│  └─ CORS Handling                       │
└──────────┬──────────────────────────────┘
           │
┌──────────▼──────────────────────────────┐
│ FastAPI Backend (/api/v1)               │
│  ├─ /auth → OAuth verification          │
│  ├─ /chat → Text recipes                │
│  ├─ /chat/multimodal → Image analysis   │
│  ├─ /recipes → Search & filter          │
│  └─ /user → Preferences & history       │
└─┬────────────────────────────────────┬──┘
  │                                    │
  │     ┌──────────────────────────┐   │
  ├────►│ Google Gemini API        │   │
  │     │ Vision + Text Pro model  │   │
  │     └──────────────────────────┘   │
  │                                    │
  │     ┌──────────────────────────┐   │
  └────►│ PostgreSQL Database      │───┘
        │ users, conversations,    │
        │ preferences, recipes     │
        └──────────────────────────┘

        ┌──────────────────────────┐
        │ Redis Cache              │
        │ Session + Query caching  │
        └──────────────────────────┘
```

---

## 📊 Key Features

### 1. **Multimodal Recipe Discovery**

#### Text-Based Search

```
User: "I have pasta, tomato, and garlic"
AI: "Perfect! You can make:
    1. Pasta al Pomodoro (15 min)
    2. Aglio e Olio (10 min)
    3. Pasta Agliata (5 min)"
```

#### Image-Based Search

```
User: [Takes photo of fridge]
AI: "I see: tomato (3), basil, mozzarella, olive oil
    Recommendations:
    1. Caprese Salad (fresh & quick)
    2. Margherita Pizza (with flour)
    3. Tomato Basil Soup (if you have broth)"
```

### 2. **Personalized Preferences**

```
User Profile:
├─ Allergies: Peanut, shellfish, soy
├─ Dietary: Vegetarian, gluten-free
├─ Cuisines: Italian, Thai, Mediterranean
├─ Avoided Ingredients: Cilantro, olives
└─ Skill Level: Intermediate (15-40 min recipes)

AI filters all recipes through these constraints
→ No unsafe recommendations
→ Higher satisfaction & trust
```

### 3. **Conversation History**

```
Save all searches & results:
├─ What ingredients were used
├─ What recipes were recommended
├─ Which ones user clicked
├─ User feedback (helpful/not helpful)

Used for:
└─ Personalization over time
└─ Trending recommendations
└─ User research & feedback
```

### 4. **Safe Recommendations**

```
Every recipe includes:
├─ Source attribution (grounded)
├─ Allergy compatibility check
├─ Ingredient substitution suggestions
├─ Nutritional information (if available)
├─ Prep & cook time
├─ Skill level required
└─ User reviews (star rating)
```

---

## 🔄 Development Phases

### Phase 1: Foundation ✅ **COMPLETE**

- ✅ Project structure & Docker setup
- ✅ Frontend scaffold (Next.js 14)
- ✅ Backend API structure (FastAPI)
- ✅ Google OAuth configuration
- ✅ PostgreSQL schema design

### Phase 2: Core AI Integration 🔄 **IN PROGRESS**

- 🔄 Gemini 1.5 Pro Vision integration
- 🔄 Image upload & analysis pipeline
- 🔄 Recipe recommendation engine
- 🔄 Text-to-recipe API endpoints
- 🔄 Cache strategy implementation

**Current Sprint**: Implement async/await patterns, test Gemini API latency, validate recipe filtering

### Phase 3: Personalization & Memory 📅 **PLANNED (Q2 2026)**

- [ ] User preference UI completion
- [ ] Allergy safety validation
- [ ] Conversation history storage
- [ ] Preference-based recommendation ranking
- [ ] User feedback loop

### Phase 4: Production Ready 📅 **PLANNED (Q2-Q3 2026)**

- [ ] Database optimization & indexing
- [ ] API performance testing
- [ ] Security audit (OWASP Top 10)
- [ ] Frontend responsive design completion
- [ ] Deployment pipeline (GitHub Actions)

### Phase 5: Growth & Scale 📅 **PLANNED (Q3-Q4 2026)**

- [ ] Mobile app (React Native)
- [ ] Advanced recipe filtering (nutrition, cost)
- [ ] Social features (share recipes, ratings)
- [ ] Multi-language support
- [ ] Analytics & recommendations dashboard

---

## 💰 Value Proposition

### For Users

| Benefit      | How                           | Impact                  |
| ------------ | ----------------------------- | ----------------------- |
| Save Time    | AI quickly suggests recipes   | 5-10 min saved per meal |
| Reduce Waste | Use ingredients before expiry | $50-100/month saved     |
| Safer Eating | Allergies always respected    | Prevents health issues  |
| Discover New | Based on preferences          | Better meal variety     |
| Confidence   | Verified recipes              | Higher cooking success  |

### For Business

| Metric      | Target | Timeline |
| ----------- | ------ | -------- |
| Beta Users  | 100    | Month 1  |
| DAU         | 500    | Month 3  |
| Retention   | 40% D7 | Month 2  |
| Session Avg | 5 min  | Month 1  |

---

## 🔒 Security & Privacy

### Authentication & Authorization

- Google OAuth 2.0 (no passwords stored)
- JWT tokens with 24h expiration
- HTTP-only secure cookies
- CSRF protection

### Data Protection

- End-to-end encrypted API calls (HTTPS/TLS 1.3)
- Database encryption at rest
- No sensitive data in logs
- GDPR compliant (data deletion on request)

### Safety Guardrails

- Input sanitization (SQL injection prevention)
- Rate limiting (10 requests/minute per user)
- Content validation (image file types)
- Gemini API safety filters

---

## 📈 Success Metrics

### Engagement

- Daily Active Users (DAU)
- Session duration
- Recipe search frequency
- Image upload adoption rate

### Quality

- Recipe satisfaction (user ratings)
- Recommendation accuracy
- Allergy safety compliance
- API response time (target: < 3s)

### Business

- Cost per user (infrastructure)
- Gemini API cost efficiency
- Database query optimization
- Cache hit rate (target: 60%+)

### User Feedback

- "Would you recommend?" (NPS)
- Feature requests frequency
- Bug report severity
- Support ticket volume

---

## 🚀 Deployment Strategy

### Local Development

```bash
# Run services in Docker
docker-compose -f docker-compose.services.yml up

# Run code locally (hot reload)
cd backend && uvicorn app.main:app --reload
cd frontend && npm run dev
```

### Staging Environment

```
- Test all changes before production
- Use staging database
- Test with real Gemini API (limited quota)
- Validate user flows with beta testers
```

### Production Deployment

```
Infrastructure as Code (Bicep/Terraform)
├─ Azure Container Apps (Backend)
├─ Vercel (Frontend)
├─ Azure Database for PostgreSQL
├─ Azure Cache for Redis
└─ Azure Application Insights (Monitoring)
```

---

## 📋 Implementation Checklist

### MVP Release (30 days)

- [ ] Text-based recipe search working
- [ ] Image upload & Gemini analysis
- [ ] Google OAuth complete
- [ ] User preferences saving
- [ ] Cache implementation
- [ ] API documentation complete
- [ ] Frontend UI polished
- [ ] Error handling & recovery
- [ ] Security audit passed
- [ ] Performance benchmarks met

### Post-MVP (60 days)

- [ ] Mobile responsive design
- [ ] Conversation history UI
- [ ] Recipe ratings & reviews
- [ ] Advanced filtering (nutrition, cost)
- [ ] Analytics dashboard
- [ ] Production deployment
- [ ] User testing & feedback
- [ ] Documentation update

---

## 🤝 Team & Responsibilities

| Role              | Responsibility                     | Owner       |
| ----------------- | ---------------------------------- | ----------- |
| Backend Engineer  | FastAPI, Gemini API, Database      | Developer 1 |
| Frontend Engineer | Next.js, OAuth, UI/UX              | Developer 2 |
| DevOps            | Docker, Deployment, Infrastructure | DevOps Lead |
| Product Manager   | Requirements, User Research        | PM          |
| QA/Testing        | Test plans, Bug tracking           | QA Lead     |

---

## 📚 Sources & References

### Technologies Used

1. [FastAPI Documentation](https://fastapi.tiangolo.com/)
2. [Next.js 14 Docs](https://nextjs.org/docs)
3. [Google Gemini API Guide](https://ai.google.dev/tutorials/rest_quickstart)
4. [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
5. [PostgreSQL Tutorial](https://www.postgresql.org/docs/)
6. [Redis Documentation](https://redis.io/commands)

### Design Inspiration

- Viaro (AI recipe app)
- Yummly (personalization)
- Justeat (image recognition)
- FlexMsg (LINE interface design)

---

## ✅ Decision Log

### Decision 1: PostgreSQL vs Firestore ✅ DECIDED

- **Choice**: PostgreSQL
- **Reason**: Better control, cost efficiency, ACID compliance
- **Date**: March 15, 2026

### Decision 2: Google Gemini vs OpenAI ✅ DECIDED

- **Choice**: Google Gemini
- **Reason**: Free tier, Vision API included, fast responses
- **Date**: March 10, 2026

### Decision 3: Next.js vs Create React App ✅ DECIDED

- **Choice**: Next.js 14
- **Reason**: Built-in routing, API routes, SSR/SSG capabilities
- **Date**: February 28, 2026

### Decision 4: Docker Deployment ✅ DECIDED

- **Choice**: Docker Compose for local dev, Container Apps for production
- **Reason**: Consistency across environments, easy scaling
- **Date**: March 20, 2026

---

## 🎯 Next Steps

1. **Week 1 (March 29 - April 4)**
   - [ ] Complete Gemini vision integration
   - [ ] Test image analysis accuracy
   - [ ] Implement cache layer

2. **Week 2 (April 5 - April 11)**
   - [ ] Complete preference management UI
   - [ ] Database schema validation
   - [ ] Performance testing (latency targets)

3. **Week 3-4 (April 12 - April 25)**
   - [ ] Security audit & fixes
   - [ ] Frontend polish & responsive design
   - [ ] Internal beta testing

4. **Week 5 (April 26 - May 2)**
   - [ ] Production deployment
   - [ ] User onboarding & training
   - [ ] Go-live!

---

## 📞 Contact & Support

- **GitHub**: [CulinaryCrafts Repo](https://github.com/)
- **Documentation**: `/docs` folder in repo
- **Issues**: Use GitHub Issues for bugs & feature requests
- **Questions**: Reach out via team Slack channel #culinary-crafts

---

**Version History**:

- v2.0 (March 29, 2026) - PostgreSQL implementation, Google OAuth, FastAPI async
- v1.0 (February 15, 2026) - Initial Firestore + LINE LIFF version

**Next Review**: April 15, 2026
