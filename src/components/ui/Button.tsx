import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import styles from './Button.module.less'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'medium', loading, children, ...props }, ref) => {
    const { 
      onAnimationStart, 
      onAnimationEnd, 
      onDragStart,
      onDrag,
      onDragEnd,
      ...restProps 
    } = props

    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      loading ? styles.loading : '',
      className
    ].filter(Boolean).join(' ')

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        disabled={loading}
        {...restProps}
      >
        {loading && <span className={styles.spinner} />}
        {children}
      </motion.button>
    )
  }
)