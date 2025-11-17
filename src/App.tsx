import { useEffect, useState } from 'react'
import { useViewportHeight } from '@/hooks/useViewportHeight'
import { useSound } from '@/hooks/useSound'
import { useMusic } from '@/hooks/useMusic'
import { getDeviceInfo } from '@/utils/deviceDetection'
import { APP_CONFIG } from '@/utils/constants'
import styles from './App.module.less'
import { LoadingScreen } from './components/loading-screen'
import { RevelationScreen } from './components'

// 定义屏幕状态
type ScreenState = 'loading' | 'revelation'

function App() {
  useViewportHeight() // 初始化视口高度

  // 屏幕状态管理
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('loading')

  const { playChime } = useSound()
  
  // 音乐播放管理
  const music = useMusic('/src/assets/audio/music.mp3')

  useEffect(() => {
    // 初始化设备信息
    const deviceInfo = getDeviceInfo()
    console.log('设备信息:', JSON.stringify(deviceInfo, null, 2))

    // 设置页面标题
    document.title = APP_CONFIG.name

    // 播放欢迎音效
    // setTimeout(() => {
    //   playChime()
    // }, 1000)

    // 自动开始播放音乐（用户交互后）
    const startMusic = () => {
      if (!music.isPlaying && !music.isLoading) {
        music.play()
      }
    }

    // 监听用户首次交互，然后开始播放音乐
    const handleFirstInteraction = () => {
      startMusic()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [playChime, music])

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

  // 处理返回按钮：从 revelation 回到 loading，然后3秒后再次显示 revelation
  const handleBack = () => {
    setCurrentScreen('loading')
  }

  return (
    <div className={styles.app}>
      {currentScreen === 'loading' && (
        <LoadingScreen
          isMusicPlaying={music.isPlaying}
          onMusicToggle={handleMusicToggle}
        />
      )}

      {currentScreen === 'revelation' && (
        <RevelationScreen 
          onBack={handleBack} 
          isMusicPlaying={music.isPlaying}
          onMusicToggle={handleMusicToggle} 
        />
      )}
    </div>
  )
}

export default App