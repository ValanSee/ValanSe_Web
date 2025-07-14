// features/auth/authThunks.ts
import { publicApi } from '@/api/instance/publicApi'
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '../slices/authSlice'
import { AppDispatch } from '../store'
import { getRefreshToken } from '@/utils/tokenUtils'
import { saveTokens, clearTokens } from '@/utils/tokenUtils'
import { reissue } from '@/api/auth'

export const loginThunk = (code: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loginStart())
    const res = await publicApi.post(`/auth/kakao/login`, { code })
    dispatch(loginSuccess({ userId: res.data.userId }))
    saveTokens(res.data.accessToken, res.data.refreshToken)
  } catch (err: unknown) {
    if (err instanceof Error) {
      dispatch(loginFailure(err.message))
    } else {
      dispatch(loginFailure('Unknown error'))
    }
    throw err
  }
}

export const reissueThunk = () => async (dispatch: AppDispatch) => {
  try {
    const refreshToken = getRefreshToken()
    const res = await reissue(refreshToken!)
    saveTokens(res, refreshToken!)
    return res
  } catch (err) {
    clearTokens()
    dispatch(logout())
    throw err
  }
}
