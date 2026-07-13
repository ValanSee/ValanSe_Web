import {
  fetchMemberMypage,
  fetchMemberProfile,
  updateMemberProfile,
  updateProfileImage,
} from '@/api/member/member'
import { fetchPointHistory } from '@/api/member/point'
import {
  equipTitle,
  fetchTitles,
  purchaseTitle,
} from '@/api/member/title'
import {
  setProfile,
  setMypageData,
  setPointHistory,
  setTitles,
} from '../slices/memberSlice'
import { AppDispatch, RootState } from '../store'
import { Profile } from '@/types/member'
import { Title, TitlesResponse } from '@/types/_shared/title'

// 프로필을 가져오고 store에 저장
export const fetchProfileThunk = () => async (dispatch: AppDispatch) => {
  let profile: Profile | null = null

  try {
    profile = await fetchMemberProfile()
    dispatch(setProfile(profile))
    return profile
  } catch (err) {
    throw err
  }
}

// 마이페이지 데이터 가져오고 store에 저장
export const fetchMypageDataThunk = () => async (dispatch: AppDispatch) => {
  try {
    const mypageData = await fetchMemberMypage()
    if (mypageData) {
      dispatch(setMypageData(mypageData))
    }
    return mypageData
  } catch (err) {
    throw err
  }
}

// 포인트 내역 가져오고 store에 저장
// 잔액은 각 항목의 remainingPoint로 응답에 포함됨 (가장 최신 항목이 현재 잔액)
export const fetchPointHistoryThunk = () => async (dispatch: AppDispatch) => {
  try {
    const { pointHistory } = await fetchPointHistory()
    dispatch(setPointHistory(pointHistory))
    return pointHistory
  } catch (err) {
    throw err
  }
}

// 칭호 목록 조회 및 store 저장
export const fetchTitlesThunk = () => async (dispatch: AppDispatch) => {
  try {
    const titles = await fetchTitles()
    dispatch(setTitles(titles))
    return titles
  } catch (err) {
    throw err
  }
}

// 칭호 장착: 성공 시 store의 titles에서 이전 장착 해제 + 신규 장착 반영
export const equipTitleThunk =
  (titleId: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const res = await equipTitle(titleId)
      const current = getState().member.titles
      if (current) {
        const applyEquip = (list: Title[]): Title[] =>
          list.map((t) => ({
            ...t,
            equipped: t.titleId === res.titleId ? res.equipped : false,
          }))
        const next: TitlesResponse = {
          defaultTitles: applyEquip(current.defaultTitles),
          ownedTitles: applyEquip(current.ownedTitles),
          lockedTitles: current.lockedTitles, // 잠금 칭호는 장착 대상 아님
        }
        dispatch(setTitles(next))
      }
      return res
    } catch (err) {
      throw err
    }
  }

// 칭호 구매: 성공 시 lockedTitles에서 해당 항목을 ownedTitles로 이동.
// 잔액(remainingPoint)은 응답으로 받지만 store의 pointHistory 동기화는 후속 작업.
// TODO: 구매 직후 pointHistory 재조회 또는 amount=-price 항목을 직접 prepend.
export const purchaseTitleThunk =
  (titleId: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const res = await purchaseTitle(titleId)
      const current = getState().member.titles
      if (current) {
        const purchased = current.lockedTitles.find(
          (t) => t.titleId === res.titleId,
        )
        if (purchased) {
          const moved: Title = {
            ...purchased,
            owned: true,
            locked: false,
            lockReason: null,
          }
          dispatch(
            setTitles({
              defaultTitles: current.defaultTitles,
              ownedTitles: [...current.ownedTitles, moved],
              lockedTitles: current.lockedTitles.filter(
                (t) => t.titleId !== res.titleId,
              ),
            }),
          )
        }
      }
      return res
    } catch (err) {
      throw err
    }
  }

// 프로필 이미지 업로드: 성공 시 store의 mypageData에 새 이미지 URL 반영
export const updateProfileImageThunk =
  (file: File) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const profileImageUrl = await updateProfileImage(file)
      const current = getState().member.mypageData
      if (current) {
        dispatch(
          setMypageData({ ...current, profile_image_url: profileImageUrl }),
        )
      }
      return profileImageUrl
    } catch (err) {
      throw err
    }
  }

export const updateProfileThunk =
  (profile: Profile) => async (dispatch: AppDispatch) => {
    try {
      await updateMemberProfile(profile) // 프로필 업데이트
      const updatedProfile = await fetchMemberProfile() // 업데이트 된 프로필 가져오기
      dispatch(setProfile(updatedProfile)) // store에 저장

      const updatedMypageData = await fetchMemberMypage() // 업데이트 된 마이페이지 데이터 가져오기
      if (updatedMypageData) {
        dispatch(setMypageData(updatedMypageData)) // store에 저장
      } else {
        throw new Error('마이페이지 데이터 가져오기 실패')
      }

      return updatedProfile
    } catch (err) {
      throw err
    }
  }
