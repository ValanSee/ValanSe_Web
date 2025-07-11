import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '@/types/_shared/profile'

interface MemberState {
  profile: Profile | null
}

const initialState: MemberState = {
  profile: null,
}

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload
    },
  },
})

export const { setProfile } = memberSlice.actions
export default memberSlice.reducer
