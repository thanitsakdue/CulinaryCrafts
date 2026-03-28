import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ChatWorkspace from '../components/ChatWorkspace'

export default function ChatPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen kitchen-bg flex items-center justify-center">
        <motion.div
          animate={{ scale: [0.95, 1, 0.95] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl"
        >
          👨‍🍳
        </motion.div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen kitchen-bg flex items-center justify-center">
        <div className="culinary-card max-w-md">
          <h1 className="text-3xl font-bold gradient-text-warm mb-4">Please Sign In</h1>
          <p className="text-culinary-deepBrown/70 mb-6">
            You need to be signed in to access the chat.
          </p>
          <Link href="/" className="btn-primary-lg block text-center">
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Culinary Crafts Chat</title>
        <meta name="description" content="Chat with your AI cooking assistant" />
      </Head>
      <ChatWorkspace
        userName={session?.user?.name}
        userImage={session?.user?.image}
        onSignOut={() => signOut({ callbackUrl: '/' })}
      />
    </>
  )
}
