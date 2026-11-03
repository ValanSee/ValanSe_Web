export const TOKEN_COOKIE_KEY = 'cms_token'

/** 로그인 만료로 튕겼을 때 로그인 화면에 안내를 띄우는 쿼리 */
export const EXPIRED_QUERY = 'expired'

/** JWT payload 의 exp(초)가 지났으면 true. 형식이 이상하면 서버 판단에 맡기고 false */
export function isTokenExpired(token: string, skewSeconds = 10): boolean {
  try {
    const part = token.split('.')[1]
    if (!part) return false
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'))
    const { exp } = JSON.parse(json) as { exp?: number }
    return (
      typeof exp === 'number' && exp * 1000 <= Date.now() + skewSeconds * 1000
    )
  } catch {
    return false
  }
}
