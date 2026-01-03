import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '@/types/member'
import { MypageData } from '@/types/_shared/mypageData'

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
