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
