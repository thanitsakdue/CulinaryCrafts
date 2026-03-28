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
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await this.client.post<ChatResponse>('/chat', {
        message,
      })
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // Chat with multimodal (text + image)
  async sendMessageWithImage(
    message: string,
    imageBase64: string,
    imageType: string = 'image/jpeg'
  ): Promise<ChatResponse> {
    try {
      const response = await this.client.post<ChatResponse>('/chat/multimodal', {
        message,
        imageData: imageBase64,
        imageType,
      })
      return response.data
    } catch (error) {
      console.error('Error sending multimodal message:', error)
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
