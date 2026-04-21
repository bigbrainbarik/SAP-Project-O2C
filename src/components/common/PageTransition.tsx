import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

export const PageTransition = ({ children }: PropsWithChildren) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)
