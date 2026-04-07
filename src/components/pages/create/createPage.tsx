'use client'

import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import CreateForm from './createForm'
import Loading from '@/components/_shared/loading'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { entryHrefWithRedirect } from '@/utils/authRedirect'
import { getAccessToken } from '@/utils/tokenUtils'

const CreatePage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const isLogined = useAppSelector((state) => state.auth.isLogined)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace(entryHrefWithRedirect(pathname))
    }
  }, [pathname, router])

  if (!isLogined || isInitialLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="flex flex-col items-center pt-6 bg-white min-h-screen pb-20">
        <div className="flex items-center justify-start w-full px-4 py-2.5">
          <div className="text-[20px] font-[700] leading-none">
            밸런스 게임 만들기
          </div>
        </div>

        <div className="w-full px-4 pt-[51px]">
          <CreateForm />
        </div>
      </div>
      <BottomNavBar />
    </>
  )
}

export default CreatePage
