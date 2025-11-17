import { useCallback, useRef, useEffect, useState } from 'react'

interface UseMusicReturn {
  isPlaying: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  volume: number
  setVolume: (volume: number) => void
  duration: number
  currentTime: number
  isLoading: boolean
  error: string | null
}

export const useMusic = (audioSrc: string): UseMusicReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.5)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 初始化音频对象
  useEffect(() => {
    const audio = new Audio(audioSrc)
    audio.loop = true
    audio.volume = volume
    audio.preload = 'auto'
    
    audioRef.current = audio

    // 音频事件监听
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => {
      setIsLoading(false)
      setError(null)
    }
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)
    const handleError = (e: Event) => {
      setError('音频加载失败')
      setIsLoading(false)
      console.error('音频播放错误:', e)
    }

    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      
      audio.pause()
      audio.src = ''
    }
  }, [audioSrc, volume])

  // 播放音乐
  const play = useCallback(async () => {
    if (!audioRef.current || isLoading) return

    try {
      await audioRef.current.play()
    } catch (error) {
      console.error('播放失败:', error)
      setError('播放失败，请检查音频文件')
    }
  }, [isLoading])

  // 暂停音乐
  const pause = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.pause()
  }, [])

  // 切换播放状态
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  // 设置音量
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
  }, [])

  return {
    isPlaying,
    play,
    pause,
    toggle,
    volume,
    setVolume,
    duration,
    currentTime,
    isLoading,
    error
  }
}
