/**
 * 이 버전(Android versionCode)보다 낮은 앱에는 업데이트 권장 모달을 띄운다. 0 이면 끔
 * 구버전 대응이 어려운 변경을 배포할 때 스토어에 출시된 최신 versionCode 로 올린다
 * (스토어에 아직 없는 버전으로 올리면 업데이트할 버전이 없는데 모달이 뜨므로 주의)
 */
export const MIN_SUPPORTED_APP_VERSION = 23

/** Play 스토어 앱 상세. 앱 WebView 는 http(s) 외 스킴을 OS 로 넘겨 스토어 앱이 열린다 */
export const APP_STORE_URL = 'market://details?id=com.valanse'

/** 앱 v23 부터 BRIDGE_SCRIPT 가 __APP_VERSION__ 을 심는다. 그 전 버전은 값이 없어 0 으로 본다 */
export function getAppVersion(): number {
  const version = window.__APP_VERSION__
  return typeof version === 'number' ? version : 0
}
