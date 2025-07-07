// features/auth/authThunks.ts
import axios from 'axios'
import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice'
import { AppDispatch } from '../store'

export const loginThunk = (code: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loginStart())
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/kakao/login`,
      { code },
    )
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
