import React from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function ErrorPage() {
  const router = useRouter()
  const { error } = router.query

  return (
    <>
      <Head>
        <title>Authentication Error - Culinary Crafts</title>
      </Head>
      <div className="min-h-screen kitchen-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Error</h1>
            
            {error && (
              <p className="text-red-600 mb-6 text-sm break-words">
                {error === 'AccessDenied' && 'Access was denied. Please try again.'}
                {error === 'OAuthCallback' && 'There was a problem signing in. Please try again.'}
                {error === 'OAuthSignin' && 'Could not sign in with Google.'}
                {error === 'Callback' && 'Callback error during sign-in.'}
                {!['AccessDenied', 'OAuthCallback', 'OAuthSignin', 'Callback'].includes(String(error)) && error}
              </p>
            )}

            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Back to Login
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
