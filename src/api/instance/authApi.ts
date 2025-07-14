// src/api/authApi.ts
import axios from 'axios'
import {
  getAccessToken,
  clearTokens,
  getRefreshToken,
} from '@/utils/tokenUtils'
import { reissue } from '@/api/auth'
import { saveTokens } from '@/utils/tokenUtils'
import { store } from '@/store/store'
import { logout } from '@/store/slices/authSlice'

// TODO: 리프레시 API
// import { refreshAccessToken } from './authApiService';  <-- 필요 시

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 전: accessToken 자동 헤더 주입
authApi.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 응답 후: 401 처리 (선택 사항)

let isRefreshing = false
let failedQueue: (() => void)[] = []

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push(() => {
            resolve(authApi(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = getRefreshToken()
        if (!refreshToken) throw new Error('Refresh token not found')

        const newAccessToken = await reissue(refreshToken)
        saveTokens(newAccessToken, refreshToken)

        failedQueue.forEach((cb) => cb())
        failedQueue = []

        return authApi(originalRequest)
      } catch (refreshError) {
        clearTokens()
        store.dispatch(logout())
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
        failedQueue.forEach((fn) => fn())
        failedQueue = []
      }
    }

    return Promise.reject(error)
  },
)
