// 비동기 로그인 로직 추가 필요
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Profile = {
  nickname: string
  gender: string
  age: string
  mbtiIe: string
  mbtiTf: string
  mbti: string
} | null

interface AuthState {
  isLogined: boolean
  accessToken: string | null
  refreshToken: string | null
  user: {
    id: string
    profile: Profile
  } | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isLogined: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    loginStart(state) {
      state.loading = true
      state.error = null
    },
    loginSuccess(
      state,
      action: PayloadAction<{
        accessToken: string
        refreshToken: string
        userId: string
      }>,
    ) {
      state.loading = false
      state.isLogined = true
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.user = {
        id: action.payload.userId,
        profile: null,
      }
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    logout(state) {
      state.isLogined = false
      state.accessToken = null
      state.refreshToken = null
      state.user = null
    },
  },
})
export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions
export default authSlice.reducer
