import { useState, useEffect, useRef } from 'react'

type ScreenMode = 'loading' | 'revelation'

export function useModeSwitcher(imageReady: boolean, markFallbackUsed: () => void) {
  const [mode, setMode] = useState<ScreenMode>('loading')
  const switchedRef = useRef<boolean>(false)

  // 🎯 动态梯度切换逻辑：3s-4s-5s
  useEffect(() => {
    if (mode === 'loading' && !switchedRef.current) {
      // 3秒：如果图片已准备好，立即切换
      const timer3s = setTimeout(() => {
        if (imageReady && !switchedRef.current) {
          console.log('⚡ 3秒检查：图片已准备好，立即切换')
          setMode('revelation')
          switchedRef.current = true
        }
      }, 3000)

      // 4秒：如果图片已准备好，切换
      const timer4s = setTimeout(() => {
        if (imageReady && !switchedRef.current) {
          console.log('⚡ 4秒检查：图片已准备好，切换')
          setMode('revelation')
          switchedRef.current = true
        }
      }, 4000)

      // 5秒：强制切换（使用兜底图片）
      const timer5s = setTimeout(() => {
        if (!switchedRef.current) {
          console.log('⏰ 5秒超时：强制切换（使用兜底图片）')
          setMode('revelation')
          switchedRef.current = true
          markFallbackUsed() // 标记使用了兜底图片
        }
      }, 5000)

      return () => {
        clearTimeout(timer3s)
        clearTimeout(timer4s)
        clearTimeout(timer5s)
      }
    }
  }, [mode, imageReady, markFallbackUsed])

  const resetToLoading = () => {
    setMode('loading')
    switchedRef.current = false
  }

  return {
    mode,
    resetToLoading,
  }
}
