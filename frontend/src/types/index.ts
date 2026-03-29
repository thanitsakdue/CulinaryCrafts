// Type definitions for Culinary Crafts Frontend

// ============== Chat & Messaging ==============

export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  imageUrl?: string
  imageType?: string
}

export interface ChatPayload {
  message: string
  imageData?: string
  imageType?: string
}

export interface ChatResponse {
  response: string
  timestamp?: string
  conversationId?: string
}

// ============== User & Authentication ==============

export interface User {
  id: string // Google Account ID / Provider ID
  email: string
  name: string
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UserPreferences {
  dietaryRestrictions: string[]
  favoritesCuisines: string[]
  kitchenEquipment: string[]
  allergies: string[]
}

export interface UserProfile extends User {
  preferences: UserPreferences
}

// ============== Session & Auth ==============

export interface NextAuthSession {
  user?: {
    id: string
    email?: string
    name?: string
    image?: string
  }
  expires: string
}

export interface GoogleOAuthToken {
  accessToken: string
  idToken: string
  refreshToken?: string
  expiresAt: number
}

// ============== Image Handling ==============

export interface ImageData {
  base64: string
  type: string
  name: string
  size: number
}

export interface ImagePreview {
  url: string
  file: File
  type: string
}

// ============== API Responses ==============

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  status: number
}

// ============== Recipe Data ==============

export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: Ingredient[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  tags: string[]
  imageUrl?: string
}

export interface Ingredient {
  name: string
  quantity: number
  unit: string
}

// ============== Chat History ==============

export interface ChatSession {
  id: string
  userId: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: ChatMessage[]
}

export interface ChatHistory {
  sessions: ChatSession[]
  totalCount: number
}

// ============== Component Props ==============

export interface ChatInterfaceProps {
  userId?: string
  onMessageSent?: (message: ChatMessage) => void
  initialMessages?: ChatMessage[]
}

export interface ImageAttachmentProps {
  onImageSelected: (base64: string, imageType: string, file: File) => void
  onRemove?: () => void
  preview?: string
  maxSizeMB?: number
}

export interface GoogleLoginPageProps {
  onLogin?: () => void
  isLoading?: boolean
  onError?: (error: Error) => void
}

// ============== Firestore Models ==============

export interface FirestoreUser {
  googleId: string
  email: string
  name: string
  imageUrl?: string
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
}

export interface FirestoreChatMessage {
  userId: string
  text: string
  isUser: boolean
  imageData?: string
  imageType?: string
  timestamp: Date
  sessionId: string
}

// ============== Utility Types ==============

export type MessageRole = 'user' | 'assistant'

export type ImageMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'

export type RecipeCategory =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'dessert'
  | 'snack'
  | 'beverage'

// ============== Enums ==============

export enum AuthProvider {
  GOOGLE = 'google',
  LINE = 'line',
  EMAIL = 'email',
}

export enum ChatStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success',
}

export enum ImageUploadStatus {
  IDLE = 'idle',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  ERROR = 'error',
}
