'use client'

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Header from '@/components/_shared/header'
import { TabBar, TabItem } from '@/components/ui/tabBar'
import { fetchVotes } from '@/api/pages/valanse/balanseListapi'
import type { Vote } from '@/types/balanse/vote'
import BalanseVoteCard from './balanseVoteCard'

const TABS = [
  { label: '전체', value: 'ALL' },
  { label: '연애', value: 'LOVE' },
  { label: '음식', value: 'FOOD' },
  { label: '기타', value: 'ETC' },
] as const

function BalancePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [votes, setVotes] = useState<Vote[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadingRef = useRef<HTMLDivElement>(null)

  const category = searchParams.get('category') || 'ALL'
  const sort = (searchParams.get('sort') as 'latest' | 'popular') || 'latest'

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
  }, [category, sort])

  return (
    <div className="flex min-h-screen flex-col bg-background pb-24">
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

      <div className="flex flex-col gap-3 px-4 pt-4">
        {error && (
          <p className="typo-body-b-01 py-8 text-center text-destructive">
            {error}
          </p>
        )}
        {!error && !loading && votes.length === 0 && (
          <p className="typo-body-b-01 py-8 text-center text-brand-gray-100">
            해당 카테고리의 밸런스게임이 아직 없어요
          </p>
        )}
        {votes.map((vote) => (
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

export default function BalancePage() {
  return (
    <Suspense fallback={null}>
      <BalancePageContent />
    </Suspense>
  )
}
