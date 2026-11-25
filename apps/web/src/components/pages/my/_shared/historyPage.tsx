'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/icon'
import Header from '@/components/_shared/header'
import BalanseHistoryCard from '@/components/pages/my/_shared/balanseHistoryCard'
import { TabBar, TabItem } from '@/components/ui/tabBar'
import { fetchMineVotesCreated, fetchMineVotesVoted } from '@/api/votes'
import { useSlideDirection } from '@/hooks/utils/useSlideDirection'
import { slideInClass } from '@/lib/slideTransition'
import { MyVoteHistoryItem } from '@/types/my/history'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'

const CATEGORIES = [
  { label: '전체', value: 'ALL' },
  { label: '연애', value: 'LOVE' },
  { label: '음식', value: 'FOOD' },
  { label: '기타', value: 'ETC' },
] as const

const SKELETON_BLOCK = 'animate-pulse rounded-xl bg-brand-gray-50'

type Sort = 'latest' | 'popular'

/** 받아 온 목록과 그 목록이 어떤 카테고리 · 정렬의 것인지 */
interface HistoryResult {
  category: string
  sort: Sort
  votes: MyVoteHistoryItem[]
  error: string | null
}

interface HistoryPageProps {
  mode: 'created' | 'voted'
}

const HistoryPage = ({ mode }: HistoryPageProps) => {
  const router = useRouter()
  const [category, setCategory] = useState('ALL')
  const [sort, setSort] = useState<Sort>('latest')
  const [result, setResult] = useState<HistoryResult | null>(null)
  // 카테고리 · 정렬을 바꾸는 동안에는 직전 목록을 그대로 두고, 새 응답이 오면 그 목록을 새로 마운트해
  // 슬라이드(정렬은 페이드)로 넣는다. 스켈레톤은 아직 받은 목록이 하나도 없는 첫 진입에서만
  const shownCategory = result?.category ?? category
  const shownSort = result?.sort ?? sort
  const categorySlideClass = useSlideDirection(
    CATEGORIES.findIndex((c) => c.value === shownCategory),
  )
  // 마지막으로 바뀐 게 정렬이면 목록이 다시 마운트돼도 직전 카테고리 슬라이드를 재생하지 않고 페이드만
  const [lastChange, setLastChange] = useState({
    category: shownCategory,
    sort: shownSort,
    by: 'category' as 'category' | 'sort',
  })
  if (lastChange.category !== shownCategory || lastChange.sort !== shownSort) {
    setLastChange({
      category: shownCategory,
      sort: shownSort,
      by: lastChange.category !== shownCategory ? 'category' : 'sort',
    })
  }
  const listSlideClass =
    lastChange.by === 'sort' ? slideInClass(null) : categorySlideClass

  const title =
    mode === 'created' ? '내가 만든 밸런스 게임' : '내가 투표한 밸런스 게임'

  const renderListContent = (
    items: MyVoteHistoryItem[],
    listError: string | null,
  ) => (
    <>
      {listError && (
        <p className="typo-body-b-01 py-8 text-center text-destructive">
          {listError}
        </p>
      )}
      {!listError && items.length === 0 && (
        <p className="typo-body-b-01 py-8 text-center text-brand-gray-100">
          아직 활동 내역이 없어요
        </p>
      )}
      {items.map((vote) => (
        <BalanseHistoryCard
          key={vote.voteId}
          data={vote}
          onClick={() => router.push(`/poll/${vote.voteId}`)}
        />
      ))}
    </>
  )

  useEffect(() => {
    // 빠르게 연달아 바꾸면 이전 요청은 버리고 마지막 카테고리 · 정렬의 응답만 반영
    let cancelled = false
    ;(async () => {
      try {
        const data =
          mode === 'created'
            ? await fetchMineVotesCreated(category, sort)
            : await fetchMineVotesVoted(category, sort)
        if (cancelled) return
        setResult({ category, sort, votes: data, error: null })
      } catch {
        if (cancelled) return
        setResult({ category, sort, votes: [], error: '불러오기 실패' })
      }
    })()
    return () => {
      cancelled = true
    }
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
      {!result ? (
        <>
          {/* 첫 진입 스켈레톤은 모바일 전용 */}
          <div
            className="flex flex-col gap-3 px-4 pb-24 pt-3 lg:hidden"
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className={`${SKELETON_BLOCK} h-40`} />
            ))}
          </div>
          {/* PC 는 기존 동작 유지 */}
          <div className="hidden flex-col gap-3 px-4 pb-24 pt-3 lg:flex">
            {renderListContent([], null)}
          </div>
        </>
      ) : (
        <div
          key={`${result.category}:${result.sort}`}
          className={cn(
            'flex flex-col gap-3 px-4 pb-24 pt-3',
            listSlideClass,
            // 방향 슬라이드는 모바일 전용. PC 는 기존 동작 유지 (! 로 slideInClass 의 lg:animate-fade-only 보다 우선)
            'lg:!animate-none',
          )}
        >
          {renderListContent(result.votes, result.error)}
        </div>
      )}
    </div>
  )
}

export default HistoryPage
