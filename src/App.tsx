import { useEffect, useState } from 'react'
import { useViewportHeight } from '@/hooks/useViewportHeight'
import { useSound } from '@/hooks/useSound'
import { getDeviceInfo } from '@/utils/deviceDetection'
import { APP_CONFIG } from '@/utils/constants'
import styles from './App.module.less'
import { LoadingScreen } from './components/loading-screen'

function App() {
  useViewportHeight() // 初始化视口高度


  const { playChime } = useSound()

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
      {/* <StarryBackground /> */}

      <LoadingScreen
        isMusicPlaying={true}
        onMusicToggle={() => { }}
      />
    </div>
  )
}

export default App