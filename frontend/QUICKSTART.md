# ⚡ Culinary Crafts Frontend - Quick Start Guide

## 5-Minute Setup

### 1️⃣ Install & Configure (2 min)

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_SECRET=my-secret-key-minimum-32-chars
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 2️⃣ Start Development Server (30 sec)

```bash
npm run dev
```

Visit **http://localhost:3000** 🚀

### 3️⃣ Test OAuth Flow (2 min)

1. Click "Continue with Google"
2. Complete Google login
3. Redirected to chat page
4. Success! ✨

---

## What Changed?

### ❌ Before (LINE Login)

- Thai language only
- Dark cyberpunk theme
- No image support
- LINE ID-based authentication

### ✅ After (Google OAuth)

- Warm culinary theme (cream + terracotta)
- Image upload + camera support
- Multimodal AI (text + image to Gemini)
- Google authentication
- English interface
- Responsive mobile/tablet design

---

## Key Files

| File                                  | Purpose                   |
| ------------------------------------- | ------------------------- |
| `src/pages/index.tsx`                 | Home page (auth redirect) |
| `src/pages/chat.tsx`                  | Main chat interface       |
| `src/pages/api/auth/[...nextauth].ts` | OAuth configuration       |
| `src/components/ChatInterface.tsx`    | Chat UI component         |
| `src/components/ImageAttachment.tsx`  | Image upload component    |
| `src/services/apiClient.ts`           | API integration           |
| `tailwind.config.js`                  | Design system colors      |
| `src/styles/globals.css`              | Tailwind + custom styles  |

---

## Feature Demo

### 📱 Send a Message

```
User: "What can I make with pasta and tomato?"
AI: "You can make classic Cacio e Pepe, Pasta al Pomodoro..."
```

### 📸 Send an Image + Question

```
User: [uploads photo of ingredients]
User: "What recipe can I make?"
AI: [analyzes image with Gemini 1.5 Pro]
AI: "Based on the tomatoes, basil, and mozzarella,
      I recommend Caprese Salad or Margherita Pizza..."
```

---

## Color Palette (Warm & Fresh)

```
🟡 Cream: #FFFCF2          (background - inviting)
🔶 Terracotta: #FF6B35     (buttons - appetizing)
🌿 Sage Green: #4F772D     (health elements)
✨ Gold: #D4A574           (accents)
```

---

## Environment Variables Quick Reference

| Variable               | Example                          | Required |
| ---------------------- | -------------------------------- | -------- |
| `NEXTAUTH_SECRET`      | Random 32+ chars                 | ✅ Yes   |
| `NEXTAUTH_URL`         | `http://localhost:3000`          | ✅ Yes   |
| `GOOGLE_CLIENT_ID`     | `xxx.apps.googleusercontent.com` | ✅ Yes   |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx`                     | ✅ Yes   |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:8000/api/v1`   | ✅ Yes   |

---

## Get Google OAuth Credentials (3 min)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Culinary Crafts"
3. Enable "Google+ API"
4. Create OAuth 2.0 Client ID (Web Application)
5. Add redirect: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID & Secret → `.env.local`

**Or** [Follow this detailed guide](https://next-auth.js.org/providers/google)

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server on :3000

# Building
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # Check TypeScript

# Testing
npm test                 # Run Jest tests
npm run test:coverage    # Coverage report
```

---

## Troubleshooting

### ❓ "OAuth mismatch" error

```
→ Check NEXTAUTH_URL matches your domain
→ Check redirect URI in Google Cloud Console
→ Clear browser cookies & try again
```

### ❓ Image upload not working

```
→ Verify backend is running on :8000
→ Check NEXT_PUBLIC_API_URL is correct
→ Look at browser console for CORS errors
```

### ❓ Styles not applying

```
→ Run: npm run build
→ Check tailwind.config.js content paths
→ Restart dev server
```

### ❓ Session lost on refresh

```
→ Verify NEXTAUTH_SECRET is set
→ Check browser cookies (should have nextauth.session-token)
→ Try incognito/private window
```

---

## Architecture

```
Next.js Frontend (:3000)
├── Auth: NextAuth.js + Google OAuth
├── Chat: React + Framer Motion
└── API: Axios → Backend
        ↓
FastAPI Backend (:8000)
├── /api/v1/chat (text)
├── /api/v1/chat/multimodal (text + image)
└── Gemini 1.5 Pro (LLM)
        ↓
Firestore
├── users (google_id)
└── chat_history
```

---

## Next Steps

✅ **Done**: UI Refactor + Google Auth + Multimodal Chat

📝 **TODO**:

- [ ] Backend integration endpoints
- [ ] Firestore schema migration
- [ ] Deploy to production
- [ ] Chat history storage
- [ ] User preferences UI

---

## Support

**Docs**:

- [SETUP.md](./SETUP.md) - Detailed setup
- [REFACTOR_DOCUMENTATION.md](./REFACTOR_DOCUMENTATION.md) - Full design docs

**Resources**:

- [NextAuth Docs](https://next-auth.js.org/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/)

---

**Version**: 1.0.0  
**Last Updated**: March 28, 2026  
**Status**: ✅ Ready to Deploy
