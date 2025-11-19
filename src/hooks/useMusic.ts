import { useCallback, useRef, useEffect, useState, useMemo } from 'react'

interface UseMusicReturn {
  isPlaying: boolean
  play: () => void
  pause: () => void
  toggle: () => void
}

export const useMusic = (audioSrc: string): UseMusicReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // 初始化音频对象
  useEffect(() => {
    const audio = new Audio(audioSrc)
    audio.loop = true // 单曲循环
    audio.volume = 0.5 // 默认音量
    audio.preload = 'auto'
    audio.autoplay = true

    audioRef.current = audio

    // 只监听必要的播放状态事件
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.pause()
      audio.src = ''
    }
  }, [audioSrc])

  // 播放音乐
  const play = useCallback(async () => {
    if (!audioRef.current) return

    try {
      await audioRef.current.play()
    } catch (error) {
      console.error('播放失败:', error)
    }
  }, [audioRef.current])

  // 暂停音乐
  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
  }, [audioRef.current])

  // 切换播放状态
  const toggle = useCallback(async () => {
    if (isPlaying) {
      pause()
    } else {
      await play()
    }
  }, [isPlaying, play, pause])

  return useMemo(
    () => ({
      isPlaying,
      play,
      pause,
      toggle,
    }),
    [isPlaying, play, pause, toggle]
  )
}
