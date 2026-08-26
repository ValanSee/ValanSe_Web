'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Header from '@/components/_shared/header'
import SectionHeader from '@/components/_shared/sectionHeader'
import EmptyState from '@/components/_shared/emptyState'
import HorizontalScroll from '@/components/_shared/horizontalScroll'
import BalanseVoteCard from '@/components/pages/balanse/balanseVoteCard'
import {
  fetchTrendingVotes,
  type TrendingVoteItem,
} from '@/api/pages/valanse/trendingVoteApi'
import { fetchVotes } from '@/api/pages/valanse/balanseListapi'
import type { Vote } from '@/types/balanse/vote'
import { useReportedContent } from '@/hooks/utils/useReportedContent'
import HomeVoteCard from './homeVoteCard'
import { CATEGORIES } from '@/constants/category'

const MainPage = () => {
  const [featured, setFeatured] = useState<TrendingVoteItem | null>(null)
  const [latest, setLatest] = useState<Vote[]>([])
  const { isReported } = useReportedContent()

  // 내가 신고한 투표는 관리자 처리 전까지 목록에서 아예 감춘다
  const visibleFeatured =
    featured && !isReported('VOTE', featured.voteId) ? featured : null
  const visibleLatest = latest.filter((v) => !isReported('VOTE', v.id))

  useEffect(() => {
    fetchTrendingVotes(7)
      .then((res) => setFeatured(res?.votes[0] ?? null))
      .catch(() => {})
    fetchVotes({ category: 'ALL', sort: 'latest', size: 3 })
      .then((data) => setLatest(data.votes))
      .catch(() => {})
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-card pb-24">
      <Header
        leading={
          <Image
            src="/assets/logo.svg"
            alt="Valanse"
            width={28}
            height={26}
            priority
          />
        }
      />

      {/* 뜨고 있는 밸런스 */}
      <section className="flex flex-col gap-3 px-4 pt-4">
        <SectionHeader
          title="뜨고 있는 밸런스"
          moreHref="/balanse?sort=popular"
        />
        {visibleFeatured ? (
          <HomeVoteCard data={visibleFeatured} />
        ) : (
          <EmptyState text="아직 인기 밸런스가 없어요" />
        )}
      </section>

      {/* 이런 주제는 어때요? */}
      <section className="mt-6 flex flex-col gap-3 border-b-8 border-brand-gray-50 bg-card py-5">
        <h2 className="typo-heading-06 px-4 text-foreground">
          이런 주제는 어때요?
        </h2>
        <HorizontalScroll className="flex gap-4 px-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.param}
              href={`/balanse?category=${c.param}`}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gray-50">
                <Icon icon={c.icon} width={32} aria-hidden />
              </span>
              <span className="typo-title-03 text-foreground">{c.label}</span>
            </Link>
          ))}
        </HorizontalScroll>
      </section>

      {/* 올라오고 있는 밸런스 */}
      <section className="mt-4 flex flex-col gap-3 px-4">
        <SectionHeader title="올라오고 있는 밸런스" moreHref="/balanse" />
        {visibleLatest.length === 0 ? (
          <EmptyState text="아직 올라온 밸런스가 없어요" />
        ) : (
          <div className="flex flex-col gap-3">
            {visibleLatest.map((v) => (
              <BalanseVoteCard key={v.id} data={v} />
            ))}
          </div>
        )}
      </section>

      <BottomNavBar />
    </div>
  )
}

export default MainPage
