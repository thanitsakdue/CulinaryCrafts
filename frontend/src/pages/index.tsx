import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'

const Home: NextPage = () => {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
      
      const data = await res.json()
      setResponse(data.response || 'No response received')
    } catch (error) {
      setResponse('Error connecting to backend API')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Head>
        <title>🍳 Culinary Crafts - AI Cooking Assistant</title>
        <meta name="description" content="AI-powered cooking assistant with personalized recipes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🍳 <span className="text-orange-600">Culinary Crafts</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI Cooking Assistant ที่ใช้ <strong>Agentic Workflow</strong> และ <strong>Multimodal RAG</strong> 
            เพื่อแนะนำสูตรอาหารที่เหมาะกับคุณ
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-xl font-semibold mb-2">Agentic Intelligence</h3>
            <p className="text-gray-600">AI Agent ที่สามารถถามกลับและตัดสินใจแบบ interactive</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Grounded RAG</h3>
            <p className="text-gray-600">ค้นหาสูตรจากแหล่งข้อมูลที่เชื่อถือได้พร้อมแสดงที่มา</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-xl font-semibold mb-2">Memory-Enabled</h3>
            <p className="text-gray-600">จดจำความชอบและข้อจำกัดทางอาหารของคุณ</p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            💬 Chat with AI Chef
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                บอกวัตถุดิบที่คุณมีหรือถามอะไrgefragen
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="เช่น: ฉันมีไก่ หัวหอม และพริก อยากทำอะไรดี?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '🤔 AI กำลังคิด...' : '🚀 ถาม AI Chef'}
            </button>
          </form>

          {response && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-900 mb-2">🤖 AI Chef Response:</h3>
              <p className="text-gray-700">{response}</p>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Frontend Ready
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Backend API: /api/v1
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Version: 1.0.0
            </div>
          </div>
          
          <div className="mt-4">
            <a 
              href="/api-test" 
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              🔧 Test API Connection
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home