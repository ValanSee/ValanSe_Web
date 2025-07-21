// TODO: 수정하기
// TODO: 비로그인 페이지
// TODO: api 호출

'use client'

import MyProfileSection from './myProfileSection'
import MyActivitySection from './myActivitySection'
import AccountControlSection from './accountControlSection'
import { useEffect } from 'react'
import BottomNavBar from '@/components/_shared/bottomNavBar'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { fetchMypageDataThunk } from '@/store/thunks/memberThunks'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { useRouter } from 'next/navigation'
import { recover } from '@/store/slices/authSlice'

function MyPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const mypageData = useAppSelector((state) => state.member.mypageData)
  const isLogined = useAppSelector((state) => state.auth.isLogined)

  useEffect(() => {
    // 로그인 안 되어있으면 리디렉션
    if (!isLogined) {
      const checkLogin = async () => {
        try {
          await dispatch(fetchMypageDataThunk())
          dispatch(recover())
        } catch (err) {
          console.error('리뉴얼 실패', err)
          router.push('/entry')
          return
        }
      }
      checkLogin()
    }

    // 마이페이지 데이터가 없으면 불러오기
    if (!mypageData) {
      const fetchData = async () => {
        try {
          await dispatch(fetchMypageDataThunk())
        } catch (err) {
          console.error('마이페이지 데이터 가져오기 실패', err)
        }
      }

      fetchData()
    }
  }, [dispatch, isLogined, mypageData, router])

  if (!mypageData) {
    return (
      <div className="pt-12 text-center text-gray-500">
        마이페이지 정보를 불러오는 중입니다...
      </div>
    )
  }

  return (
    <>
      <div className="pb-20">
        {/* 상단 여백 */}
        <MyProfileSection />
        <div className="w-full h-3 bg-[#F0F0F0]"></div>
        <MyActivitySection />
        <div className="mx-4 border-t-[0.5px] border-[#F0F0F0]"></div>
        <AccountControlSection />
      </div>
      <BottomNavBar />
    </>
  )
}

export default MyPage
