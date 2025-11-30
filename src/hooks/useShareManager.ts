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
  const downloadImage = async (backgroundImage: string) => {
    if (!backgroundImage) {
      console.error('没有背景图片可下载')
      return
    }

    try {
      const response = await fetch(backgroundImage)
      if (!response.ok) {
        throw new Error(`获取图片失败: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Seltopia_Insight_${moment().format('YYYY_MM_DD')}.png`

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      console.log('图片下载成功')
    } catch (error) {
      console.error('下载失败:', error)
    }
  }

  // 分享功能
  const shareContent = async (backgroundImage: string) => {
    const title = 'Seltopia'

    if (navigator.share) {
      try {
        // 优先尝试分享图片（移动端）
        if (backgroundImage && navigator.canShare) {
          const response = await fetch(backgroundImage)
          const blob = await response.blob()
          const file = new File([blob], `seltopia-${Date.now()}.png`, { type: 'image/png' })

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
