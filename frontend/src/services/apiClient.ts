import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface ChatMessage {
  message: string
  imageData?: string // Base64 encoded image
  imageType?: string // e.g., "image/jpeg", "image/png"
}

interface ChatResponse {
  response: string
  timestamp?: string
}

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  // Chat with text only
// 1. แก้ไข Chat with text only ให้รับ conversationId และ userId
  async sendMessage(
    message: string, 
    conversationId?: string, 
    userId?: string
  ): Promise<ChatResponse> {
    try {
      const response = await this.client.post<ChatResponse>('/chat', {
        message,
        conversation_id: conversationId, // ส่งไปให้ Backend
        user_id: userId,                 // ส่งไปให้ Backend ดึง Preferences
      })
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // 2. แก้ไข Chat with multimodal ให้รับ userId เพิ่ม
  async sendMessageWithImage(
    message: string,
    imageBase64: string,
    imageType: string = 'image/jpeg',
    userId?: string // เพิ่มตัวแปรนี้
  ): Promise<ChatResponse> {
    try {
      const response = await this.client.post<ChatResponse>('/chat/multimodal', {
        message,
        imageData: imageBase64,
        imageType,
        user_id: userId, // ส่งไปให้ Backend
      })
      return response.data
    } catch (error) {
      console.error('Error sending multimodal message:', error)
      throw error
    }
  }
  // --- เพิ่มส่วนนี้เข้าไปครับ ---
  
  // Update User Preferences
  async updateUserPreferences(preferences: any): Promise<any> {
    try {
      const response = await this.client.put('/user/preferences', preferences)
      return response.data
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    }
  }

  // Get User Preferences
  async getUserPreferences(userId?: string): Promise<any> {
    try {
      const response = await this.client.get('/user/profile', {
        params: { user_id: userId }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching preferences:', error)
      throw error
    }
  }
  // Upload image with form data (alternative approach)
  async uploadImageAndChat(
    message: string,
    file: File
  ): Promise<ChatResponse> {
    try {
      const formData = new FormData()
      formData.append('message', message)
      formData.append('image', file)

      const response = await this.client.post<ChatResponse>(
        '/chat/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  // Get chat history
  async getChatHistory(): Promise<any[]> {
    try {
      const response = await this.client.get('/chat/history')
      return response.data
    } catch (error) {
      console.error('Error fetching chat history:', error)
      throw error
    }
  }

  // Clear chat history
  async clearChatHistory(): Promise<void> {
    try {
      await this.client.post('/chat/clear')
    } catch (error) {
      console.error('Error clearing chat history:', error)
      throw error
    }
  }
}

export const apiClient = new APIClient()
export default apiClient
