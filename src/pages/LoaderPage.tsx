import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const stages = [
  { text: 'Initializing SAP SD Module', icon: '⚙️' },
  { text: 'Loading Master Data', icon: '📁' },
  { text: 'Connecting FI Integration', icon: '🔗' },
  { text: 'Preparing Transaction Engine', icon: '🔧' },
  { text: 'Launching Dashboard', icon: '🚀' },
]

export const LoaderPage = () => {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((prev) => {
        if (prev >= stages.length - 1) {
          window.clearInterval(interval)
          window.setTimeout(() => navigate('/dashboard'), 600)
          return prev
        }
        return prev + 1
      })
    }, 850)

    return () => window.clearInterval(interval)
  }, [navigate])

  const progress = ((index + 1) / stages.length) * 100

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 dark:bg-surface-dim">
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg rounded-2xl bg-surface-container-low p-8 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container"
      >
        <h1 className="font-heading text-3xl font-black tracking-tight">Launching O2C Engine</h1>
        <p className="mt-2 text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
          Preparing enterprise simulation environment...
        </p>

        <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-surface-variant">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{stages[index].icon}</span>
              <span className="text-sm font-semibold text-primary">{stages[index].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-2 text-xs text-on-surface/50 dark:text-inverse-on-surface/50">
          {Math.round(progress)}% complete — Step {index + 1} of {stages.length}
        </p>

        {/* Stage dots */}
        <div className="mt-4 flex gap-2">
          {stages.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i <= index ? 'bg-primary' : 'bg-surface-variant'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i <= index ? 1 : 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            />
          ))}
        </div>
      </motion.section>
    </main>
  )
}
