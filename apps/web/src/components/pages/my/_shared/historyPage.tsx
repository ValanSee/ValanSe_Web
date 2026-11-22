'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/icon'
import Header from '@/components/_shared/header'
import BalanseHistoryCard from '@/components/pages/my/_shared/balanseHistoryCard'
import { TabBar, TabItem } from '@/components/ui/tabBar'
import { fetchMineVotesCreated, fetchMineVotesVoted } from '@/api/votes'
import { useSlideDirection } from '@/hooks/utils/useSlideDirection'
import { MyVoteHistoryItem } from '@/types/my/history'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'

const CATEGORIES = [
  { label: '전체', value: 'ALL' },
  { label: '연애', value: 'LOVE' },
  { label: '음식', value: 'FOOD' },
  { label: '기타', value: 'ETC' },
] as const

interface HistoryPageProps {
  mode: 'created' | 'voted'
}

const HistoryPage = ({ mode }: HistoryPageProps) => {
  const router = useRouter()
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState<'latest' | 'popular'>('latest')
  const [votes, setVotes] = useState<MyVoteHistoryItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const listSlideClass = useSlideDirection(
    CATEGORIES.findIndex((c) => c.value === category),
  )

  const title =
    mode === 'created' ? '내가 만든 밸런스 게임' : '내가 투표한 밸런스 게임'

  useEffect(() => {
    ;(async () => {
      try {
        const data =
          mode === 'created'
            ? await fetchMineVotesCreated(category, sort)
            : await fetchMineVotesVoted(category, sort)
        setVotes(data)
        setError(null)
      } catch {
        setError('불러오기 실패')
      }
    })()
  }, [category, sort, mode])

  return (
    <div
      className={cn('flex min-h-screen flex-col bg-card', DESKTOP_PAGE_COLUMN)}
    >
      <Header
        title={title}
        showBackButton
        onBackClick={() => router.push('/my')}
      />
      <TabBar>
        {CATEGORIES.map((tab) => (
          <TabItem
            key={tab.value}
            label={tab.label}
            selected={tab.value === category}
            onClick={() => setCategory(tab.value)}
          />
        ))}
      </TabBar>
      <div className="flex items-center justify-end gap-1 px-4 pt-3">
        <button
          type="button"
          onClick={() =>
            setSort((prev) => (prev === 'latest' ? 'popular' : 'latest'))
          }
          className="typo-label-03 flex items-center gap-1 text-brand-gray-200"
        >
          {sort === 'latest' ? '최신순' : '인기순'}
          <Icon icon="icon-park-solid:down-one" width={14} aria-hidden />
        </button>
      </div>
      <div
        key={category}
        className={cn(
          'flex flex-col gap-3 px-4 pb-24 pt-3',
          listSlideClass,
          // 방향 슬라이드는 모바일 전용. PC 는 기존 동작 유지 (! 로 slideInClass 의 lg:animate-fade-only 보다 우선)
          'lg:!animate-none',
        )}
      >
        {error && (
          <p className="typo-body-b-01 py-8 text-center text-destructive">
            {error}
          </p>
        )}
        {!error && votes.length === 0 && (
          <p className="typo-body-b-01 py-8 text-center text-brand-gray-100">
            아직 활동 내역이 없어요
          </p>
        )}
        {votes.map((vote) => (
          <BalanseHistoryCard
            key={vote.voteId}
            data={vote}
            onClick={() => router.push(`/poll/${vote.voteId}`)}
          />
        ))}
      </div>
    </div>
  )
}

export default HistoryPage
