import {
  fetchMemberMypage,
  fetchMemberProfile,
  updateMemberProfile,
} from '@/api/member/member'
import { setProfile, setMypageData } from '../slices/memberSlice'
import { AppDispatch } from '../store'
import { Profile } from '@/types/member'

// 프로필을 가져오고 store에 저장
export const fetchProfileThunk = () => async (dispatch: AppDispatch) => {
  let profile: Profile | null = null

  try {
    profile = await fetchMemberProfile()
    dispatch(setProfile(profile))
    return profile
  } catch (err) {
    throw err
  }
}

// 마이페이지 데이터 가져오고 store에 저장
export const fetchMypageDataThunk = () => async (dispatch: AppDispatch) => {
  try {
    const mypageData = await fetchMemberMypage()
    if (mypageData) {
      dispatch(setMypageData(mypageData))
    }
    return mypageData
  } catch (err) {
    throw err
  }
}

export const updateProfileThunk =
  (profile: Profile) => async (dispatch: AppDispatch) => {
    try {
      await updateMemberProfile(profile) // 프로필 업데이트
      const updatedProfile = await fetchMemberProfile() // 업데이트 된 프로필 가져오기
      dispatch(setProfile(updatedProfile)) // store에 저장

      const updatedMypageData = await fetchMemberMypage() // 업데이트 된 마이페이지 데이터 가져오기
      if (updatedMypageData) {
        dispatch(setMypageData(updatedMypageData)) // store에 저장
      } else {
        throw new Error('마이페이지 데이터 가져오기 실패')
      }

      return updatedProfile
    } catch (err) {
      throw err
    }
  }
