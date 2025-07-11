// 비동기 로그인 로직 추가 필요
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { saveTokens, clearTokens } from '@/utils/tokenUtils'

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
      state.userId = action.payload.userId
      saveTokens(action.payload.accessToken, action.payload.refreshToken)
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    logout(state) {
      state.isLogined = false
      state.userId = null
      clearTokens()
    },
    // TODO: memberslice로 이동
    // setProfile(state, action: PayloadAction<Profile>) {
    //   if (state.user) {
    //     state.user.profile = action.payload
    //   }
    // },
  },
})
export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions
export default authSlice.reducer
