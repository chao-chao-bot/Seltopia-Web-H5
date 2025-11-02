import { motion } from 'framer-motion'
import type { Quote } from '@/data/quotes'
import styles from './QuoteCard.module.less'

interface QuoteCardProps {
  quote: Quote
  onClose?: () => void
}

export const QuoteCard = ({ quote, onClose }: QuoteCardProps) => {
  const categoryColors = {
    wisdom: '#3b82f6',
    inspiration: '#10b981',
    mystery: '#8b5cf6',
    guidance: '#f59e0b'
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.card}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className={styles.categoryBadge}
          style={{ backgroundColor: categoryColors[quote.category] }}
        >
          {quote.category}
        </div>
        
        <div className={styles.content}>
          <motion.p
            className={styles.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            "{quote.text}"
          </motion.p>
          
          {quote.author && (
            <motion.p
              className={styles.author}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              — {quote.author}
            </motion.p>
          )}
        </div>

        <motion.button
          className={styles.closeButton}
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>

        {/* 装饰性元素 */}
        <div className={styles.decorations}>
          <motion.div
            className={styles.star}
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity }
            }}
          />
          <motion.div
            className={styles.circle}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
