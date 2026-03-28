# Culinary Crafts Frontend - Setup Instructions

## Prerequisites
- Node.js 18.17+ 
- npm 9+

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install

# Install NextAuth for Google OAuth
npm install next-auth@latest

# Install optional: Firebase for advanced auth
# npm install firebase @react-oauth/google
```

### 2. Environment Configuration

Create a `.env.local` file in the `frontend/` directory:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-random-secret-key-here-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Optional: Enable debug mode
NEXTAUTH_DEBUG=false
```

### 3. Setup Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen:
   - User Type: External
   - Add scopes: `email`, `profile`, `openid`
6. Application type: Web Application
7. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (production)
8. Copy Client ID and Secret to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Features

### Authentication Flow
1. User lands on homepage (`/`)
2. Clicks "Continue with Google" button
3. Redirected to Google login
4. After OAuth callback, redirected to `/chat`
5. Chat interface loads with authenticated session

### Chat Features
- **Text Messages**: Send text queries about recipes, ingredients
- **Image Upload**: 
  - Click gallery icon → upload from device
  - Click camera icon → capture with device camera
- **Image Preview**: Thumbnail shown before sending
- **Multimodal**: Send text + image together to AI
- **Timestamps**: Each message shows time sent

### User Profile
- Access at `/profile` or click username in chat header
- Shows Google profile picture, name, email
- Option to sign out

## API Integration

### Backend Requirements

Your FastAPI backend needs these endpoints:

```python
# Text chat endpoint
POST /api/v1/chat
{
  "message": "string"
}
Response:
{
  "response": "string"
}

# Multimodal endpoint (text + image)
POST /api/v1/chat/multimodal
{
  "message": "string",
  "imageData": "base64-encoded-image",
  "imageType": "image/jpeg" | "image/png" | "image/gif"
}
Response:
{
  "response": "string"
}

# Alternative: FormData upload
POST /api/v1/chat/upload
FormData:
  - message: string
  - image: File
Response:
{
  "response": "string"
}
```

### User Mapping (Database)

Update your database schema to use Google Provider ID:

**Old (LINE-based)**:
```sql
users:
  - line_user_id (primary key)
  - name, email, preferences
```

**New (Google-based)**:
```sql
users:
  - google_id (primary key) -- from session.user.id
  - email (from session.user.email)
  - name (from session.user.name)
  - image_url (from session.user.image)
  - preferences (user dietary restrictions, favorites)
  - created_at, updated_at
```

### Firestore Integration Example

```typescript
// In your backend or frontend service
async function initializeUserProfile(googleId: string, userEmail: string) {
  const userRef = db.collection('users').doc(googleId)
  await userRef.set(
    {
      email: userEmail,
      createdAt: new Date(),
      preferences: {
        dietaryRestrictions: [],
        favoritesCuisines: [],
      },
    },
    { merge: true }
  )
}
```

## Development

### Build
```bash
npm run build
npm start
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

### Type Checking
```bash
npm run type-check
```

## Deployment

### Vercel Deployment
```bash
npm install -g vercel
vercel

# Set environment variables in Vercel dashboard
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL (set to your domain)
```

### Docker Deployment
See `frontend/Dockerfile`

```bash
docker build -t culinary-crafts-frontend .
docker run -p 3000:3000 \
  -e GOOGLE_CLIENT_ID=xxx \
  -e GOOGLE_CLIENT_SECRET=xxx \
  -e NEXTAUTH_SECRET=xxx \
  -e NEXT_PUBLIC_API_URL=http://backend:8000/api/v1 \
  culinary-crafts-frontend
```

## Troubleshooting

### OAuth Callback Issues
- Ensure `NEXTAUTH_URL` matches your deployment URL
- Check redirect URIs in Google Cloud Console
- Clear browser cookies and try again

### Image Upload Not Working
- Verify `NEXT_PUBLIC_API_URL` points to correct API
- Check browser console for CORS errors
- API backend must support `Content-Type: multipart/form-data`

### Chat History Not Persisting
- Implement chat history storage in your backend
- Endpoint: `GET /api/v1/chat/history` (optional)
- Link chat history to Google user ID in database

## Architecture

```
Frontend (Next.js)
├── Auth: NextAuth.js + Google OAuth
├── Chat UI: React Components + Framer Motion
├── Image: File upload + Base64 encoding
└── API Client: Axios with interceptors

    ↓ (HTTP/REST)

Backend (FastAPI)
├── OAuth: Validate Google tokens
├── LangGraph: Recipe engine with Gemini 1.5 Pro
├── Multimodal: Process text + images
└── Database: Firestore (user profiles + chat history)
```

## Support

For issues or questions:
1. Check browser console for errors
2. Review backend logs
3. Ensure environment variables are set
4. Check CORS headers in backend responses
