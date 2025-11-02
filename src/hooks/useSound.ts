import { useCallback, useRef } from 'react'

interface SoundOptions {
  volume?: number
  loop?: boolean
}

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null)

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playTone = useCallback((frequency: number, duration: number, options: SoundOptions = {}) => {
    const { volume = 0.1 } = options
    
    try {
      const audioContext = initAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.warn('音效播放失败:', error)
    }
  }, [initAudioContext])

  const playChime = useCallback(() => {
    // 播放和谐的钟声效果
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5
    notes.forEach((note, index) => {
      setTimeout(() => {
        playTone(note, 0.8, { volume: 0.08 })
      }, index * 200)
    })
  }, [playTone])

  const playMysticalSound = useCallback(() => {
    // 播放神秘的音效
    const frequencies = [220, 330, 440, 550]
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        playTone(freq, 0.3, { volume: 0.05 })
      }, index * 100)
    })
  }, [playTone])

  const playSuccessSound = useCallback(() => {
    // 播放成功音效
    playTone(523.25, 0.2, { volume: 0.1 }) // C5
    setTimeout(() => playTone(659.25, 0.2, { volume: 0.1 }), 100) // E5
    setTimeout(() => playTone(783.99, 0.4, { volume: 0.1 }), 200) // G5
  }, [playTone])

  const playClickSound = useCallback(() => {
    // 播放点击音效
    playTone(800, 0.1, { volume: 0.05 })
  }, [playTone])

  // 触觉反馈
  const vibrate = useCallback((pattern: number | number[] = 100) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  return {
    playTone,
    playChime,
    playMysticalSound,
    playSuccessSound,
    playClickSound,
    vibrate
  }
}
