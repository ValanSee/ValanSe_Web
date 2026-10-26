export {}

declare global {
  interface Window {
    AndroidBridge?: {
      closeApp: () => void
    }
    /** react-native-webview 가 주입하는 앱 ↔ 웹 메시지 채널 */
    ReactNativeWebView?: {
      postMessage: (message: string) => void
    }
    /** 앱이 네이티브 공유 시트(Share.share)를 지원하면 true (앱 BRIDGE_SCRIPT 가 주입) */
    __NATIVE_SHARE__?: boolean
  }
}
