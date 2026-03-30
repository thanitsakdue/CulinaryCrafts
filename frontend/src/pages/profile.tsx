import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import PreferencesPanel from '../components/PreferencesPanel'

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
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="culinary-card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              {session.user?.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-culinary-terracotta object-cover"
                />
              )}

              <div>
                <h1 className="text-4xl font-bold gradient-text-warm mb-2">{session.user?.name}</h1>
                <p className="text-lg text-culinary-deepBrown/70">{session.user?.email}</p>
                <div className="mt-4 flex gap-3">
                  <Link href="/chat" className="btn-primary text-center">
                    Back to Chat
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-6 py-3 rounded-xl border-2 border-culinary-terracotta/40 text-culinary-terracotta hover:bg-culinary-terracotta/10 transition-colors font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Panel */}
        <PreferencesPanel />
      </div>
    </div>
  )
}
