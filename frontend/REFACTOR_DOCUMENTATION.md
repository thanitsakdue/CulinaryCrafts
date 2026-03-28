# Culinary Crafts Frontend - Refactor Documentation

## 🎨 UI/UX Redesign Overview

### Color Palette (Warm, Fresh, Appetizing)

| Color | HEX | Usage |
|-------|-----|-------|
| **Cream (BG)** | `#FFFCF2` | Primary background - warm, inviting |
| **Warm White** | `#FAF8F3` | Cards, containers |
| **Terracotta** | `#FF6B35` | Primary CTA, highlights, user messages |
| **Coral** | `#FF8A50` | Hover states, tertiary elements |
| **Honey Gold** | `#FFB562` | Accent, special highlights |
| **Sage Green** | `#4F772D` | Health/vegetable elements, secondary CTAs |
| **Dark Sage** | `#2D5016` | Dark sage for contrast |
| **Gold** | `#D4A574` | Borders, subtle accents |
| **Deep Brown** | `#3E2723` | Text, primary content |
| **Light Cream** | `#FFF9ED` | Light backgrounds, tertiary surfaces |

### Typography

- **Display (Headings)**: Playfair Display 700/800
  - Refined, sophisticated serif for titles
  - Creates premium, editorial feel
  
- **Body/UI**: Poppins 400-700
  - Friendly yet modern sans-serif
  - Rounded letterforms for warmth
  - Excellent readability

- **Code**: Space Mono 400/700
  - Monospace for technical content

### Design Philosophy

**Aesthetic Direction**: Warm, Sophisticated Culinary

The interface feels like stepping into an upscale, modern kitchen. Every element is intentional:
- **Soften the edges**: Rounded corners (rounded-full buttons, rounded-2xl cards)
- **Organic motion**: Animations mimic cooking (rising, simmering, plating)
- **Warm palette**: Inviting, never sterile or corporate
- **Spacious layouts**: Generous whitespace = breathing room = comfort

## 🔑 Authentication System

### Architecture: NextAuth.js + Google OAuth

```
User → "Continue with Google" Button
  ↓
Google OAuth Consent Screen
  ↓
Google Callback → NextAuth session
  ↓
Store: Google ID + email + profile photo
  ↓
Redirect to /chat (authenticated)
```

### Key Changes from LINE Login

| Aspect | Old (LINE) | New (Google) |
|--------|-----------|------------|
| **Provider** | LINE Social SDK | Google OAuth 2.0 |
| **User ID** | LINE UID | Google account ID |
| **Session Store** | JWT in localStorage | NextAuth session |
| **Profile Data** | LINE profile | Google profile (photo, name, email) |
| **Database Link** | Firestore: line_user_id | Firestore: google_id (user.id from session) |

### Configuration

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Session Structure

```typescript
session.user = {
  id: "google-account-id",        // Provider ID for DB
  email: "user@example.com",
  name: "John Doe",
  image: "https://lh3.googleusercontent.com/..."
}
```

## 📱 Multimodal Chat Interface

### Features

**Text Chat**
- Send cooking questions, recipe requests
- AI responses from Gemini 1.5 Pro
- Timestamps for each message

**Image Upload** (3 methods)
1. **Gallery Upload**: Click 📎 button → select from device
2. **Camera Capture**: Click 📷 button → capture with device camera (mobile)
3. **Drag & Drop**: (optional enhancement)

**Image Handling**
- Preview thumbnail before sending
- Converted to Base64 for transmission
- Includes MIME type (image/jpeg, image/png)
- Remove button to clear selection

**Multimodal Payload**
```json
{
  "message": "What can I make with these ingredients?",
  "imageData": "data:image/jpeg;base64,/9j/4AAQSkZJR...",
  "imageType": "image/jpeg"
}
```

### UI Layout

```
┌─────────────────────────────────────┐
│ Header: Culinary Crafts | 👨‍🍳      │
├─────────────────────────────────────┤
│                                     │
│  ← AI Message (card)    ┌─────────┐ │
│                         │ User    │ │
│                         │ Message │ │
│                         └─────────┘ │
│                                     │
│  [Image Preview] ┌─────────────────┐│
│                  │ Input field     ││
│                  │ [📎] [📷] [✈️] ││
│                  └─────────────────┘│
│                                     │
└─────────────────────────────────────┘
```

### Message Styling

**User Message**:
- Gradient background: terracotta → coral
- White text
- Rounded top-left, rounded top-right: 0 (square corner near input)
- Right-aligned

**AI Message**:
- Warm white card background
- Deep brown text
- Fully rounded corners
- Left-aligned
- Optional image preview

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ChatInterface.tsx          ← Main chat UI
│   │   ├── ImageAttachment.tsx        ← Image upload/camera
│   │   └── GoogleLoginPage.tsx        ← Login screen
│   │
│   ├── pages/
│   │   ├── index.tsx                  ← Home (auth check → redirect)
│   │   ├── chat.tsx                   ← Chat (protected route)
│   │   ├── profile.tsx                ← User profile
│   │   └── api/auth/[...nextauth].ts  ← OAuth configuration
│   │
│   ├── services/
│   │   └── apiClient.ts               ← Axios + API methods
│   │
│   └── styles/
│       └── globals.css                ← Tailwind + custom styles
│
├── public/                            ← Static assets
├── tailwind.config.js                 ← Design tokens
├── next.config.js
├── package.json
├── tsconfig.json
└── SETUP.md                           ← Setup instructions
```

## 🚀 Component API Reference

### ChatInterface

```typescript
<ChatInterface />
```

**Features**:
- Auto-scrolls to latest message
- Loading state with spinner
- Image preview with remove button
- Timestamp display (HH:MM format)
- Keyboard & mouse input handling

### ImageAttachment

```typescript
<ImageAttachment
  onImageSelected={(base64, mimeType, file) => {}}
  onRemove={() => {}}
  preview="data:image/jpeg;base64,..."
/>
```

**Props**:
- `onImageSelected`: Callback with base64, MIME type, File object
- `onRemove`: Optional callback when removing image
- `preview`: Image data URL to display thumbnail

### GoogleLoginPage

```typescript
<GoogleLoginPage
  onLogin={() => {}}
  isLoading={false}
/>
```

**Props**:
- `onLogin`: Callback after successful OAuth
- `isLoading`: Show loading state

## 🔄 Data Flow

### Authentication Flow

```
1. User visits http://localhost:3000
   ↓
2. NextAuth checks session (browser cookie)
   ↓
3a. If authenticated → redirect to /chat
3b. If NOT authenticated → show GoogleLoginPage
   ↓
4. User clicks "Continue with Google"
   ↓
5. Redirected to: /api/auth/signin/google
   ↓
6. Google OAuth consent screen
   ↓
7. Google redirects to: /api/auth/callback/google?code=xxx
   ↓
8. NextAuth exchanges code for token
   ↓
9. Session created + stored in secure cookie
   ↓
10. Redirected to /chat (or home)
```

### Chat/Message Flow

```
1. User types message + optionally selects image
   ↓
2. User clicks send button
   ↓
3. Message added to local state (optimistic UI)
   ↓
4. API call:
   - If image: POST /chat/multimodal { message, imageData, imageType }
   - If text only: POST /chat { message }
   ↓
5. Backend processes with Gemini 1.5 Pro
   ↓
6. Response returned
   ↓
7. AI message added to state
   ↓
8. Auto-scroll to bottom
```

### Image Processing

```
User selects image from gallery/camera
   ↓
FileReader converts to Base64 data URL
   ↓
Thumbnail displayed in preview area
   ↓
Base64 string sent in JSON payload
   
Backend:
   ↓
Decode Base64 → Image object
   ↓
Pass to Gemini 1.5 Pro multimodal endpoint
   ↓
Get response with vision analysis
```

## 🎬 Animations

### Global Animations

| Name | Duration | Effect |
|------|----------|--------|
| `rise` | 2s | Fade in + slide up (0 → 0px) |
| `simmer` | 4s ∞ | Subtle scale pulse (1 → 1.02) |
| `plate` | 0.8s | Plating effect (3D rotation + scale) |
| `fadeIn` | 0.6s | Simple fade in |
| `slideUp` | 0.5s | Slide up from bottom |

### Component-Specific Animations

**Login Page**:
- Chef emoji animates with scale pulse
- Page slides up on load
- Staggered item reveals (0.2s delay)

**Chat Messages**:
- Fade in + slide in on arrival
- Smooth auto-scroll
- Loading spinner (rotating)

**Buttons**:
- Hover: slight scale (1.02)
- Click: scale down (0.98) + shadow

## 📊 Responsive Design

### Breakpoints (Tailwind)
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Layout Adjustments

```css
/* Mobile */
.text-3xl          /* Smaller heading on mobile */

/* Tablet+ */
md:text-4xl         /* Medium screen enlargement */

/* Desktop */
lg:text-5xl         /* Large screen maximum size */
```

### Chat Interface Responsiveness

| Screen | Layout |
|--------|--------|
| Mobile | Single column, full width input, smaller card |
| Tablet | Max-width container, medium padding |
| Desktop | Max-width 4xl container, generous padding |

## 🔗 Integration Checklist

### Frontend Setup
- [ ] Install dependencies: `npm install`
- [ ] Set environment variables in `.env.local`
- [ ] Create Google OAuth credentials
- [ ] Test local development: `npm run dev`

### Backend Requirements
- [ ] POST `/api/v1/chat` endpoint (text only)
- [ ] POST `/api/v1/chat/multimodal` endpoint (text + image)
- [ ] Add `Authorization: Bearer <token>` support
- [ ] Link user profiles to Google ID (not LINE ID)
- [ ] Implement Firestore schema for new auth
- [ ] Configure CORS to allow frontend origin

### Database Migration
- [ ] Create `users` collection with google_id as document ID
- [ ] Migrate user preferences from LINE-based storage
- [ ] Update chat history queries to use google_id
- [ ] Backup existing LINE-based data

## 🧪 Testing

### Local Testing

```bash
# Start frontend
cd frontend
npm install
npm run dev
# Visit http://localhost:3000

# In another terminal, start backend
cd backend
python -m uvicorn app.main:app --reload
# Backend at http://localhost:8000
```

### Test Scenarios

1. **Authentication**
   - [ ] Click "Continue with Google"
   - [ ] Complete OAuth flow
   - [ ] Session persists on refresh
   - [ ] Sign out works

2. **Text Chat**
   - [ ] Send text message
   - [ ] Receive AI response
   - [ ] Timestamps display correctly
   - [ ] Scroll to bottom on new message

3. **Image Upload**
   - [ ] Gallery upload works
   - [ ] Camera capture works (mobile)
   - [ ] Image preview displays
   - [ ] Remove image button works

4. **Multimodal Chat**
   - [ ] Send text + image together
   - [ ] Image sent as Base64
   - [ ] AI analyzes image + text
   - [ ] Response displays correctly

5. **Responsive Design**
   - [ ] Mobile: All elements fit, no horizontal scroll
   - [ ] Tablet: Proper spacing
   - [ ] Desktop: Max-width container applied

## 📦 Dependencies

### Core
- **next**: 14.0+ (React framework)
- **react**: 18.2+ (UI library)
- **typescript**: 5.2+ (type safety)

### Styling
- **tailwindcss**: 3.3+ (utility CSS)
- **@tailwindcss/forms**: Form components
- **@tailwindcss/typography**: Rich text styles

### Interaction
- **framer-motion**: 10.16+ (animations)
- **lucide-react**: 0.292+ (icons)
- **react-hook-form**: 7.48+ (form handling)

### Auth
- **next-auth**: 5.0+ (authentication)

### API
- **axios**: 1.6+ (HTTP client)
- **react-query**: 3.39+ (data fetching)

## 🚨 Common Issues & Solutions

### OAuth Error: "Redirect URI mismatch"
**Solution**: Ensure `NEXTAUTH_URL` environment variable matches registered URI in Google Cloud Console.

### Image Not Uploading
**Solution**: Check CORS headers in backend response. Allow `Content-Type: multipart/form-data`.

### Session Lost on Refresh
**Solution**: Verify `NEXTAUTH_SECRET` is set and consistent. Clear browser cookies and try again.

### Messages Not Scrolling to Bottom
**Solution**: Ensure `messagesEndRef.current?.scrollIntoView()` is called in `useEffect([messages])`.

### Tailwind Styles Not Applied
**Solution**: Check `tailwind.config.js` content paths match your component files.

## 🎯 Future Enhancements

- [ ] Chat history storage + recall
- [ ] User preferences (dietary restrictions, cuisines)
- [ ] Recipe bookmarking/favorites
- [ ] Voice input support
- [ ] Real-time collaboration
- [ ] Image gallery of previously shared images
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Last Updated**: March 28, 2026  
**Version**: 1.0.0  
**Refactor Complete**: ✅
