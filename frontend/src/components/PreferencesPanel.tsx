import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Flame, Utensils, AlertCircle } from 'lucide-react'

interface Preferences {
  allergies: string[]
  spiceLevel: 'mild' | 'medium' | 'hot' | 'very-hot'
  cuisines: string[]
  dietaryType: ('none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'halal' | 'kosher')[]
  ingredientsToAvoid: string[]
}

const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree nuts',
  'Milk',
  'Eggs',
  'Fish',
  'Shellfish',
  'Wheat',
  'Soy',
  'Sesame',
]

const CUISINE_OPTIONS = [
  'Thai',
  'Italian',
  'Japanese',
  'Mexican',
  'Indian',
  'Chinese',
  'Korean',
  'Spanish',
  'Greek',
  'Swedish',
  'Australian',
  'Peruvian',
  'Moroccan',
  'Lebanese',
  'Filipino',
  'Vietnamese',
]

const SPICE_LEVELS = [
  { value: 'mild', label: 'Mild', description: 'Minimal heat' },
  { value: 'medium', label: 'Medium', description: 'Moderate spice' },
  { value: 'hot', label: 'Hot', description: 'Quite spicy' },
  { value: 'very-hot', label: 'Very Hot', description: 'Extreme heat' },
]

const DIETARY_OPTIONS = [
  { value: 'none', label: 'None', description: 'No restrictions' },
  { value: 'vegetarian', label: 'Vegetarian', description: 'No meat/fish' },
  { value: 'vegan', label: 'Vegan', description: 'No animal products' },
  { value: 'keto', label: 'Keto', description: 'Low carb, high fat' },
  { value: 'paleo', label: 'Paleo', description: 'Natural foods only' },
  { value: 'halal', label: 'Halal', description: 'Islamic dietary laws' },
  { value: 'kosher', label: 'Kosher', description: 'Jewish dietary laws' },
]

export default function PreferencesPanel() {
  const [preferences, setPreferences] = useState<Preferences>({
    allergies: [],
    spiceLevel: 'medium',
    cuisines: [],
    dietaryType: [],
    ingredientsToAvoid: [],
  })

  const [customAllergy, setCustomAllergy] = useState('')
  const [customIngredient, setCustomIngredient] = useState('')
  const [saved, setSaved] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('culinarycrafts.preferences')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert old single-select dietaryType to array format
        if (typeof parsed.dietaryType === 'string') {
          parsed.dietaryType = parsed.dietaryType ? [parsed.dietaryType] : []
        }
        // Ensure dietaryType is always an array
        if (!Array.isArray(parsed.dietaryType)) {
          parsed.dietaryType = []
        }
        setPreferences(parsed)
      } catch (e) {
        console.error('Failed to load preferences', e)
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('culinarycrafts.preferences', JSON.stringify(preferences))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleAllergy = (allergy: string) => {
    setPreferences((prev) => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter((a) => a !== allergy)
        : [...prev.allergies, allergy],
    }))
  }

  const addCustomAllergy = (allergy: string) => {
    if (allergy.trim() && !preferences.allergies.includes(allergy)) {
      setPreferences((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergy],
      }))
      setCustomAllergy('')
    }
  }

  const removeAllergy = (allergy: string) => {
    setPreferences((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }))
  }

  const toggleCuisine = (cuisine: string) => {
    setPreferences((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((c) => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }))
  }

  const toggleDietaryType = (dietary: string) => {
    setPreferences((prev) => ({
      ...prev,
      dietaryType: prev.dietaryType.includes(dietary as any)
        ? prev.dietaryType.filter((d) => d !== dietary)
        : [...prev.dietaryType, dietary as any],
    }))
  }

  const addCustomIngredient = (ingredient: string) => {
    if (ingredient.trim() && !preferences.ingredientsToAvoid.includes(ingredient)) {
      setPreferences((prev) => ({
        ...prev,
        ingredientsToAvoid: [...prev.ingredientsToAvoid, ingredient],
      }))
      setCustomIngredient('')
    }
  }

  const removeIngredient = (ingredient: string) => {
    setPreferences((prev) => ({
      ...prev,
      ingredientsToAvoid: prev.ingredientsToAvoid.filter((i) => i !== ingredient),
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-culinary-deepBrown mb-2">Your Preferences</h2>
        <p className="text-culinary-deepBrown/60">Customize your cooking experience</p>
      </div>

      {/* Spice Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="culinary-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <Flame className="text-culinary-terracotta" size={24} />
          <h3 className="text-2xl font-bold text-culinary-deepBrown">Spice Level</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SPICE_LEVELS.map((level) => (
            <motion.button
              type="button"
              key={level.value}
              onClick={() =>
                setPreferences((prev) => ({
                  ...prev,
                  spiceLevel: level.value as Preferences['spiceLevel'],
                }))
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={preferences.spiceLevel === level.value ? {
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                borderColor: 'rgb(255, 107, 53)'
              } : {}}
              transition={{ duration: 0.2 }}
              className={
                'p-4 rounded-2xl border-2 transition-all text-center cursor-pointer ' +
                (preferences.spiceLevel === level.value
                  ? 'border-culinary-terracotta bg-culinary-terracotta/10 shadow-md'
                  : 'border-culinary-gold/20 bg-culinary-cream/5 hover:border-culinary-terracotta/50')
              }
            >
              <div className="font-bold text-lg">{level.label}</div>
              <div className="text-xs text-culinary-deepBrown/60 mt-1">{level.description}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Dietary Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="culinary-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <Utensils className="text-culinary-sage" size={24} />
          <h3 className="text-2xl font-bold text-culinary-deepBrown">Dietary Type</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {DIETARY_OPTIONS.map((option) => (
            <motion.button
              type="button"
              key={option.value}
              onClick={() => toggleDietaryType(option.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={preferences.dietaryType.includes(option.value as any) ? { 
                backgroundColor: 'rgba(79, 119, 45, 0.1)',
                borderColor: 'rgb(79, 119, 45)'
              } : {}}
              transition={{ duration: 0.2 }}
              className={`p-3 rounded-2xl border-2 transition-all text-center cursor-pointer ${
                preferences.dietaryType.includes(option.value as any)
                  ? 'border-culinary-sage bg-culinary-sage/10 shadow-md'
                  : 'border-culinary-gold/20 bg-culinary-cream/5 hover:border-culinary-sage/50'
              }`}
            >
              <div className="font-semibold text-sm">{option.label}</div>
              <div className="text-[11px] text-culinary-deepBrown/60 mt-1">{option.description}</div>
            </motion.button>
          ))}
        </div>

        {/* Selected dietary types */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: preferences.dietaryType.length > 0 ? 1 : 0, y: preferences.dietaryType.length > 0 ? 0 : -10 }}
          transition={{ duration: 0.3 }}
          className={preferences.dietaryType.length > 0 ? 'mt-6 p-4 bg-culinary-sage/10 rounded-2xl border border-culinary-sage/30' : 'hidden'}
        >
          <p className="text-sm font-semibold text-culinary-sage mb-3">Your dietary preferences:</p>
          <div className="flex flex-wrap gap-2">
            {preferences.dietaryType.map((dietary) => (
              <motion.div
                key={dietary}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-culinary-sage/40 shadow-sm"
              >
                <span className="text-sm text-culinary-sage">{DIETARY_OPTIONS.find(d => d.value === dietary)?.label}</span>
                <motion.button
                  type="button"
                  onClick={() => toggleDietaryType(dietary)}
                  className="text-culinary-sage/60 hover:text-culinary-sage ml-1"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Allergies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="culinary-card"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-red-500" size={24} />
          <h3 className="text-2xl font-bold text-culinary-deepBrown">Allergies</h3>
        </div>

        {/* Common allergies */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-culinary-deepBrown/70 mb-3">Common allergies:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_ALLERGIES.map((allergy) => (
              <button
                type="button"
                key={allergy}
                onClick={() => toggleAllergy(allergy)}
                className={
                  'px-4 py-2 rounded-full border-2 transition-all text-sm font-medium ' +
                  (preferences.allergies.includes(allergy)
                    ? 'border-red-400 bg-red-50 text-red-700'
                    : 'border-culinary-gold/20 bg-culinary-cream/5 text-culinary-deepBrown hover:border-red-300')
                }
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        {/* Selected allergies */}
        {preferences.allergies.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-200">
            <p className="text-sm font-semibold text-red-700 mb-3">Your allergies:</p>
            <div className="flex flex-wrap gap-2">
              {preferences.allergies.map((allergy) => (
                <div
                  key={allergy}
                  className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-red-200"
                >
                  <span className="text-sm text-red-700">{allergy}</span>
                  <button
                    type="button"
                    onClick={() => removeAllergy(allergy)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add custom allergy */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            placeholder="Add custom allergy…"
            onKeyPress={(e) => {
              if (e.key === 'Enter') addCustomAllergy(customAllergy)
            }}
            className="flex-1 px-4 py-2 rounded-xl border border-culinary-gold/20 bg-culinary-cream/5 text-culinary-deepBrown placeholder:text-culinary-deepBrown/40 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            type="button"
            onClick={() => addCustomAllergy(customAllergy)}
            className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </motion.div>

      {/* Preferred Cuisines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="culinary-card"
      >
        <h3 className="text-2xl font-bold text-culinary-deepBrown mb-4">Favorite Cuisines</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CUISINE_OPTIONS.map((cuisine) => (
            <motion.button
              type="button"
              key={cuisine}
              onClick={() => toggleCuisine(cuisine)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={preferences.cuisines.includes(cuisine) ? {
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                borderColor: 'rgb(255, 107, 53)'
              } : {}}
              transition={{ duration: 0.2 }}
              className={
                'p-4 rounded-2xl border-2 transition-all font-semibold text-center cursor-pointer ' +
                (preferences.cuisines.includes(cuisine)
                  ? 'border-culinary-terracotta bg-culinary-terracotta/10 text-culinary-deepBrown shadow-md'
                  : 'border-culinary-gold/20 bg-culinary-cream/5 text-culinary-deepBrown hover:border-culinary-terracotta/50')
              }
            >
              {cuisine}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Ingredients to Avoid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="culinary-card"
      >
        <h3 className="text-2xl font-bold text-culinary-deepBrown mb-4">Ingredients to Avoid</h3>

        {/* Listed ingredients */}
        {preferences.ingredientsToAvoid.length > 0 && (
          <div className="mb-6 p-4 bg-orange-50 rounded-2xl border border-orange-200">
            <p className="text-sm font-semibold text-orange-700 mb-3">Avoid these:</p>
            <div className="flex flex-wrap gap-2">
              {preferences.ingredientsToAvoid.map((ingredient) => (
                <div
                  key={ingredient}
                  className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-orange-200"
                >
                  <span className="text-sm text-orange-700">{ingredient}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient)}
                    className="text-orange-400 hover:text-orange-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add custom ingredient */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            placeholder="Add ingredient to avoid…"
            onKeyPress={(e) => {
              if (e.key === 'Enter') addCustomIngredient(customIngredient)
            }}
            className="flex-1 px-4 py-2 rounded-xl border border-culinary-gold/20 bg-culinary-cream/5 text-culinary-deepBrown placeholder:text-culinary-deepBrown/40 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="button"
            onClick={() => addCustomIngredient(customIngredient)}
            className="px-4 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <button
          type="button"
          onClick={handleSave}
          className={
            'px-8 py-4 rounded-2xl font-bold text-lg transition-all ' +
            (saved
              ? 'bg-green-500 text-white scale-105'
              : 'bg-gradient-to-br from-culinary-terracotta to-culinary-coral text-white hover:shadow-warm')
          }
        >
          {saved ? 'Saved!' : 'Save Preferences'}
        </button>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="culinary-card bg-gradient-to-br from-culinary-cream/10 to-culinary-terracotta/5 border border-culinary-gold/20"
      >
        <h4 className="font-bold text-culinary-deepBrown mb-3">Your Profile Summary</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-culinary-deepBrown/80">
          <p>
            <strong>Spice Level:</strong> {(SPICE_LEVELS.find((l) => l.value === preferences.spiceLevel)?.label || 'Not set')}
          </p>
          <p>
            <strong>Dietary Types:</strong>{' '}
            {preferences.dietaryType.length > 0
              ? preferences.dietaryType
                  .map((d) => DIETARY_OPTIONS.find((opt) => opt.value === d)?.label)
                  .join(', ')
              : 'None selected'}
          </p>
          <p>
            <strong>Allergies:</strong>{' '}
            {preferences.allergies.length > 0 ? preferences.allergies.join(', ') : 'None'}
          </p>
          <p>
            <strong>Cuisines:</strong>{' '}
            {preferences.cuisines.length > 0 ? preferences.cuisines.join(', ') : 'Any'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
