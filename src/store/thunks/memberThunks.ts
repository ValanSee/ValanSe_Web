import { fetchMemberProfile } from '@/api/member'
import { setProfile } from '../slices/memberSlice'
import { AppDispatch } from '../store'

export const fetchProfileThunk = () => async (dispatch: AppDispatch) => {
  try {
    const res = await fetchMemberProfile()
    dispatch(setProfile(res))
    return res
  } catch (err) {
    throw err
  }
}
