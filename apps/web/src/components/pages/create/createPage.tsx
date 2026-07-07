'use client'

import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Header from '@/components/_shared/header'
import Loading from '@/components/_shared/loading'
import { useEffect, useState } from 'react'
import CreateForm from './createForm'

const CreatePage = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (isInitialLoading) return <Loading />

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
