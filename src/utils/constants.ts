// 应用常量
export const APP_CONFIG = {
  name: 'Seltopia - The Book of Answers',
  version: '1.0.0',
  description: 'A mystical H5 experience with NFC integration'
}

// 动画配置
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.8
  },
  easing: {
    ease: [0.25, 0.46, 0.45, 0.94],
    spring: { type: 'spring', stiffness: 300, damping: 30 }
  }
}

// 设备检测
export const DEVICE_CONFIG = {
  mobile: {
    maxWidth: 768
  },
  tablet: {
    minWidth: 769,
    maxWidth: 1024
  },
  desktop: {
    minWidth: 1025
  }
}
