import { motion } from 'framer-motion'
import styles from './MysticalEffects.module.less'

export const MysticalEffects = () => {
  return (
    <div className={styles.container}>
      {/* 浮动的神秘符号 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={styles.floatingSymbol}
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5
          }}
        >
          {['✦', '◊', '✧', '⟡', '◈', '⬟'][i]}
        </motion.div>
      ))}

      {/* 光环效果 */}
      <motion.div
        className={styles.halo}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* 能量波纹 */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className={styles.energyWave}
          animate={{
            scale: [0, 2, 0],
            opacity: [0, 0.4, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* 星尘效果 */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`stardust-${i}`}
          className={styles.stardust}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 100],
            y: [0, (Math.random() - 0.5) * 100]
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}
