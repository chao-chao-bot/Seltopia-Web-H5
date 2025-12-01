import { WEBSITE_URL } from '../const'
import moment from 'moment'

export function useShareManager(showGlobalToast: (message: string) => void) {
  // 复制链接到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(WEBSITE_URL)
      showGlobalToast(`Link copied. Ready for your Story.`)
      return true
    } catch (err) {
      console.error('❌ 复制失败:', err)
      // 回退方案：使用旧的 execCommand 方法
      try {
        const textArea = document.createElement('textarea')
        textArea.value = WEBSITE_URL
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        showGlobalToast(`已复制 ${WEBSITE_URL}`)
        return true
      } catch (fallbackErr) {
        console.error('❌ 回退复制方案也失败:', fallbackErr)
        showGlobalToast('复制失败，请手动复制')
        return false
      }
    }
  }

  // 下载图片
  const downloadImage = async (_backgroundImage: string) => {
    // 🧪 测试：使用本地图片而不是背景图片
    const testImageUrl = '/images/download.png'

    console.log('⏱️ 开始下载测试图片:', testImageUrl)
    const startTime = performance.now()

    try {
      const response = await fetch(testImageUrl)
      if (!response.ok) {
        throw new Error(`获取图片失败: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Seltopia_Test_${moment().format('YYYY_MM_DD')}.png`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      const totalTime = performance.now() - startTime
      alert(`✅ 图片下载成功，总耗时: ${totalTime.toFixed(2)}ms`)
    } catch (error) {
      const totalTime = performance.now() - startTime
      console.error(`❌ 下载失败 (耗时 ${totalTime.toFixed(2)}ms):`, error)
    }
  }

  // 分享功能
  const shareContent = async (backgroundImage: string) => {
    const title =
      'A Moment of Insight from Seltopia: I just received a piece of wisdom from my Seltopia. Discover your inner utopia.'

    if (navigator.share) {
      try {
        // 优先尝试分享图片（移动端）
        if (backgroundImage && navigator.canShare) {
          const response = await fetch(backgroundImage)
          const blob = await response.blob()
          const file = new File([blob], `Seltopia_Insight_${moment().format('YYYY_MM_DD')}.png`, {
            type: 'image/png',
          })

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title,
              files: [file],
            })
            console.log('✅ 图片分享成功')
            return
          }
        }

        // 回退：只分享链接
        await navigator.share({
          title,
          text: WEBSITE_URL,
          url: WEBSITE_URL,
        })
        console.log('✅ 链接分享成功')
        return
      } catch (err) {
        console.log('分享取消或失败', err)
      }
    }

    // 最终回退：直接打开 Facebook 分享对话框
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(WEBSITE_URL)}`,
      '_blank'
    )
  }

  return {
    copyToClipboard,
    downloadImage,
    shareContent,
  }
}
