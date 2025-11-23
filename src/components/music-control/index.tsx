import { motion } from 'framer-motion';
import styles from './index.module.less';

interface MusicControlProps {
  isPlaying: boolean;
  onToggle: () => void;
  
}

// 修改 src/components/music-control/index.tsx

export function MusicControl({ isPlaying, onToggle }: MusicControlProps) {
  return (
    <button
      onClick={onToggle}
      className={styles.button}
      aria-label={isPlaying ? 'Mute music' : 'Play music'}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {isPlaying ? (
          <>
            {/* 第一条波浪 */}
            <motion.path
              d="M2 12C3 10 4 10 5 12C6 14 7 14 8 12"
              initial={{ d: "M2 12C3 10 4 10 5 12C6 14 7 14 8 12" }}  // 👈 添加 initial
              animate={{
                d: [
                  "M2 12C3 10 4 10 5 12C6 14 7 14 8 12",
                  "M2 12C3 14 4 14 5 12C6 10 7 10 8 12",
                  "M2 12C3 10 4 10 5 12C6 14 7 14 8 12"
                ]
              }}
              stroke="#D7B496"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* 第二条波浪 */}
            <motion.path
              d="M9 12C10 10.5 11 10.5 12 12C13 13.5 14 13.5 15 12"
              initial={{ d: "M9 12C10 10.5 11 10.5 12 12C13 13.5 14 13.5 15 12" }}  // 👈 添加 initial
              animate={{
                d: [
                  "M9 12C10 10.5 11 10.5 12 12C13 13.5 14 13.5 15 12",
                  "M9 12C10 13.5 11 13.5 12 12C13 10.5 14 10.5 15 12",
                  "M9 12C10 10.5 11 10.5 12 12C13 13.5 14 13.5 15 12"
                ]
              }}
              stroke="#D7B496"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
            
            {/* 第三条波浪 */}
            <motion.path
              d="M16 12C17 10 18 10 19 12C20 14 21 14 22 12"
              initial={{ d: "M16 12C17 10 18 10 19 12C20 14 21 14 22 12" }}  // 👈 添加 initial
              animate={{
                d: [
                  "M16 12C17 10 18 10 19 12C20 14 21 14 22 12",
                  "M16 12C17 14 18 14 19 12C20 10 21 10 22 12",
                  "M16 12C17 10 18 10 19 12C20 14 21 14 22 12"
                ]
              }}
              stroke="#D7B496"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8
              }}
            />
          </>
        ) : (
          <>
            {/* Static gentle sine waves */}
            <path
              d="M2 12C3 10 4 10 5 12C6 14 7 14 8 12"
              stroke="#D7B496"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            <path
              d="M9 12C10 10.5 11 10.5 12 12C13 13.5 14 13.5 15 12"
              stroke="#D7B496"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
            <path
              d="M16 12C17 10 18 10 19 12C20 14 21 14 22 12"
              stroke="#D7B496"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          </>
        )}
      </svg>
    </button>
  );
}