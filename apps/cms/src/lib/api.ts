import axios from 'axios'
import { clearToken, getToken } from './auth'
import { EXPIRED_QUERY } from './authConst'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 화면을 켜 둔 채 토큰이 만료되면 API 가 401(EXPIRED_TOKEN · INVALID_TOKEN)을 준다 → 바로 로그인 화면으로
// 로그인 요청 자체의 401(아이디 · 비밀번호 오류)은 로그인 화면이 처리하므로 제외
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = String(error?.config?.url ?? '').includes(
      '/auth/admin/login',
    )
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !isLoginRequest &&
      typeof window !== 'undefined' &&
      !window.location.pathname.startsWith('/login')
    ) {
      clearToken()
      window.location.replace(`/login?${EXPIRED_QUERY}=1`)
    }
    return Promise.reject(error)
  },
)

export const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

/** 서버 GlobalExceptionHandler 는 { error, message } 형태로 응답한다 */
export function errorMessageOf(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { error?: string; message?: string }
      | undefined
    return data?.error ?? data?.message ?? err.message
  }
  return err instanceof Error ? err.message : fallback
}
