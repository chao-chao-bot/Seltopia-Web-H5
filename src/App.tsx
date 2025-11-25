import { useEffect, useState } from 'react'
import { useViewportHeight } from '@/hooks/useViewportHeight'

import { useMusic } from '@/hooks/useMusic'
import { APP_CONFIG } from '@/utils/constants'
import styles from './App.module.less'
import { UnifiedScreen } from './components'
import { UnifiedScreenSanity } from './components/unified-screen-sanity'

// 定义屏幕状态
type ScreenState = 'loading' | 'revelation'

function App() {
  useViewportHeight() // 初始化视口高度

  // 屏幕状态管理
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('loading')
  
  // 🔥 循环计数器：每次返回 loading 时递增，用于强制重新生成图片
  const [cycleKey, setCycleKey] = useState(0)

  // 音乐播放管理
  const music = useMusic('/audio/music.mp3')

  useEffect(() => {
    // 设置页面标题
    document.title = APP_CONFIG.name
  }, [music])

  // 初始加载：3秒后从 loading 切换到 revelation
  useEffect(() => {
    if (currentScreen === 'loading') {
      const timer = setTimeout(() => {
        setCurrentScreen('revelation')
      }, 3000) // 3秒后切换

      return () => clearTimeout(timer)
    }
  }, [currentScreen])

  // 处理音乐切换
  const handleMusicToggle = () => {
    music.toggle()
  }

  // 处理返回点击：从 revelation 回到 loading，然后3秒后再次显示 revelation
  const handleBack = () => {
    setCurrentScreen('loading')
    setCycleKey(prev => prev + 1) // 🔥 递增循环计数，触发新图片生成
  }

  return (
    <div className={styles.app}>
      <UnifiedScreenSanity
        key={cycleKey} // 🔥 使用 key 强制组件重新挂载，生成新图片
        mode={currentScreen}
        isMusicPlaying={music.isPlaying}
        onMusicToggle={handleMusicToggle}
        onBack={handleBack}
      />
    </div>
  )
}

export default App