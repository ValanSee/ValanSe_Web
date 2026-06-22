import { TOKEN_COOKIE_KEY } from './authConst'

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export function setToken(token: string) {
  if (typeof document === 'undefined') return
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`
}

export function getToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${TOKEN_COOKIE_KEY}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : null
}

export function clearToken() {
  if (typeof document === 'undefined') return
  document.cookie = `${TOKEN_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function extractToken(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const obj = data as Record<string, unknown>
  const keys = ['accessToken', 'access_token', 'token', 'jwt', 'authToken']
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v.length > 0) return v
  }
  if (obj.data) return extractToken(obj.data)
  return null
}
