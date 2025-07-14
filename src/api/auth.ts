import { authApi } from './instance/authApi'

export const reissue = async (refreshToken: string) => {
  try {
    const response = await authApi.post<string>('/auth/reissue', {
      refreshToken,
    })
    return response.data
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
