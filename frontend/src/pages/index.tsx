  import type { NextPage } from 'next'
  import Head from 'next/head'
  import { useState } from 'react'
  import ReactMarkdown from 'react-markdown'
  import remarkGfm from 'remark-gfm'

  interface Message {
    role: 'user' | 'model';
    content: string;
  }

  const Home: NextPage = () => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Message[]>([
      { role: 'model', content: 'สวัสดีครับ! ผม AI Chef ยินดีที่ได้รู้จัก วันนี้อยากทำเมนูอะไรดีครับ?' }
    ])
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return

      const userQuery = input
      setInput('')
      setIsLoading(true)
      
      const updatedMessages: Message[] = [...messages, { role: 'user', content: userQuery }]
      setMessages(updatedMessages)
      
      try {
        const res = await fetch('http://localhost:8000/api/v1/chat', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: userQuery,   // ✅ เปลี่ยนจาก query เป็น message
            user_id: "user_12345", 
            history: []           // ส่งเป็นอาเรย์ว่างไปก่อน
          }),
        })
        
        const data = await res.json();

        if (res.ok && data.response) {
          // เราเก็บคำตอบไว้ในฟิลด์ content ของ Message interface
          setMessages((prev) => [...prev, { role: 'model', content: data.response }]);
        } else {
          // ถ้าพัง ให้พ่น Error ที่อ่านออกง่ายๆ
          const errorMsg = data.message || data.detail || "เชฟมึนงง";
          setMessages((prev) => [...prev, { role: 'model', content: `❌ Error: ${errorMsg}` }]);
        }
      } catch (error) {
        console.error('Error:', error)
        setMessages((prev) => [...prev, { role: 'model', content: 'ขออภัยครับ เชฟเกิดข้อผิดพลาดในการเชื่อมต่อ' }])
      }
      
      setIsLoading(false)
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Head>
          <title>🍳 Culinary Crafts - AI Cooking Assistant</title>
          <meta name="description" content="AI-powered cooking assistant with personalized recipes" />
        </Head>

        <main className="container mx-auto px-4 py-8">
          {/* Header ส่วนเดิม */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🍳 <span className="text-orange-600">Culinary Crafts</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI Cooking Assistant ที่จดจำประวัติการสนทนาได้แล้ว!
            </p>
          </div>

          {/* Chat Interface แบบใหม่ที่แสดงผลเป็นกล่องแชท */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto flex flex-col h-[600px]">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">💬 Chat with AI Chef</h2>
            
            {/* 6. ส่วนแสดงประวัติการคุย (Chat Window) */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 border rounded-md bg-gray-50 shadow-inner">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-orange-600 text-white rounded-br-none' 
                      : 'bg-white border text-gray-800 rounded-bl-none'
                  }`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-orange-600 text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}>
                      {/* ใช้ ReactMarkdown แทน p tag ปกติ */}
                      <div className={`prose prose-sm max-w-none break-words ${msg.role === 'user' ? 'prose-invert text-white' : 'text-gray-800'}`}>
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            strong: ({ children }) => (
                              <b className={msg.role === 'model' ? "font-bold text-orange-700" : "font-bold text-white"}>
                                {children}
                              </b>
                            ),
                            ul: ({ children }) => <ul className="list-disc ml-4 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal ml-4 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 p-3 rounded-lg rounded-bl-none text-sm animate-pulse">
                    เชฟกำลังเตรียมข้อมูล... 🥣
                  </div>
                </div>
              )}
            </div>

            {/* ฟอร์มส่งข้อความ */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ถามเชฟได้เลย..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                ส่ง
              </button>
            </form>
          </div>
          
          {/* Status ส่วนเดิม */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Memory Mode Enabled
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  export default Home