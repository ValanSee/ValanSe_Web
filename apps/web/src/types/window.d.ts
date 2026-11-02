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
    /** 앱 플랫폼 (iOS 앱 출시 버전부터 BRIDGE_SCRIPT 가 주입) */
    __APP_PLATFORM__?: 'ios' | 'android'
    /** iOS 앱이 네이티브 Apple 로그인 창을 지원하면 true (utils/appleLogin.ts) */
    __NATIVE_APPLE_LOGIN__?: boolean
    /** Apple JS (appleid.auth.js) — 웹 Apple 로그인 팝업 */
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string
          scope: string
          redirectURI: string
          state?: string
          usePopup: boolean
        }) => void
        signIn: () => Promise<{
          authorization: { code: string; id_token: string; state?: string }
          user?: { name?: { firstName?: string; lastName?: string } }
        }>
      }
    }
    /** GA4 gtag.js (운영 도메인에서만 존재, lib/analytics.ts) */
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}
