'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Header from '@/components/_shared/header'
import BalanseVoteCard from '@/components/pages/balanse/balanseVoteCard'
import { BestVoteResponse, fetchBestVote } from '@/api/votes'
import { fetchVotes } from '@/api/pages/valanse/balanseListapi'
import type { Vote } from '@/types/balanse/vote'
import HomeVoteCard from './homeVoteCard'

const CATEGORIES = [
  { label: '연애', param: 'LOVE', icon: 'noto:sparkling-heart' },
  { label: '음식', param: 'FOOD', icon: 'noto:fork-and-knife-with-plate' },
  { label: '기타', param: 'ETC', icon: 'noto:speech-balloon' },
] as const

const MainPage = () => {
  const [featured, setFeatured] = useState<BestVoteResponse | null>(null)
  const [latest, setLatest] = useState<Vote[]>([])

  useEffect(() => {
    fetchBestVote()
      .then(setFeatured)
      .catch(() => {})
    fetchVotes({ category: 'ALL', sort: 'latest', size: 3 })
      .then((data) => setLatest(data.votes))
      .catch(() => {})
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-card pb-24">
      <Header title="홈" />

      {/* 뜨고 있는 밸런스 */}
      <section className="flex flex-col gap-3 px-4 pt-4">
        <SectionHeader
          title="뜨고 있는 밸런스"
          moreHref="/balanse?sort=popular"
        />
        {featured ? (
          <HomeVoteCard data={featured} />
        ) : (
          <EmptyLine text="아직 인기 밸런스가 없어요" />
        )}
      </section>

      {/* 이런 주제는 어때요? */}
      <section className="mt-6 flex flex-col gap-3 border-b-8 border-brand-gray-50 bg-card px-4 py-5">
        <h2 className="typo-heading-06 text-foreground">이런 주제는 어때요?</h2>
        <div className="flex items-start justify-around">
          {CATEGORIES.map((c) => (
            <Link
              key={c.param}
              href={`/balanse?category=${c.param}`}
              className="flex flex-col items-center gap-2"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gray-50">
                <Icon icon={c.icon} width={32} aria-hidden />
              </span>
              <span className="typo-title-03 text-foreground">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 올라오고 있는 밸런스 */}
      <section className="mt-4 flex flex-col gap-3 px-4">
        <SectionHeader title="올라오고 있는 밸런스" moreHref="/balanse" />
        {latest.length === 0 ? (
          <EmptyLine text="아직 올라온 밸런스가 없어요" />
        ) : (
          <div className="flex flex-col gap-3">
            {latest.map((v) => (
              <BalanseVoteCard key={v.id} data={v} />
            ))}
          </div>
        )}
      </section>

      <BottomNavBar />
    </div>
  )
}

function SectionHeader({
  title,
  moreHref,
}: {
  title: string
  moreHref?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="typo-heading-06 text-foreground">{title}</h2>
      {moreHref && (
        <Link
          href={moreHref}
          className="typo-label-02 flex items-center gap-0.5 text-brand-gray-200"
        >
          더보기
          <Icon icon="icon-park-outline:right" width={16} aria-hidden />
        </Link>
      )}
    </div>
  )
}

function EmptyLine({ text }: { text: string }) {
  return (
    <p className="typo-body-b-01 py-8 text-center text-brand-gray-100">{text}</p>
  )
}

export default MainPage
