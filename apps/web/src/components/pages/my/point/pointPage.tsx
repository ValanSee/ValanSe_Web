'use client'

import { useEffect, useState } from 'react'
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
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        await dispatch(fetchPointHistoryThunk())
        if (!cancelled) setLoaded(true)
      } catch {
        router.replace(entryHrefWithRedirect(pathname))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [dispatch, pathname, router])

  if (!loaded || !pointHistory) return <Loading />

  // 가장 최신 항목의 remainingPoint가 현재 잔액. 내역이 없으면 0.
  const currentPoint = pointHistory[0]?.remainingPoint ?? 0

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        title="내 포인트"
        showBackButton
        onBackClick={() => router.push('/my')}
      />
      <PointHeaderSection point={currentPoint} />
      <PointPolicyNotice />
      <div className="h-2 bg-background" />
      <PointHistoryList items={pointHistory} />
    </div>
  )
}

export default PointPage
