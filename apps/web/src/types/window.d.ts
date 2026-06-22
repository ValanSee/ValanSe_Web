export {}

declare global {
  interface Window {
    AndroidBridge?: {
      closeApp: () => void
    }
  }
}
