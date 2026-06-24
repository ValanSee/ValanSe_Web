import { authApi } from '../instance/authApi'
import {
  CreateMemberProfileRequest,
  FetchMemberProfileResponse,
  UpdateMemberProfileRequest,
} from './types'

export const createMemberProfile = async (
  profile: CreateMemberProfileRequest,
) => {
  try {
    await authApi.post('/member/profile', profile)
  } catch (error) {
    throw error
  }
}

export const fetchMemberProfile = async (): Promise<
  FetchMemberProfileResponse['profile']
> => {
  try {
    const response =
      await authApi.get<FetchMemberProfileResponse>('/member/profile')
    return response.data.profile
  } catch (error) {
    throw error
  }
}

export const updateMemberProfile = async (
  profile: UpdateMemberProfileRequest,
) => {
  try {
    await authApi.post('/member/profile', profile)
  } catch (error) {
    throw error
  }
}

// TODO : 마이페이지 타입 정리
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

// TODO : 닉네임 체크 응답 타입 정리
export const checkNickname = async (nickname: string) => {
  try {
    const response = await authApi.get<checkNicknameResponse>(
      '/member/check-nickname',
      {
        params: { nickname },
      },
    )
    return response.data
  } catch (error) {
    throw error
  }
}

interface checkNicknameResponse {
  isMeaningful: boolean
  isAvailable: boolean
  isClean: boolean
}
