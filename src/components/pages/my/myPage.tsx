// TODO: 수정하기
// TODO: 비로그인 페이지
// TODO: api 호출

'use client'

import MyProfileSection from './myProfileSection'
import MyActivitySection from './myActivitySection'
import AccountControlSection from './accountControlSection'
import { useEffect } from 'react'
import { fetchMemberMypage } from '@/api/member'

function MyPage() {
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMemberMypage()
      console.log(data)
    }
    fetchData()
  }, [])

  return (
    <div className="pt-12">
      {/* 상단 여백 */}
      <MyProfileSection />
      <div className="w-full h-3 bg-[#F0F0F0]"></div>
      <MyActivitySection />
      <div className="mx-4 border-t-[0.5px] border-[#F0F0F0]"></div>
      <AccountControlSection />
    </div>
  )
}

export default MyPage
