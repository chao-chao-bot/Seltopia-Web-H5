import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeIn } from '@/components/animations/FadeIn'

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
import { StarryBackground } from './components/starry-background'

function App() {
  useViewportHeight() // 初始化视口高度
  
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [showNFCSimulator, setShowNFCSimulator] = useState(false)
  const [isExperienceStarted, setIsExperienceStarted] = useState(false)
  const [showMysticalEffects, setShowMysticalEffects] = useState(false)
  
  const { playChime} = useSound()

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

  return (
    <div className={styles.app}>
      {/*背景 */}
      <StarryBackground />

      
      {/* 神秘效果 */}
      <AnimatePresence>
        
      </AnimatePresence>
      
   
    </div>
  )
}

export default App