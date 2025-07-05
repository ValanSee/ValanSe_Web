// 비동기 로그인 로직 추가 필요
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '@/types/_shared/profile'
import { saveTokens, clearTokens } from '@/api/tokenUtils'

interface AuthState {
  isLogined: boolean
  user: {
    id: string
    profile: Profile | null
  } | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isLogined: false,
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
      state.user = {
        id: action.payload.userId,
        profile: null,
      }
      saveTokens(action.payload.accessToken, action.payload.refreshToken)
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    logout(state) {
      state.isLogined = false
      state.user = null
      clearTokens()
    },
  },
})
export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions
export default authSlice.reducer
