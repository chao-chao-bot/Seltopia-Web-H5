import { useEffect, useState } from 'react'

export const useViewportHeight = () => {
  const [vh, setVh] = useState(window.innerHeight * 0.01)

  useEffect(() => {
    const updateVh = () => {
      const newVh = window.innerHeight * 0.01
      setVh(newVh)
      document.documentElement.style.setProperty('--vh', `${newVh}px`)
    }

    updateVh()
    window.addEventListener('resize', updateVh)
    window.addEventListener('orientationchange', updateVh)

    return () => {
      window.removeEventListener('resize', updateVh)
      window.removeEventListener('orientationchange', updateVh)
    }
  }, [])

  return vh
}
