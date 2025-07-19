// src/api/authApi.ts

import axios from 'axios'
import {
  getAccessToken,
  clearTokens,
  getRefreshToken,
  saveTokens,
} from '@/utils/tokenUtils'
import { reissue } from '@/api/auth'
import { store } from '@/store/store'
import { logout } from '@/store/slices/authSlice'

// axios 인스턴스 생성: 인증 관련 요청을 전담
export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ 요청 전 인터셉터: accessToken을 Authorization 헤더에 자동 주입
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

// ✅ 응답 후 인터셉터: accessToken 만료 시 refreshToken으로 재발급 시도

let isRefreshing = false // 현재 refresh 중인지 여부
let failedQueue: (() => void)[] = [] // refresh 중에 발생한 요청들 보관 큐

authApi.interceptors.response.use(
  (response) => response, // 2xx 응답은 그대로 반환

  async (error) => {
    const originalRequest = error.config

    // refresh 토큰 재발급 API 호출 실패 시 -> 재시도 하지 않고 토큰 삭제, 로그아웃, 에러 반환
    if (originalRequest.url?.includes('/auth/reissue')) {
      clearTokens()
      store.dispatch(logout())
      return Promise.reject(error)
    }

    // ❗️accessToken 만료 등으로 401 응답을 받은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // ✅ 이미 refresh 중이면 큐에 요청을 넣고 대기
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedQueue.push(() => {
            resolve(authApi(originalRequest)) // 재발급 완료 후 다시 요청
          })
        })
      }

      // ✅ 첫 재시도 플래그 설정
      originalRequest._retry = true
      isRefreshing = true

      try {
        // 리프레시 토큰 가져오기
        const refreshToken = getRefreshToken()
        if (!refreshToken) throw new Error('Refresh token not found')

        // 새로운 accessToken 발급 요청
        const newAccessToken = await reissue(refreshToken)

        // 새 토큰 저장
        saveTokens(newAccessToken, refreshToken)

        // 큐에 쌓인 요청들 재실행
        failedQueue.forEach((cb) => cb())
        failedQueue = []

        // 현재 요청 다시 실행
        return authApi(originalRequest)
      } catch (refreshError) {
        // ❌ refresh 실패: 로그아웃 처리 및 토큰 삭제
        clearTokens()
        store.dispatch(logout())

        return Promise.reject(refreshError)
      } finally {
        // ✅ refresh 완료: 상태 초기화
        isRefreshing = false
        failedQueue = [] // 여기서 다시 실행하는 로직은 중복이므로 제거하는게 안전
      }
    }

    // ❌ 기타 오류는 그대로 전달
    return Promise.reject(error)
  },
)
