import { motion } from 'framer-motion'
import styles from './Loading.module.less'

interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

export const Loading = ({ size = 'medium', text }: LoadingProps) => {
  return (
    <div className={styles.container}>
      <motion.div
        className={`${styles.spinner} ${styles[size]}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      {text && (
        <motion.p
          className={styles.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}