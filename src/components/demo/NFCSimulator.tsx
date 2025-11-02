import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './NFCSimulator.module.less'

interface NFCSimulatorProps {
  onNFCDetected: () => void
  isActive: boolean
}

export const NFCSimulator = ({ onNFCDetected, isActive }: NFCSimulatorProps) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setIsScanning(false)
      setScanProgress(0)
      return
    }

    const interval = setInterval(() => {
      // 随机触发 NFC 检测 (10% 概率)
      if (Math.random() < 0.1 && !isScanning) {
        startNFCScan()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isActive, isScanning])

  const startNFCScan = () => {
    setIsScanning(true)
    setScanProgress(0)

    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            setIsScanning(false)
            setScanProgress(0)
            onNFCDetected()
          }, 500)
          return 100
        }
        return prev + 5
      })
    }, 50)
  }

  const handleManualTrigger = () => {
    if (!isScanning) {
      startNFCScan()
    }
  }

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className={styles.nfcArea}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* NFC 图标 */}
            <motion.div
              className={styles.nfcIcon}
              animate={isScanning ? {
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              } : {
                scale: [1, 1.05, 1]
              }}
              transition={isScanning ? {
                scale: { duration: 0.5, repeat: Infinity },
                rotate: { duration: 2, ease: 'linear' }
              } : {
                scale: { duration: 2, repeat: Infinity }
              }}
              onClick={handleManualTrigger}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4A2,2 0 0,0 20,2M20,20H4V4H20V20M18,6H16.5A2.5,2.5 0 0,0 14,8.5V9.5A1.5,1.5 0 0,1 12.5,11H11V13H12.5A3.5,3.5 0 0,0 16,9.5V8.5A0.5,0.5 0 0,1 16.5,8H18V6M6,6V8H7.5A0.5,0.5 0 0,1 8,8.5V9.5A3.5,3.5 0 0,0 11.5,13H13V11H11.5A1.5,1.5 0 0,1 10,9.5V8.5A2.5,2.5 0 0,0 7.5,6H6M11,14V16H13V14H11Z" />
              </svg>
            </motion.div>

            {/* 扫描波纹效果 */}
            <AnimatePresence>
              {isScanning && (
                <>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className={styles.ripple}
                      initial={{ scale: 0, opacity: 0.8 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ 
                        duration: 1.5, 
                        delay: i * 0.2,
                        repeat: Infinity 
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* 进度条 */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  className={styles.progressContainer}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <div className={styles.progressBar}>
                    <motion.div
                      className={styles.progressFill}
                      initial={{ width: '0%' }}
                      animate={{ width: `${scanProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <p className={styles.progressText}>
                    NFC 感应中... {scanProgress}%
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 状态文字 */}
            <motion.p
              className={styles.statusText}
              animate={{ opacity: isScanning ? 0.5 : 1 }}
            >
              {isScanning ? '正在感应...' : '点击模拟 NFC 感应'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
