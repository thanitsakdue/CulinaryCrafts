import React, { useEffect } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { ChefHat, Beaker } from 'lucide-react'
import GoogleLoginPage from '../components/GoogleLoginPage'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      void router.replace('/chat')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen kitchen-bg flex items-center justify-center">
        <motion.div
          animate={{ scale: [0.95, 1, 0.95] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl text-culinary-terracotta"
        >
          <ChefHat size={64} />
        </motion.div>
      </div>
    )
  }

  const handleTestLogin = async () => {
    await signIn('credentials', {
      email: 'test@demo.com',
      password: 'demo',
      callbackUrl: '/chat',
      redirect: true,
    })
  }

  return (
    <>
      <Head>
        <title>Culinary Crafts - AI Cooking Assistant</title>
        <meta name="description" content="Your personal AI cooking companion powered by Google Gemini" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!session ? (
        <div>
          <GoogleLoginPage
            onLogin={() => signIn('google', { callbackUrl: '/chat' })}
            isLoading={false}
          />
          {/* Test Login Button - Remove this in production */}
          <div className="fixed bottom-4 right-4 z-50">
            <motion.button
              onClick={handleTestLogin}
              className="px-6 py-3 bg-gradient-to-br from-culinary-terracotta to-culinary-coral hover:shadow-warm text-white font-semibold rounded-xl flex items-center gap-2 transition-all active:scale-95"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Demo login - for frontend testing only"
            >
              <Beaker size={18} />
              Test Login
            </motion.button>
          </div>
        </div>
      ) : null}
    </>
  )
}

  export default Home