'use client'

import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import CreateForm from './createForm'
import Loading from '@/components/_shared/loading'
import { useEffect, useState } from 'react'

const CreatePage = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    // 최소 0.8초 로딩 시간 보장
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (isInitialLoading) {
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
