// api instance
import { authApi } from './instance/authApi'
import { publicApi } from './instance/publicApi'
// types
import { LoginResponse, ReissueResponse } from '@/types/poll/api/auth'

export const login = async (code: string) => {
  try {
    const response = await publicApi.post<LoginResponse>('/auth/kakao/login', {
      code,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const reissue = async (refreshToken: string) => {
  try {
    const response = await authApi.post<ReissueResponse>('/auth/reissue', {
      refreshToken,
    })
    return response.data.accessToken
  } catch (error) {
    throw error
  }
}

export const logout = async () => {
  try {
    await authApi.post('/auth/logout')
  } catch (error) {
    throw error
  }
}
