import { motion } from 'framer-motion';
import { ImageWithFallback } from '../imageWithFallback';
import logoImage from '@/assets/logos/logo.png';
import styles from './index.module.less';

export function LoadingOrb() {
  return (
    <div className={styles.container}>
      {/* Outer pulsing ring */}
      <motion.div
        className={styles.outerRing}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Middle pulsing ring */}
      <motion.div
        className={styles.middleRing}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.15, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      
      {/* Inner pulsing ring */}
      <motion.div
        className={styles.innerRing}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.2, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
      
      {/* Central logo container with glow */}
      <motion.div
        className={styles.logoContainer}
        animate={{
          boxShadow: [
            "0 0 20px rgba(215, 180, 150, 0.4)",
            "0 0 40px rgba(215, 180, 150, 0.8)",
            "0 0 20px rgba(215, 180, 150, 0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Rotating orbital logo - orbital paths rotate around central core */}
        <motion.div
          className={styles.logoRotator}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <ImageWithFallback 
            src={logoImage}
            alt="Seltopia Logo"
            width={112}
            height={112}
            className={styles.logoImage}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
