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
    /** 앱 BRIDGE_SCRIPT 가 모든 버전에서 심는 플래그 (우리 앱 WebView 판별용) */
    __ANDROID_BRIDGE_READY__?: boolean
    /** 앱 versionCode (앱 v23 부터 BRIDGE_SCRIPT 가 주입) */
    __APP_VERSION__?: number
    /** GA4 gtag.js (운영 도메인에서만 존재, lib/analytics.ts) */
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}
