'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Header from '@/components/_shared/header'
import Loading from '@/components/_shared/loading'
import { Chip } from '@/components/ui/chip'
import { BestVoteResponse, fetchBestVote } from '@/api/votes'
import HomeVoteCard from './homeVoteCard'

const CATEGORIES = [
  { label: '연애', param: 'LOVE' },
  { label: '음식', param: 'FOOD' },
  { label: '기타', param: 'ETC' },
] as const

const MainPage = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [featured, setFeatured] = useState<BestVoteResponse | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    fetchBestVote()
      .then(setFeatured)
      .catch(() => {})
  }, [])

  if (isInitialLoading) return <Loading />

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
      <Header title="홈" />

      {/* 카테고리 chip 가로 스크롤 */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.param}
            href={`/balanse?category=${c.param}`}
            className="shrink-0"
          >
            <Chip status="ghost" size="m" clickable={false}>
              {c.label}
            </Chip>
          </Link>
        ))}
      </div>

      {/* 오늘의 핫이슈 (featured 카드) */}
      <div className="flex flex-col gap-3 px-4">
        {featured && <HomeVoteCard data={featured} />}
      </div>

      <BottomNavBar />
    </div>
  )
}

export default MainPage
