import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Head from 'next/head'

const ApiTest: NextPage = () => {
  const [backendStatus, setBackendStatus] = useState('checking...')
  const [backendData, setBackendData] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    checkBackendConnection()
  }, [])

  const checkBackendConnection = async () => {
    try {
      // Test direct backend connection
      const response = await fetch('http://localhost:8000')
      const data = await response.json()
      
      setBackendStatus('✅ Connected')
      setBackendData(data)
      setError('')
    } catch (err) {
      setBackendStatus('❌ Failed')
      setError(err instanceof Error ? err.message : 'Connection failed')
    }
  }

  const testApiEndpoint = async () => {
    try {
      const response = await fetch('/api/v1/')
      const data = await response.json()
      
      alert(`API Response: ${JSON.stringify(data, null, 2)}`)
    } catch (err) {
      alert(`API Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Head>
        <title>🔧 API Test - Culinary Crafts</title>
      </Head>

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🔧 API Connection Test
          </h1>

          {/* Backend Status */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Backend Connection Status</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {backendStatus}</p>
              <p><strong>Backend URL:</strong> http://localhost:8000</p>
              
              <button
                onClick={checkBackendConnection}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
              >
                🔄 Retry Connection
              </button>
              
              <button
                onClick={testApiEndpoint}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                🧪 Test API Proxy
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}

            {backendData && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
                <strong>Backend Response:</strong>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(backendData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🚀 How to Start Servers</h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-gray-900">Option 1: Automatic (Recommended)</h3>
                <code className="block bg-gray-100 p-2 rounded mt-1">
                  .\scripts\start-servers.bat
                </code>
                <p className="text-gray-600 mt-1">หรือ</p>
                <code className="block bg-gray-100 p-2 rounded mt-1">
                  .\scripts\start-servers.ps1
                </code>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Option 2: Manual</h3>
                <div className="space-y-2 mt-1">
                  <div>
                    <strong>Terminal 1 (Backend):</strong>
                    <code className="block bg-gray-100 p-2 rounded mt-1">
                      cd backend<br />
                      venv\Scripts\activate.bat<br />
                      uvicorn app.main:app --reload
                    </code>
                  </div>
                  
                  <div>
                    <strong>Terminal 2 (Frontend):</strong>
                    <code className="block bg-gray-100 p-2 rounded mt-1">
                      cd frontend<br />
                      npm run dev
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              ← กลับหน้าแรก
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiTest