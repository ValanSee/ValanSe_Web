// 비동기 로그인 로직 추가 필요
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isLogined: boolean
  userId: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isLogined: false,
  userId: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state, action: PayloadAction<{ userId: string }>) {
      state.loading = false
      state.isLogined = true
      state.userId = action.payload.userId
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    logout(state) {
      state.isLogined = false
      state.userId = null
    },
  },
})
export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions
export default authSlice.reducer
