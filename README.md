# Culinary Crafts

Grounded, multimodal AI cooking assistant with RAG, chat memory, and web UI.

## Current Version Check

This section reflects what is currently in code and configuration.

| Area | Current State |
|---|---|
| Frontend | Next.js ^14.0.0, React ^18.2.0, TypeScript ^5.2.0, Tailwind CSS ^3.3.0 |
| Frontend Runtime | Node.js 18 (Docker uses node:18-alpine), npm >= 9 |
| Backend | FastAPI 0.104.1, Uvicorn 0.24.0, Pydantic v2 |
| Backend Runtime | Python 3.11 (Docker uses python:3.11-slim) |
| AI Libraries | google-generativeai >= 0.4.0, langchain >= 0.1.0, langgraph 0.0.40 |
| Active Model Path | Chat route initializes Gemini using gemini-1.5-flash-latest (or first available generateContent model) |
| Model Config Default | Settings default still contains gemini-1.5-pro-latest |
| Database | PostgreSQL via SQLAlchemy (chat_logs, user_preferences tables) |
| Vector Search | FAISS (faiss-cpu >= 1.7.4) |
| Cache | Redis service defined in Docker compose |
| Auth (Frontend) | NextAuth v4 with JWT session strategy, Google OAuth + Credentials (dev/testing) |
| Auth (Backend) | JWT config fields and jose dependency exist, but backend auth flow is partially scaffolded and not fully enforced on API routes |
| Security Middleware | Security and rate-limit middleware files exist; middleware registration in backend main app is currently commented out |

## Architecture Snapshot

- frontend/: Next.js web app (chat UI, auth flows, API proxy rewrites)
- backend/: FastAPI service (chat endpoint, recipe retrieval, DB logging, model integration)
- data/faiss_index/: Local vector index files
- infrastructure/: Docker, Kubernetes, Terraform, Nginx configs
- monitoring/: Prometheus and Grafana setup
- scripts/: Windows and cross-platform helper scripts

## What Is Working Right Now

- Frontend app on port 3000 with NextAuth session handling
- Backend API on port 8000 with health and chat endpoints
- Chat request flow with:
  - DB conversation history lookup
  - RAG document search via recipe engine
  - Gemini response generation
  - Chat log persistence into PostgreSQL
- Docker compose stack with frontend, backend, postgres, redis, pgadmin

## Important Status Notes

- Authentication is currently strongest on the frontend (NextAuth session/JWT handling).
- Backend JWT/security middleware architecture exists, but route-level auth enforcement is still incomplete.
- OpenAPI descriptions mention enterprise security goals; codebase currently shows partial implementation in this area.

## Technology Stack

- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
- Backend: FastAPI, Uvicorn, Pydantic, SQLAlchemy
- AI: Google Gemini, LangChain, LangGraph
- Data: PostgreSQL, Redis, FAISS
- DevOps: Docker, Docker Compose, Nginx, Terraform, Kubernetes

## Local Ports

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend Docs: http://localhost:8000/docs (when DEBUG enabled)
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- pgAdmin: http://localhost:5050

## Quick Start

### Option 1: Docker (Recommended)

Windows:

```bat
.\scripts\docker-start.bat
```

Cross-platform:

```bash
docker compose up --build
```

### Option 2: Local Development

Backend:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

## Environment Variables (Minimum)

Create a .env at project root and/or backend folder with at least:

```env
GEMINI_API_KEY=your_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/culinary_crafts
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=culinary_user
POSTGRES_PASSWORD=dev_password_123
POSTGRES_DB=culinary_crafts
```

Frontend auth variables (for NextAuth provider setup) should also be configured in frontend env files.

## API Overview

Base URL: http://localhost:8000/api/v1

- GET /health
- POST /chat
- GET /recipes
- GET /user/profile
- PUT /user/preferences

Use /docs for the full OpenAPI schema when running in debug mode.

## Roadmap Focus (Recommended Next)

- Complete backend JWT auth route protection
- Enable and tune security + rate-limit middleware in production profile
- Align model naming between settings default and active runtime selection
- Add automated auth and integration tests for protected endpoints

## Documentation

- QUICKSTART.md
- SCRIPTS-GUIDE.md
- docs/API-DOCUMENTATION.md
- docs/architecture.md
- docs/USER-WORKFLOWS.md
- docs/troubleshooting-windows.md

## Development Workflow

1. Create branch
2. Implement changes
3. Run tests and lint
4. Open pull request

## License

MIT
