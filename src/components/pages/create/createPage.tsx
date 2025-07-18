'use client'

import BottomNavBar from '@/components/_shared/bottomNavBar'
import CreateForm from './createForm'

const CreatePage = () => {
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
