// features/auth/authThunks.ts
import { authApi } from '@/api/instance/authApi'
import { publicApi } from '@/api/instance/publicApi'
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '../slices/authSlice'
import { AppDispatch } from '../store'
import { setProfile } from '../slices/authSlice'
import { Profile } from '@/types/_shared/profile'
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
    const res = await authApi.get<Profile>('/member/profile')
    dispatch(setProfile(res.data))
    return res.data
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
