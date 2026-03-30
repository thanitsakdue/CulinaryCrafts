import React from 'react'
import { motion } from 'framer-motion'

/**
 * Design System Preview/Styleguide Component
 * Displays all colors, buttons, cards, and typography
 * Useful for design QA and documentation
 * 
 * Usage: Add route /design-system or include in storybook
 */

export const DesignSystemPreview: React.FC = () => {
  const colors = [
    { name: 'Cream (BG)', hex: '#FFFCF2', rgb: 'rgb(255, 252, 242)' },
    { name: 'Warm White', hex: '#FAF8F3', rgb: 'rgb(250, 248, 243)' },
    { name: 'Terracotta', hex: '#FF6B35', rgb: 'rgb(255, 107, 53)' },
    { name: 'Coral', hex: '#FF8A50', rgb: 'rgb(255, 138, 80)' },
    { name: 'Honey Gold', hex: '#FFB562', rgb: 'rgb(255, 181, 98)' },
    { name: 'Sage Green', hex: '#4F772D', rgb: 'rgb(79, 119, 45)' },
    { name: 'Dark Sage', hex: '#2D5016', rgb: 'rgb(45, 80, 22)' },
    { name: 'Gold', hex: '#D4A574', rgb: 'rgb(212, 165, 116)' },
    { name: 'Deep Brown', hex: '#3E2723', rgb: 'rgb(62, 39, 35)' },
    { name: 'Light Cream', hex: '#FFF9ED', rgb: 'rgb(255, 249, 237)' },
  ]

  return (
    <div className="min-h-screen kitchen-bg p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-6xl font-bold gradient-text-warm mb-2">Design System</h1>
          <p className="text-xl text-culinary-deepBrown/60">
            Culinary Crafts Visual Language & Components
          </p>
        </motion.div>

        {/* Colors Section */}
        <section>
          <h2 className="text-4xl font-bold text-culinary-deepBrown mb-6">🎨 Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {colors.map((color, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="space-y-2"
              >
                <div
                  className="w-full h-24 rounded-2xl shadow-md border-2 border-culinary-deepBrown/10"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-sm">
                  <p className="font-bold text-culinary-deepBrown">{color.name}</p>
                  <p className="text-xs text-culinary-deepBrown/60">{color.hex}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="text-4xl font-bold text-culinary-deepBrown mb-6">✍️ Typography</h2>
          <div className="space-y-6">
            <div className="culinary-card">
              <h1 className="text-5xl font-bold mb-2">Heading 1 - Playfair Display</h1>
              <p className="text-culinary-deepBrown/60">Used for main titles and hero text</p>
            </div>
            <div className="culinary-card">
              <h2 className="text-4xl font-bold mb-2">Heading 2 - Playfair Display</h2>
              <p className="text-culinary-deepBrown/60">Used for section titles</p>
            </div>
            <div className="culinary-card">
              <p className="text-lg font-semibold mb-2">Body Text - Poppins Semibold</p>
              <p className="text-culinary-deepBrown/70">
                This is regular body text using Poppins font. It's friendly, modern, and highly readable.
              </p>
            </div>
            <div className="culinary-card">
              <p className="text-sm text-culinary-deepBrown/60">
                <code className="bg-culinary-deepBrown/10 px-2 py-1 rounded">Small text</code> - Used for captions and metadata
              </p>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="text-4xl font-bold text-culinary-deepBrown mb-6">🔘 Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              className="btn-primary-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Primary Button Large
            </motion.button>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Primary Button
            </motion.button>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Secondary Button
            </motion.button>
            <motion.button
              className="btn-outline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Outline Button
            </motion.button>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-4xl font-bold text-culinary-deepBrown mb-6">🗂️ Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="culinary-card"
              whileHover={{ y: -4 }}
            >
              <h3 className="text-2xl font-bold gradient-text-warm mb-2">Card Title</h3>
              <p className="text-culinary-deepBrown/70">
                This is a standard culinary card with rounded corners, warm shadow, and subtle border.
              </p>
            </motion.div>

            <motion.div
              className="culinary-card-hover"
              whileHover={{ y: -4 }}
            >
              <h3 className="text-2xl font-bold gradient-text-warm mb-2">Hoverable Card</h3>
              <p className="text-culinary-deepBrown/70">
                This card has interactive hover effects - try hovering!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Input Fields Section */}
        <section>
          <h2 className="text-4xl font-bold text-culinary-deepBrown mb-6">📝 Input Fields</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Text input with focus state"
              className="input-field w-full"
            />
            <textarea
              placeholder="Text area with rounded borders"
              className="input-field w-full h-24 resize-none"
            />
          </div>
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="text-4xl font-bold text-culinary-deepBrown mb-6">🏷️ Badges</h2>
          <div className="flex gap-4 flex-wrap">
            <span className="badge-success">Health ✓</span>
            <span className="badge-warm">Vegetarian 🌿</span>
            <span className="badge-success">Quick Meal ⚡</span>
            <span className="badge-warm">Beginner Friendly</span>
          </div>
        </section>

        {/* Animations Section */}
        <section>
          <h2 className="text-4xl font-bold text-culinary-deepBrown mb-6">✨ Animations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              className="h-24 bg-culinary-terracotta rounded-2xl flex items-center justify-center text-white font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Rise
            </motion.div>
            <motion.div
              className="h-24 bg-culinary-sageGreen rounded-2xl flex items-center justify-center text-white font-bold"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Float
            </motion.div>
            <motion.div
              className="h-24 bg-culinary-coral rounded-2xl flex items-center justify-center text-white font-bold"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              Spin
            </motion.div>
            <motion.div
              className="h-24 bg-culinary-gold rounded-2xl flex items-center justify-center text-white font-bold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Pulse
            </motion.div>
          </div>
        </section>

        {/* Coming Soon */}
        <section>
          <div className="culinary-card border-2 border-dashed border-culinary-terracotta">
            <h2 className="text-2xl font-bold gradient-text-warm mb-4">🎯 Component Gallery</h2>
            <p className="text-culinary-deepBrown/70">
              This design system will be expanded with:
            </p>
            <ul className="list-disc list-inside text-culinary-deepBrown/70 mt-3">
              <li>Modal/Dialog components</li>
              <li>Dropdown menus</li>
              <li>Toast notifications</li>
              <li>Loading states</li>
              <li>Error states</li>
              <li>Accessibility patterns</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-culinary-deepBrown/50 py-8">
          <p>Design System v1.0 • Last Updated: March 28, 2026</p>
        </div>
      </div>
    </div>
  )
}

export default DesignSystemPreview
