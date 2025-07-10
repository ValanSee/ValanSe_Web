import { authApi } from './instance/authApi'
import { Profile } from '@/types/_shared/profile'

export const createMemberProfile = async (profile: Profile) => {
  try {
    await authApi.post('/member/profile', profile)
  } catch (error) {
    throw error
  }
}

export const fetchMemberProfile = async () => {
  try {
    const response = await authApi.get('/member/profile')
    return response.data
  } catch (error) {
    throw error
  }
}
