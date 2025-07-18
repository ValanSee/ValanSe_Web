// features/auth/authThunks.ts
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
import { logout as logoutApi } from '@/api/auth'
import { login } from '@/api/auth'

export const loginThunk = (code: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loginStart())
    const res = await login(code)
    saveTokens(res.accessToken, res.refreshToken) // localstorage 에 토큰 저장
    dispatch(loginSuccess({ userId: res.id }))
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
    const currentRefreshToken = getRefreshToken() // localstorage 에서 현재 refreshToken 가져오기
    if (!currentRefreshToken) {
      throw new Error('Refresh token not found')
    }
    const res = await reissue(currentRefreshToken)
    saveTokens(res, currentRefreshToken)
    return res
  } catch (err: unknown) {
    clearTokens()
    dispatch(logout())
    throw err
  }
}

export const logoutThunk = () => async (dispatch: AppDispatch) => {
  try {
    await logoutApi()
    dispatch(logout())
    clearTokens()
  } catch (err) {
    throw err
  }
}
