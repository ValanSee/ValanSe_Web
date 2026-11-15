/**
 * 이 버전(Android versionCode)보다 낮은 앱에는 업데이트 권장 모달을 띄운다. 0 이면 끔
 * 구버전 대응이 어려운 변경을 배포할 때 스토어에 출시된 최신 versionCode 로 올린다
 * (스토어에 아직 없는 버전으로 올리면 업데이트할 버전이 없는데 모달이 뜨므로 주의)
 */
export const MIN_SUPPORTED_APP_VERSION = 23

/** 스토어 앱 상세. 앱 WebView 는 http(s) 외 스킴을 OS 로 넘겨 스토어 앱이 열린다 */
export const PLAY_STORE_URL = 'market://details?id=com.valanse'
/** App Store Connect 앱 Apple ID 6829772789 */
export const IOS_APP_STORE_URL = 'itms-apps://apps.apple.com/app/id6829772789'

/** 앱이 알려준 플랫폼의 스토어. iOS 앱 이전 버전(Android 만 존재)은 값이 없어 Play 로 본다 */
export function getAppStoreUrl(): string {
  return window.__APP_PLATFORM__ === 'ios' ? IOS_APP_STORE_URL : PLAY_STORE_URL
}

/** 앱 v23 부터 BRIDGE_SCRIPT 가 __APP_VERSION__ 을 심는다. 그 전 버전은 값이 없어 0 으로 본다 */
export function getAppVersion(): number {
  const version = window.__APP_VERSION__
  return typeof version === 'number' ? version : 0
}
