import { useState, useEffect, useRef } from 'react'
import { THEMES_MAP } from '../const'
import { getRandomImageByThemeAndTitle, urlFor } from '../components/unified-screen-sanity/builder'

// src/hooks/useImageManager.ts

export function useImageManager(cycleKey: number) {
  const [imageReady, setImageReady] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<string>('/images/背景图片/default.webp')
  const selectedThemeRef = useRef<string>('')
  const switchedRef = useRef<boolean>(false)
  const currentCycleRef = useRef<number>(0) // ✅ 新增：跟踪当前轮次

  // 当 cycleKey 变化时重新选择主题
  useEffect(() => {
    const themeNames = Object.keys(THEMES_MAP) as (keyof typeof THEMES_MAP)[]
    const randomThemeName = themeNames[Math.floor(Math.random() * themeNames.length)]
    selectedThemeRef.current = randomThemeName
    console.log('🎲 随机选择主题:', randomThemeName)
  }, [cycleKey])

  // 从 Sanity 获取随机背景图片
  useEffect(() => {
    // 重置状态
    setImageReady(false)
    setBackgroundImage('/images/背景图片/default.webp')
    switchedRef.current = false
    currentCycleRef.current = cycleKey // ✅ 记录当前轮次

    let cancelled = false // ✅ 新增：取消标记

    const fetchRandomImage = async () => {
      try {
        const maxImageCount = THEMES_MAP[selectedThemeRef.current as keyof typeof THEMES_MAP]
        const imageNumber = Math.floor(Math.random() * maxImageCount) + 1
        const title = `${selectedThemeRef.current}-${imageNumber}`
        const randomImage = await getRandomImageByThemeAndTitle(selectedThemeRef.current, title)

        if (randomImage && randomImage.image) {
          const imageUrl = urlFor(randomImage.image).format('webp').url()
          console.log('🔗 获取到图片 URL:', randomImage.title, imageUrl)

          // 使用 Image 对象预加载
          const img = new Image()
          img.fetchPriority = 'high'
          img.onload = () => {
            // ✅ 检查是否已被取消
            if (cancelled) {
              console.log('🚫 图片加载已取消（组件已卸载或新一轮已开始）')
              return
            }

            // ✅ 检查是否还是当前轮次
            if (currentCycleRef.current !== cycleKey) {
              console.log('🚫 图片加载已过期（新一轮已开始）')
              return
            }

            console.log('✅ 图片下载完成:', imageUrl)
            if (!switchedRef.current) {
              setBackgroundImage(imageUrl)
              console.log('✅ 设置正式图片')
            } else {
              console.log('⚠️ 已使用兜底图片，忽略正式图片')
            }
            setImageReady(true)
          }

          img.onerror = () => {
            if (cancelled) return // ✅ 检查取消状态
            console.error('❌ 图片下载失败:', imageUrl)
            setImageReady(true)
          }

          img.src = imageUrl
        } else {
          console.warn('⚠️  未找到图片，使用默认图片')
          setImageReady(true)
        }
      } catch (error) {
        console.error('❌ 获取背景图片失败:', error)
        setImageReady(true)
      }
    }

    fetchRandomImage()

    // ✅ Cleanup 函数：取消图片加载
    return () => {
      cancelled = true
      console.log('🧹 清理旧的图片加载')
    }
  }, [cycleKey])

  const markFallbackUsed = () => {
    switchedRef.current = true
  }

  return {
    imageReady,
    backgroundImage,
    markFallbackUsed,
  }
}
