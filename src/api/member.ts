import { authApi } from './instance/authApi'
import { Profile } from '@/types/_shared/profile'

export const createMemberProfile = async (profile: Profile) => {
  try {
    await authApi.post('/member/profile', profile)
  } catch (error) {
    throw error
  }
}

type fetchMemberProfileResponse = Profile

export const fetchMemberProfile = async () => {
  try {
    const response =
      await authApi.get<fetchMemberProfileResponse>('/member/profile')
    return response.data
  } catch (error) {
    throw error
  }
}

type fetchMemberMypageResponse = {
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
