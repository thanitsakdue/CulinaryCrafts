/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        culinary: {
          cream: '#FFFCF2',
          warmWhite: '#FAF8F3',
          terracotta: '#FF6B35',
          coral: '#FF8A50',
          honey: '#FFB562',
          sageGreen: '#4F772D',
          darkSage: '#2D5016',
          gold: '#D4A574',
          deepBrown: '#3E2723',
          lightCream: '#FFF9ED',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      animation: {
        rise: 'rise 2s ease-out forwards',
        simmer: 'simmer 4s ease-in-out infinite',
        plate: 'plate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        fadeIn: 'fadeIn 0.6s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        simmer: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.95' },
        },
        plate: {
          '0%': { transform: 'scale(0.95) rotateX(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        warm: '0 10px 30px rgba(255, 107, 53, 0.15)',
        sage: '0 10px 25px rgba(79, 119, 45, 0.1)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}