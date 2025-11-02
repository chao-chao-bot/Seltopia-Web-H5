import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export const FadeIn = ({ children, delay = 0, duration = 0.6, className }: FadeInProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  )
}
