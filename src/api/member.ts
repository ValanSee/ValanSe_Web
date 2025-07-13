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
    const response = await authApi.get<{ profile: Profile }>('/member/profile')
    return response.data.profile
  } catch (error) {
    throw error
  }
}

export type fetchMemberMypageResponse = {
  profile: {
    profile_image_url: string
    kakaoname: string
    email: string
    nickname: string
    gender: string
    age: string
    mbti: string
  } | null
}

export const fetchMemberMypage = async () => {
  try {
    const response =
      await authApi.get<fetchMemberMypageResponse>('/member/mypage')
    return response.data.profile
  } catch (error) {
    throw error
  }
}
