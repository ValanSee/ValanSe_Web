import { fetchMemberProfile } from '@/api/member'
import { setProfile } from '../slices/memberSlice'
import { AppDispatch } from '../store'

// 프로필을 가져오고 store에 저장
export const fetchProfileThunk = () => async (dispatch: AppDispatch) => {
  try {
    const res = await fetchMemberProfile()
    dispatch(setProfile(res))
    return res
  } catch (err) {
    throw err
  }
}
