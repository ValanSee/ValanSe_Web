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

function MyPage() {
  const mypageData = useAppSelector((state) => state.member.mypageData)

  useEffect(() => {
    if (!mypageData) {
      const fetchData = async () => {
        const data = await fetchMypageDataThunk()
        console.log('data', data)
      }
      fetchData()
    }
  }, [])

  return (
    <div className="pt-12">
      {/* 상단 여백 */}
      <MyProfileSection />
      <div className="w-full h-3 bg-[#F0F0F0]"></div>
      <MyActivitySection />
      <div className="mx-4 border-t-[0.5px] border-[#F0F0F0]"></div>
      <AccountControlSection />

      <BottomNavBar />
    </div>
  )
}

export default MyPage
