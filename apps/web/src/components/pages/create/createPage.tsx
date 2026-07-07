'use client'

import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Header from '@/components/_shared/header'
import CreateForm from './createForm'

const CreatePage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-card pb-24">
      <Header showBackButton title="밸런스 게임 만들기" />
      <div className="flex-1 px-5 pb-10 pt-4">
        <CreateForm />
      </div>
      <BottomNavBar />
    </div>
  )
}

export default CreatePage
