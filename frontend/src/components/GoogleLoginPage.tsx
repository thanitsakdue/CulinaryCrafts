import React from 'react'
import { motion } from 'framer-motion'
import { Chrome } from 'lucide-react'

interface GoogleLoginPageProps {
  onLogin?: () => void
  isLoading?: boolean
}

export const GoogleLoginPage: React.FC<GoogleLoginPageProps> = ({
  onLogin,
  isLoading = false,
}) => {
  const handleGoogleLogin = () => {
    // In production, this would initiate OAuth flow with NextAuth.js
    if (onLogin) onLogin()
  }

  // Animated background elements
  const backgroundVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <div className="min-h-screen kitchen-bg overflow-hidden flex items-center justify-center px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-culinary-terracotta/10 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-culinary-sageGreen/10 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            className="text-6xl mb-4 inline-block"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👨‍🍳
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold gradient-text-warm mb-4">
            Culinary Crafts
          </h1>

          <p className="text-xl text-culinary-deepBrown/70 font-medium">
            Your Personal AI Cooking Companion
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="culinary-card-hover border-2 border-culinary-terracotta/20 p-8 md:p-10"
          variants={itemVariants}
        >
          {/* Subtitle */}
          <h2 className="text-2xl font-bold text-culinary-deepBrown mb-2">
            Welcome Back
          </h2>
          <p className="text-culinary-deepBrown/60 mb-8">
            Sign in with your Google account to get started
          </p>

          {/* Google Button */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full btn-primary-lg flex items-center justify-center gap-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Chrome size={24} />
            <span>{isLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </motion.button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-culinary-gold/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-culinary-warmWhite text-culinary-deepBrown/50">
                or
              </span>
            </div>
          </div>

          {/* Email Alternative (Future) */}
          <p className="text-sm text-culinary-deepBrown/50 text-center mb-6">
            Email login coming soon
          </p>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-culinary-sageGreen/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-culinary-sageGreen"></div>
              </div>
              <p className="text-sm text-culinary-deepBrown/70">
                Personalized recipe recommendations
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-culinary-sageGreen/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-culinary-sageGreen"></div>
              </div>
              <p className="text-sm text-culinary-deepBrown/70">
                Share ingredient photos for instant suggestions
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-culinary-sageGreen/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-culinary-sageGreen"></div>
              </div>
              <p className="text-sm text-culinary-deepBrown/70">
                Your preferences remembered across sessions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-8 text-xs text-culinary-deepBrown/50"
          variants={itemVariants}
        >
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-culinary-terracotta font-semibold hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-culinary-terracotta font-semibold hover:underline">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default GoogleLoginPage
