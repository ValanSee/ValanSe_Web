// features/auth/authThunks.ts
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from '../slices/authSlice'
import { resetMember } from '../slices/memberSlice'
import { AppDispatch } from '../store'
import { getRefreshToken } from '@/utils/tokenUtils'
import { saveTokens, clearTokens } from '@/utils/tokenUtils'
import { reissue } from '@/api/auth'
import { logout as logoutApi, signout as signoutApi } from '@/api/auth'
import { appleLogin, login } from '@/api/auth'
import { AppleLoginRequest, LoginResponse } from '@/types/api/auth'

/** 소셜 로그인 공통: 서버 로그인 응답의 토큰을 저장하고 로그인 상태로 만든다 */
const socialLoginThunk =
  (request: () => Promise<LoginResponse>) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart())
      const res = await request()
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

export const loginThunk = (code: string, redirectUri: string) =>
  socialLoginThunk(() => login(code, redirectUri))

export const appleLoginThunk = (request: AppleLoginRequest) =>
  socialLoginThunk(() => appleLogin(request))

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
  } catch {
    // 로그아웃 API 실패해도 로컬 상태는 정리
  } finally {
    dispatch(logout())
    dispatch(resetMember())
    clearTokens()
  }
}

export const signoutThunk = () => async (dispatch: AppDispatch) => {
  try {
    await signoutApi()
  } catch {
    // 탈퇴 API 실패해도 로컬 상태는 정리
  } finally {
    dispatch(logout())
    dispatch(resetMember())
    clearTokens()
  }
}
