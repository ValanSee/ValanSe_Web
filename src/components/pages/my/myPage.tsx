// TODO: 수정하기
// TODO: 비로그인 페이지
// TODO: api 호출

'use client'

import MyProfileSection from './myProfileSection'
import MyActivitySection from './myActivitySection'
import AccountControlSection from './accountControlSection'
import { useEffect, useState } from 'react'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { fetchMypageDataThunk } from '@/store/thunks/memberThunks'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { usePathname, useRouter } from 'next/navigation'
import { entryHrefWithRedirect } from '@/utils/authRedirect'
import Loading from '@/components/_shared/loading'

function MyPage() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const mypageData = useAppSelector((state) => state.member.mypageData)
  const [minLoadingComplete, setMinLoadingComplete] = useState(false)

  useEffect(() => {
    // 최소 0.8초 로딩 시간 보장
    const timer = setTimeout(() => {
      setMinLoadingComplete(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!mypageData) {
      void (async () => {
        try {
          await dispatch(fetchMypageDataThunk())
        } catch {
          router.replace(entryHrefWithRedirect(pathname))
        }
      })()
    }
  }, [dispatch, mypageData, pathname, router])

  if (!mypageData || !minLoadingComplete) {
    return <Loading />
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
