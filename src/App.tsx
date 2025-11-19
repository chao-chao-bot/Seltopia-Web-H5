import { useEffect, useState } from 'react'
import { useViewportHeight } from '@/hooks/useViewportHeight'

import { useMusic } from '@/hooks/useMusic'
import { APP_CONFIG } from '@/utils/constants'
import styles from './App.module.less'
import { UnifiedScreen } from './components'

// 定义屏幕状态
type ScreenState = 'loading' | 'revelation'

function App() {
  useViewportHeight() // 初始化视口高度

  // 屏幕状态管理
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('loading')

  // 音乐播放管理
  const music = useMusic('/src/assets/audio/music.mp3')

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
  }

  return (
    <div className={styles.app}>
      <UnifiedScreen
        mode={currentScreen}
        isMusicPlaying={music.isPlaying}
        onMusicToggle={handleMusicToggle}
        onBack={handleBack}
      />
    </div>
  )
}

export default App