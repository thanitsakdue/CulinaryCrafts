# Railway Deployment Guide (Beginner Friendly)

This guide deploys **both services** in this repo:
- `backend/` (FastAPI)
- `frontend/` (Next.js)

You will create **2 Railway services** and (optionally) **1 PostgreSQL database plugin**.

---

## 0) Before You Start

1. Create accounts:
   - [GitHub](https://github.com)
   - [Railway](https://railway.app)
2. Push this project to a GitHub repository.
3. Confirm your project structure includes:
   - `frontend/`
   - `backend/`
   - `backend/faiss_index/`

> Why 2 services? Because your frontend and backend run on different runtimes and ports.

---

## 1) Prepare Backend for Railway

### 1.1 Add a Procfile for backend startup
Create `backend/Procfile` with:

```txt
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Railway provides `$PORT` automatically, so this is required.

### 1.2 Confirm backend health endpoint
Your backend should respond on one of:
- `/health`
- `/api/v1/health`

Set Railway health check path to the one that works in your app.

### 1.3 (Recommended) Use Python buildpack first
Because your last error is from Docker build during `pip install`, start with Railway's Python/Nixpacks build (not custom Docker) for backend:
- Root Directory: `backend`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

If you must use Docker, see troubleshooting section below.

---

## 2) Prepare Frontend for Railway

### 2.1 Frontend service settings
In Railway frontend service:
- Root Directory: `frontend`
- Build Command: `npm ci && npm run build`
- Start Command: `npm run start`

### 2.2 NextAuth production URL
Set `NEXTAUTH_URL` to your real Railway frontend URL (for example `https://your-frontend.up.railway.app`).

---

## 3) Create Railway Project and Services

1. In Railway dashboard: **New Project** → **Deploy from GitHub repo**.
2. Create **Backend Service**:
   - Source: same repo
   - Root Directory: `backend`
3. Create **Frontend Service**:
   - Source: same repo
   - Root Directory: `frontend`
4. (Optional) Add **PostgreSQL** plugin if you want DB logging to work in production.

---

## 4) Environment Variables You Need

Set variables in each Railway service.

## Backend (`backend` service)

Minimum recommended production vars:

```env
ENVIRONMENT=production
DEBUG=false
GEMINI_API_KEY=your_real_key
JWT_SECRET=generate_a_long_random_secret
CORS_ORIGINS=["https://your-frontend-domain"]
LOG_LEVEL=INFO
```

If using PostgreSQL plugin:

```env
DATABASE_URL=<from_railway_postgres_plugin>
POSTGRES_HOST=<from_plugin>
POSTGRES_PORT=<from_plugin>
POSTGRES_USER=<from_plugin>
POSTGRES_PASSWORD=<from_plugin>
POSTGRES_DB=<from_plugin>
```

Optional but useful:

```env
REDIS_URL=redis://...   # only if you add Redis
```

## Frontend (`frontend` service)

```env
NODE_ENV=production
NEXTAUTH_URL=https://your-frontend-domain
NEXTAUTH_SECRET=generate_a_long_random_secret
NEXT_PUBLIC_API_URL=https://your-backend-domain/api/v1
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

> Important: `NEXT_PUBLIC_API_URL` must point to your backend public URL.

---

## 5) Database Connection (If Needed)

If chat logging/DB features are required in production:

1. Add PostgreSQL plugin in Railway.
2. In backend service variables, map plugin values to your app variables (`DATABASE_URL` etc.).
3. Redeploy backend.
4. Verify backend logs show successful DB connection.

If DB is optional for your usage, you can temporarily deploy without it, but features depending on DB writes may fail.

---

## 6) Connect Frontend to Backend Correctly

1. Deploy backend first.
2. Copy backend public URL.
3. Set frontend `NEXT_PUBLIC_API_URL` to:
   - `https://<backend-domain>/api/v1`
4. Redeploy frontend.
5. Test frontend chat action and check backend logs.

---

## 7) Fix for Your Current Error (`pip install ... requirements.txt` failed)

Your last log:

```text
ERROR: failed to build: failed to solve: process "/bin/sh -c pip install --no-cache-dir -r requirements.txt" did not complete successfully: exit code: 1
```

Use this checklist in order:

1. **See the real pip error lines above the final line**
   - Common causes: version conflict, missing build tools, or unsupported wheels.
2. **Try Railway non-Docker build for backend first**
   - Root dir `backend`, start command via `uvicorn`.
3. **Pin problematic packages**
   - AI stack can conflict; if needed, temporarily test with a smaller requirements file.
4. **If FAISS fails to install**
   - Keep `faiss-cpu` and ensure linux/x86 build target.
   - Avoid Alpine for Python backend when using FAISS (use Debian slim).
5. **Upgrade pip/setuptools/wheel in Docker before install**
   - Add: `pip install --upgrade pip setuptools wheel`
6. **Use Python 3.11 consistently**
   - Mismatch between local and deploy Python can break resolution.
7. **Re-deploy with clear cache**
   - In Railway deploy options, clear build cache and retry.

---

## 8) Common Railway Deployment Errors (and Simple Fixes)

### Error: App starts then crashes (port issue)
**Cause:** App bound to fixed port (`8000`/`3000`) instead of `$PORT`.
**Fix:** Start command must bind to `$PORT`.

### Error: CORS blocked in browser
**Cause:** Backend `CORS_ORIGINS` missing frontend domain.
**Fix:** Add exact frontend URL to backend `CORS_ORIGINS`.

### Error: NextAuth redirect/callback mismatch
**Cause:** `NEXTAUTH_URL` not matching deployed domain.
**Fix:** Set exact HTTPS frontend URL and update Google OAuth allowed redirect URI.

### Error: 500 from frontend API calls
**Cause:** `NEXT_PUBLIC_API_URL` incorrect or backend down.
**Fix:** Check frontend env var, backend health endpoint, and backend logs.

### Error: Database connection refused
**Cause:** Using localhost DB URL in cloud.
**Fix:** Use Railway PostgreSQL plugin values, never localhost in production.

### Error: Build timeout or memory issue
**Cause:** Heavy dependency install.
**Fix:** Reduce dependency set, pin versions, clear cache, prefer buildpack flow.

### Error: "Application failed to respond" on Railway URL
**Cause:** App process crashed on startup or did not bind in time.
**Fix checklist:**
- Confirm backend uses Railway `$PORT` (Procfile/start command).
- Ensure `DATABASE_URL` is set, or app has fallback DB config.
- Avoid long startup tasks (PDF embedding/index load) during boot.
- Check deploy logs for traceback and fix first exception line.

---

## 9) Production Checklist (Quick)

- [ ] Backend and frontend are separate services
- [ ] Backend uses `$PORT`
- [ ] Frontend uses correct `NEXT_PUBLIC_API_URL`
- [ ] `NEXTAUTH_URL` is production URL
- [ ] `GEMINI_API_KEY` set in backend
- [ ] `JWT_SECRET` and `NEXTAUTH_SECRET` are strong random values
- [ ] CORS includes frontend domain
- [ ] PostgreSQL plugin connected (if DB features needed)
- [ ] Health checks passing

---

## 10) Recommended Deploy Order

1. Deploy backend service first.
2. Verify backend health URL works.
3. Deploy frontend service with backend URL configured.
4. Test login/chat.
5. Add database plugin and validate persistence logs.
