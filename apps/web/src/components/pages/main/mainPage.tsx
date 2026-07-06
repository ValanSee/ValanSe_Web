'use client'

import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Image from 'next/image'
import Link from 'next/link'
import BestVoteArea from './bestVoteArea'
import Loading from '@/components/_shared/loading'
import { useEffect, useState } from 'react'

// 테스트 데이터
const categories = [
  { label: '음식', icon: '/category-food.svg', param: 'FOOD' },
  { label: '연애', icon: '/category-love.svg', param: 'LOVE' },
  { label: '기타', icon: '/category-etc.svg', param: 'ETC' },
]

const MainPage = () => {
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
    <div className="flex min-h-screen flex-col items-center bg-background px-4 pb-24">
      <BestVoteArea />

      <div className="flex w-full flex-col items-center gap-10 pt-8">
        {/* 밸런스 게임 만들기 */}
        <Link
          href="/create"
          className="typo-heading-02 flex h-[120px] w-full items-center justify-between rounded-lg bg-card py-3 pl-5 pr-4 text-foreground"
        >
          밸런스 게임 만들기
          {/* TODO(P8): PR #129 머지 후 /icons/nav/create.svg로 갱신, 또는 CreateIcon 컴포넌트로 교체 */}
          <Image src="/create.svg" alt="create" width={28} height={28} />
        </Link>

        {/* 카테고리 */}
        <div className="flex w-full justify-around gap-2">
          {categories.map((c) => (
            <Link
              href={`/balanse?category=${c.param}`}
              key={c.label}
              className="flex w-full flex-col items-center rounded-lg bg-card p-4 pb-5 pt-7"
            >
              <Image src={c.icon} alt={c.label} width={48} height={48} />
              <div className="typo-title-04 mt-1 text-foreground">{c.label}</div>
            </Link>
          ))}
        </div>

        {/* TODO(design): "New 전체보기" 강조색 text-[#f27f23]은 브랜드 오렌지 팔레트 확정 후 치환 */}
        <Link
          href="/balanse"
          className="typo-heading-02 flex h-[120px] w-full items-center rounded-lg bg-card pl-4 text-[#f27f23]"
        >
          New 전체보기
        </Link>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavBar />
    </div>
  )
}

export default MainPage
