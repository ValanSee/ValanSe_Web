// 비동기 로그인 로직 추가 필요
import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  isLogined: boolean
}

const initialState: AuthState = {
  isLogined: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    login(state) {
      state.isLogined = true
    },
    logout(state) {
      state.isLogined = false
    },
  },
})
export const { login, logout } = authSlice.actions
export default authSlice.reducer
