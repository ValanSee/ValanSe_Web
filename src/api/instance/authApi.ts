// src/api/authApi.ts
import axios from 'axios'
import { getAccessToken, clearTokens } from '@/utils/tokenUtils'

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
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // TODO: refresh 로직이 여기에 추가
      // try {
      //   const newAccessToken = await refreshAccessToken();
      //   setAccessToken(newAccessToken);
      //   error.config.headers.Authorization = `Bearer ${newAccessToken}`;
      //   return axios(error.config); // 요청 재시도
      // } catch (refreshError) {
      //   clearTokens();
      //   window.location.href = '/entry'; // or dispatch(logout())
      // }

      clearTokens()
      window.location.href = '/entry' // 인증 만료 시 로그인 페이지로
    }
    return Promise.reject(error)
  },
)
