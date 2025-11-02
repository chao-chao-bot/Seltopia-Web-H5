export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
}

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent)
}

export const isMobile = (): boolean => {
  return /Mobi|Android/i.test(navigator.userAgent)
}

export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement)
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top')) || 0,
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom')) || 0,
    left: parseInt(style.getPropertyValue('--safe-area-inset-left')) || 0,
    right: parseInt(style.getPropertyValue('--safe-area-inset-right')) || 0
  }
}

export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isMobile: isMobile(),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight
  }
}
