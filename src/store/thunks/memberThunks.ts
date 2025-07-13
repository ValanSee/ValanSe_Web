import { fetchMemberMypage, fetchMemberProfile } from '@/api/member'
import { setProfile, setMypageData } from '../slices/memberSlice'
import { AppDispatch } from '../store'

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
