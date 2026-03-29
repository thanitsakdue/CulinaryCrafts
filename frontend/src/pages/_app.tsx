import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { Poppins, Playfair_Display, Space_Mono } from 'next/font/google'

// Load Google Fonts optimized by Next.js
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-playfair',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

type AppPropsWithSession = AppProps<{ session?: Session | null }>

function MyApp({ Component, pageProps }: AppPropsWithSession) {
  const { session, ...restPageProps } = pageProps

  return (
    <div className={`${poppins.variable} ${playfair.variable} ${spaceMono.variable}`}>
      <SessionProvider session={session}>
        <Component {...restPageProps} />
      </SessionProvider>
    </div>
  )
}

export default MyApp