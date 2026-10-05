'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Header from '@/components/_shared/header'
import { TabBar, TabItem } from '@/components/ui/tabBar'
import { fetchVotes } from '@/api/pages/valanse/balanseListapi'
import type { Vote, VoteListResponse } from '@/types/balanse/vote'
import { useReportedContent } from '@/hooks/utils/useReportedContent'
import BalanseVoteCard from './balanseVoteCard'
import HotTrendingBar from './hotTrendingBar'
import { CATEGORIES } from '@/constants/category'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'

const TABS = [
  { label: '전체', value: 'ALL' as const },
  ...CATEGORIES.map((c) => ({ label: c.label, value: c.param })),
]

/** 서버에서 비로그인으로 조회한 첫 페이지. key 는 `${category}|${sort}` */
export type BalanseInitialData = VoteListResponse & { key: string }

interface BalancePageProps {
  initialData?: BalanseInitialData | null
}

function BalancePageContent({ initialData }: BalancePageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [votes, setVotes] = useState<Vote[]>(initialData?.votes ?? [])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(
    initialData?.has_next_page ?? false,
  )
  const [nextCursor, setNextCursor] = useState<string | undefined>(
    initialData?.next_cursor,
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadingRef = useRef<HTMLDivElement>(null)

  const category = searchParams.get('category') || 'ALL'
  const sort = (searchParams.get('sort') as 'latest' | 'popular') || 'latest'

  const { isReported } = useReportedContent()
  // 내가 신고한 투표는 관리자 처리 전까지 목록에서 아예 감춘다
  const visibleVotes = votes.filter((v) => !isReported('VOTE', v.id))

  const updateCategory = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('category', newCategory)
    router.push(`?${params.toString()}`)
  }

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage || !nextCursor) return
    try {
      setIsLoadingMore(true)
      const data = await fetchVotes({
        category,
        sort,
        cursor: nextCursor,
        size: 5,
      })
      setVotes((prev) => [...prev, ...data.votes])
      setHasNextPage(data.has_next_page)
      setNextCursor(data.next_cursor)
    } catch {
      setError('추가 데이터를 불러오지 못했습니다.')
    } finally {
      setIsLoadingMore(false)
    }
  }, [category, sort, hasNextPage, nextCursor, isLoadingMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )
    if (loadingRef.current) observer.observe(loadingRef.current)
    return () => observer.disconnect()
  }, [loadMore, hasNextPage, isLoadingMore])

  useEffect(() => {
    // 카테고리·정렬 변경 시 서버 컴포넌트가 새 첫 페이지를 내려주므로 일치하면 재조회 생략
    if (initialData?.key === `${category}|${sort}`) {
      setVotes(initialData.votes)
      setHasNextPage(initialData.has_next_page)
      setNextCursor(initialData.next_cursor)
      setError(null)
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchVotes({ category, sort, size: 5 })
        setVotes(data.votes)
        setHasNextPage(data.has_next_page)
        setNextCursor(data.next_cursor)
      } catch {
        setError('불러오기 실패')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category, sort, initialData])

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col bg-card pb-24',
        DESKTOP_PAGE_COLUMN,
      )}
    >
      <Header title="밸런스 게임" />

      <TabBar>
        {TABS.map((tab) => (
          <TabItem
            key={tab.value}
            label={tab.label}
            selected={tab.value === category}
            onClick={() => updateCategory(tab.value)}
          />
        ))}
      </TabBar>

      <HotTrendingBar />

      <div className="flex flex-col gap-3 px-4 pt-4">
        {error && (
          <p className="typo-body-b-01 py-8 text-center text-destructive">
            {error}
          </p>
        )}
        {!error && !loading && visibleVotes.length === 0 && (
          <p className="typo-body-b-01 py-8 text-center text-brand-gray-100">
            해당 카테고리의 밸런스게임이 아직 없어요
          </p>
        )}
        {visibleVotes.map((vote) => (
          <BalanseVoteCard key={vote.id} data={vote} />
        ))}
        {hasNextPage && (
          <div ref={loadingRef} className="py-4 text-center">
            {isLoadingMore && (
              <p className="typo-body-c-02 text-brand-gray-100">불러오는 중…</p>
            )}
          </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  )
}

export default function BalancePage({ initialData }: BalancePageProps) {
  return (
    <Suspense fallback={null}>
      <BalancePageContent initialData={initialData} />
    </Suspense>
  )
}
