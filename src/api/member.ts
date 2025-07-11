import { authApi } from './instance/authApi'
import { Gender, Age, mbtiIe, mbtiTf, MBTI } from '@/types/_shared/profile'

export type createMemberProfileRequest = {
  nickname: string
  gender: Gender
  age: Age
  mbtiIe: mbtiIe
  mbtiTf: mbtiTf
  mbti: MBTI
}

export const createMemberProfile = async (
  profile: createMemberProfileRequest,
) => {
  try {
    await authApi.post('/member/profile', profile)
  } catch (error) {
    throw error
  }
}

export type fetchMemberProfileResponse = createMemberProfileRequest

export const fetchMemberProfile = async () => {
  try {
    const response =
      await authApi.get<fetchMemberProfileResponse>('/member/profile')
    return response.data
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
