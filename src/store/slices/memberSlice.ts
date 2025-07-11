import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '@/types/_shared/profile'

type MypageData = {
  profile_image_url: string
  kakaoname: string
  email: string
  nickname: string
  gender: string
  age: string
  mbti: string
}
interface MemberState {
  profile: Profile | null
  mypageData: MypageData | null
}

const initialState: MemberState = {
  profile: null,
  mypageData: null,
}

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload
    },
    setMypageData(state, action: PayloadAction<MypageData>) {
      state.mypageData = action.payload
    },
  },
})

export const { setProfile, setMypageData } = memberSlice.actions
export default memberSlice.reducer
