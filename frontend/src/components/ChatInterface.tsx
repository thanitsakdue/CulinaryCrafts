import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowUp, Loader } from 'lucide-react'
import ImageAttachment from './ImageAttachment'
import { apiClient } from '../services/apiClient'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  imageUrl?: string
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to Culinary Crafts! 👨‍🍳 Tell me what ingredients you have, or ask me anything about cooking. I can also help if you share a photo of your ingredients!',
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>('')
  const [selectedImageType, setSelectedImageType] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageSelected = (
    base64: string,
    imageType: string,
    file: File
  ) => {
    setImagePreview(base64)
    setSelectedImageBase64(base64)
    setSelectedImageType(imageType)
    setSelectedImageFile(file)
  }

  const handleRemoveImage = () => {
    setImagePreview('')
    setSelectedImageBase64('')
    setSelectedImageType('')
    setSelectedImageFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && !selectedImageBase64) || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
      imageUrl: imagePreview,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    handleRemoveImage()
    setIsLoading(true)

    try {
      let response
      if (selectedImageBase64) {
        response = await apiClient.sendMessageWithImage(
          input,
          selectedImageBase64,
          selectedImageType
        )
      } else {
        response = await apiClient.sendMessage(input)
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response ?? "Sorry, I couldn't process that.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Failed to connect to the server. Please try again.',
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-culinary-cream">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-10 border-b border-culinary-terracotta/10 bg-culinary-warmWhite/90 backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text-warm">Culinary Crafts</h1>
            <p className="text-sm text-culinary-deepBrown/60">Your AI Cooking Companion</p>
          </div>
          <div className="text-4xl">👨‍🍳</div>
        </div>
      </motion.header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-4xl mx-auto w-full">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg ${
                  message.isUser
                    ? 'bg-gradient-to-br from-culinary-terracotta to-culinary-coral text-white rounded-3xl rounded-tr-sm'
                    : 'culinary-card'
                }`}
              >
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="Shared"
                    className="w-full rounded-2xl mb-3 max-h-48 object-cover"
                  />
                )}
                <p className={`${message.isUser ? 'text-white' : 'text-culinary-deepBrown'} leading-relaxed`}>
                  {message.text}
                </p>
                <p className={`text-xs mt-2 ${message.isUser ? 'text-white/70' : 'text-culinary-deepBrown/50'}`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="culinary-card">
              <div className="flex items-center gap-2">
                <Loader size={20} className="animate-spin text-culinary-terracotta" />
                <span className="text-culinary-deepBrown/70">Preparing your response...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        className="sticky bottom-0 border-t border-culinary-terracotta/10 bg-culinary-warmWhite/90 backdrop-blur-md"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3">
              <ImageAttachment
                preview={imagePreview}
                onRemove={handleRemoveImage}
                onImageSelected={handleImageSelected}
              />
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            {!imagePreview && (
              <ImageAttachment
                onImageSelected={handleImageSelected}
                preview={imagePreview}
              />
            )}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ingredients, recipes, or share a photo..."
              className="input-field flex-1 rounded-full"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !selectedImageBase64)}
              className="btn-primary rounded-full p-3 hover:shadow-warm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <Loader size={20} className="animate-spin" />
              ) : (
                <ArrowUp size={20} />
              )}
            </button>
          </form>

          <p className="text-xs text-culinary-deepBrown/50 mt-3 text-center">
            Powered by Gemini 1.5 Pro • Your preferences are remembered
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ChatInterface
