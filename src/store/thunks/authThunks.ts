// features/auth/authThunks.ts
import { publicApi } from '@/api/instance/publicApi'
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '../slices/authSlice'
import { AppDispatch } from '../store'
import { setProfile } from '../slices/authSlice'
import { fetchMemberProfile } from '@/api/member'
import { getRefreshToken } from '@/utils/tokenUtils'
import { saveTokens, clearTokens } from '@/utils/tokenUtils'

export const loginThunk = (code: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loginStart())
    const res = await publicApi.post(`/auth/kakao/login`, { code })
    dispatch(
      loginSuccess({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        userId: res.data.userId,
      }),
    )
  } catch (err: unknown) {
    if (err instanceof Error) {
      dispatch(loginFailure(err.message))
    } else {
      dispatch(loginFailure('Unknown error'))
    }
    throw err
  }
}

export const fetchProfileThunk = () => async (dispatch: AppDispatch) => {
  try {
    const res = await fetchMemberProfile()
    dispatch(setProfile(res))
    return res
  } catch (err) {
    throw err
  }
}

export const reissueTokenThunk = () => async (dispatch: AppDispatch) => {
  try {
    const refreshToken = getRefreshToken()
    const res = await publicApi.post('/auth/reissue', { refreshToken })
    saveTokens(res.data.accessToken, res.data.refreshToken)
    dispatch(
      loginSuccess({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        userId: res.data.userId,
      }),
    )
    return res.data
  } catch (err) {
    clearTokens()
    dispatch(logout())
    throw err
  }
}
