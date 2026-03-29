import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

// Example protected page showing user info
export default function UserProfile() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen kitchen-bg flex items-center justify-center">
        <div className="culinary-card max-w-md">
          <h1 className="text-3xl font-bold gradient-text-warm mb-4">Not Signed In</h1>
          <button onClick={() => signIn('google')} className="btn-primary-lg w-full">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen kitchen-bg p-6">
      <div className="max-w-2xl mx-auto">
        <div className="culinary-card">
          <h1 className="text-4xl font-bold gradient-text-warm mb-6">Profile</h1>

          {session.user?.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4 border-2 border-culinary-terracotta"
            />
          )}

          <div className="space-y-2 mb-6">
            <p className="text-lg">
              <strong>Name:</strong> {session.user?.name}
            </p>
            <p className="text-lg">
              <strong>Email:</strong> {session.user?.email}
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/chat" className="btn-primary flex-1 text-center">
              Go to Chat
            </Link>
            <button onClick={() => signOut()} className="btn-secondary flex-1">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
