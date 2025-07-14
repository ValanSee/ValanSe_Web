import {
  fetchMemberMypage,
  fetchMemberProfile,
  updateMemberProfile,
} from '@/api/member'
import {
  setProfile,
  setMypageData,
  updateMypageData,
} from '../slices/memberSlice'
import { AppDispatch } from '../store'
import { Profile } from '@/types/_shared/profile'

// 프로필을 가져오고 store에 저장
export const fetchProfileThunk = () => async (dispatch: AppDispatch) => {
  try {
    const profile = await fetchMemberProfile()
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
      await updateMemberProfile(profile)
      dispatch(updateMypageData(profile))
      return profile
    } catch (err) {
      throw err
    }
  }
