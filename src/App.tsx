import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn } from '@/components/animations/FadeIn'
import { ParticleBackground } from '@/components/animations/ParticleBackground'
import { MysticalEffects } from '@/components/animations/MysticalEffects'
import { Button } from '@/components/ui'
import { QuoteCard } from '@/components/ui/QuoteCard'
import { NFCSimulator } from '@/components/demo/NFCSimulator'
import { useViewportHeight } from '@/hooks/useViewportHeight'
import { useSound } from '@/hooks/useSound'
import { getDeviceInfo } from '@/utils/deviceDetection'
import { APP_CONFIG } from '@/utils/constants'
import { getRandomQuote } from '@/data/quotes'
import type { Quote } from '@/data/quotes'
import styles from './App.module.less'

function App() {
  useViewportHeight() // 初始化视口高度
  
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [showNFCSimulator, setShowNFCSimulator] = useState(false)
  const [isExperienceStarted, setIsExperienceStarted] = useState(false)
  const [showMysticalEffects, setShowMysticalEffects] = useState(false)
  
  const { playChime, playMysticalSound, playSuccessSound, playClickSound, vibrate } = useSound()

  useEffect(() => {
    // 初始化设备信息
    const deviceInfo = getDeviceInfo()
    console.log('设备信息:', JSON.stringify(deviceInfo, null, 2))
    
    // 设置页面标题
    document.title = APP_CONFIG.name
    
    // 播放欢迎音效
    setTimeout(() => {
      playChime()
    }, 1000)
  }, [playChime])

  const handleStartExperience = () => {
    playClickSound()
    vibrate([100, 50, 100])
    setIsExperienceStarted(true)
    setShowNFCSimulator(true)
    setShowMysticalEffects(true)
    
    // 播放神秘音效
    setTimeout(() => {
      playMysticalSound()
    }, 500)
  }

  const handleNFCDetected = () => {
    playSuccessSound()
    vibrate([200, 100, 200, 100, 200])
    
    // 显示随机箴言
    const quote = getRandomQuote()
    setCurrentQuote(quote)
    
    // 暂时隐藏神秘效果，突出箴言
    setShowMysticalEffects(false)
  }

  const handleCloseQuote = () => {
    playClickSound()
    setCurrentQuote(null)
    setShowMysticalEffects(true)
  }

  const handleGetAnotherQuote = () => {
    playClickSound()
    vibrate(100)
    
    // 先隐藏当前箴言
    setCurrentQuote(null)
    
    // 短暂延迟后显示新箴言
    setTimeout(() => {
      const quote = getRandomQuote()
      setCurrentQuote(quote)
      playMysticalSound()
    }, 300)
  }

  return (
    <div className={styles.app}>
      {/* 粒子背景 */}
      <ParticleBackground />
      
      {/* 神秘效果 */}
      <AnimatePresence>
        {showMysticalEffects && <MysticalEffects />}
      </AnimatePresence>
      
      {/* 主要内容 */}
      <div className={styles.container}>
        <div className={styles.content}>
          <FadeIn delay={0.2}>
            {/* Logo 区域 */}
            <motion.div
              className={styles.logo}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5,
                type: 'spring',
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 12px 40px rgba(212, 175, 55, 0.5)'
              }}
            >
              S
            </motion.div>

            {/* 标题 */}
            <FadeIn delay={0.8}>
              <h1 className={styles.title}>Seltopia</h1>
              <p className={styles.subtitle}>The Book of Answers</p>
            </FadeIn>

            {/* 描述文字 */}
            <FadeIn delay={1.2}>
              <p className={styles.description}>
                通过 NFC 感应，开启神秘的智慧之旅。
                <br />
                每一次触碰，都是一次心灵的对话。
              </p>
            </FadeIn>

            {/* 交互按钮 */}
            <FadeIn delay={1.6}>
              <div className={styles.buttonContainer}>
                {!isExperienceStarted ? (
                  <Button 
                    variant="primary" 
                    size="large"
                    className={styles.button}
                    onClick={handleStartExperience}
                  >
                    开始体验
                  </Button>
                ) : (
                  <div className={styles.experienceButtons}>
                    <Button 
                      variant="primary" 
                      size="medium"
                      onClick={handleGetAnotherQuote}
                    >
                      获取箴言
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="medium"
                      onClick={() => {
                        playClickSound()
                        setShowMysticalEffects(!showMysticalEffects)
                      }}
                    >
                      {showMysticalEffects ? '隐藏效果' : '显示效果'}
                    </Button>
                  </div>
                )}
                
                <AnimatePresence>
                  {isExperienceStarted && (
                    <motion.div
                      className={styles.status}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className={styles.statusDot} />
                      <span>体验已激活 - 尝试 NFC 感应</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </FadeIn>
        </div>
      </div>

      {/* NFC 模拟器 */}
      <NFCSimulator 
        isActive={showNFCSimulator}
        onNFCDetected={handleNFCDetected}
      />

      {/* 箴言卡片 */}
      <AnimatePresence>
        {currentQuote && (
          <QuoteCard 
            quote={currentQuote}
            onClose={handleCloseQuote}
          />
        )}
      </AnimatePresence>

      {/* 底部信息 */}
      <FadeIn delay={2.4}>
        <div className={styles.footer}>
          <p>{APP_CONFIG.description}</p>
          <motion.p
            className={styles.demoHint}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ 这是一个交互式演示 ✨
          </motion.p>
        </div>
      </FadeIn>
    </div>
  )
}

export default App