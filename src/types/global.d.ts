// 全局类型定义

export interface Quote {
  id: string
  text: string
  author?: string
  category?: string
}

export interface NFCData {
  id: string
  url: string
  timestamp: number
}

export interface DeviceInfo {
  userAgent: string
  platform: string
  language: string
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  screenWidth: number
  screenHeight: number
  viewportWidth: number
  viewportHeight: number
}

export interface AppState {
  isLoading: boolean
  currentQuote: Quote | null
  nfcDetected: boolean
  deviceInfo: DeviceInfo | null
}
