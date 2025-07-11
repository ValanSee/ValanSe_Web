import { fetchMemberProfile } from '@/api/member'
import { setProfile } from '../slices/memberSlice'
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
