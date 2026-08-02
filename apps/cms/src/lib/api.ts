import axios from 'axios'
import { getToken } from './auth'

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
