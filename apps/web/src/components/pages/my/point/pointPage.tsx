'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Header from '@/components/_shared/header'
import Loading from '@/components/_shared/loading'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { fetchPointHistoryThunk } from '@/store/thunks/memberThunks'
import { entryHrefWithRedirect } from '@/utils/authRedirect'
import PointHeaderSection from './pointHeaderSection'
import PointPolicyNotice from './pointPolicyNotice'
import PointHistoryList from './pointHistoryList'

const PointPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const pointHistory = useAppSelector((state) => state.member.pointHistory)

  useEffect(() => {
    void (async () => {
      try {
        await dispatch(fetchPointHistoryThunk())
      } catch {
        router.replace(entryHrefWithRedirect(pathname))
      }
    })()
  }, [dispatch, pathname, router])

  if (!pointHistory) return <Loading />

  const currentPoint = pointHistory[0]?.remainingPoint ?? 0

  return (
    <div className="flex min-h-screen flex-col bg-card">
      <Header
        title="내 포인트"
        showBackButton
        onBackClick={() => router.push('/my')}
      />
      <PointHeaderSection point={currentPoint} />
      <PointPolicyNotice />
      <div className="h-2 bg-brand-gray-50" />
      <PointHistoryList items={pointHistory} />
    </div>
  )
}

export default PointPage
