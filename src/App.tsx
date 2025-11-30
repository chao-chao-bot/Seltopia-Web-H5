import { useEffect } from 'react'
import { useViewportHeight } from '@/hooks/useViewportHeight'

import { useMusic } from '@/hooks/useMusic'
import { APP_CONFIG } from '@/utils/constants'
import styles from './App.module.less'
import UnifiedScreenSanity from './components/unified-screen-sanity'


function App() {
  useViewportHeight() // 初始化视口高度

  // 音乐播放管理
  const music = useMusic('/audio/music.mp3')

  useEffect(() => {
    // 设置页面标题
    document.title = APP_CONFIG.name
  }, [music])

  // 处理音乐切换
  const handleMusicToggle = () => {
    music.toggle()
  }

  return (
    <div className={styles.app}>
      <UnifiedScreenSanity
        isMusicPlaying={music.isPlaying}
        onMusicToggle={handleMusicToggle}
      />
    </div>
  )
}

export default App