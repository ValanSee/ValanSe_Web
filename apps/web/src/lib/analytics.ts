/**
 * GA4 (웹 스트림 "valanse web"). 앱은 WebView 라 같은 태그로 수집되고 platform 으로 구분한다.
 * 태그 로드는 app/layout.tsx GA_INIT_SCRIPT — 운영 도메인(valanse.kr)에서만 window.gtag 가 생긴다.
 */
export const GA_MEASUREMENT_ID = 'G-40G3Q6FDX7'

/** GA4 추천 이벤트 이름(share · login · sign_up)은 그대로, 나머지는 서비스 전용 */
export type AnalyticsEventName =
  | 'share'
  | 'vote'
  | 'login'
  | 'sign_up'
  | 'onboarding_complete'
  | 'comment'
  | 'create_vote'

type AnalyticsParams = Record<string, string | number | boolean | undefined>

export const isAppWebView = () =>
  typeof window !== 'undefined' &&
  Boolean(window.ReactNativeWebView || window.__ANDROID_BRIDGE_READY__)

export const trackEvent = (
  name: AnalyticsEventName,
  params: AnalyticsParams = {},
) => {
  if (typeof window === 'undefined' || !window.gtag) return
  try {
    window.gtag('event', name, {
      ...params,
      platform: isAppWebView() ? 'app' : 'web',
    })
  } catch {
    // 측정 실패가 사용자 동작을 막지 않도록 무시
  }
}

/** 공유 링크에 붙이는 UTM — 되돌아온 방문을 GA 세션 소스(share / 공유 방식)로 집계 */
export const withShareUtm = (url: string, medium: string) => {
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', 'share')
    u.searchParams.set('utm_medium', medium)
    return u.toString()
  } catch {
    return url
  }
}
