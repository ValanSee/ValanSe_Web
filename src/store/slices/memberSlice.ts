import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '@/types/member'
import { MypageData } from '@/types/_shared/mypageData'
import { PointHistoryItem } from '@/types/_shared/pointHistory'
import { TitlesResponse } from '@/types/_shared/title'

interface MemberState {
  profile: Profile | null
  mypageData: MypageData | null
  pointHistory: PointHistoryItem[] | null
  titles: TitlesResponse | null
}

const initialState: MemberState = {
  profile: null,
  mypageData: null,
  pointHistory: null,
  titles: null,
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
    setPointHistory(state, action: PayloadAction<PointHistoryItem[]>) {
      state.pointHistory = action.payload
    },
    setTitles(state, action: PayloadAction<TitlesResponse>) {
      state.titles = action.payload
    },
    resetMember() {
      return initialState
    },
  },
})

export const {
  setProfile,
  setMypageData,
  setPointHistory,
  setTitles,
  resetMember,
} = memberSlice.actions
export default memberSlice.reducer
