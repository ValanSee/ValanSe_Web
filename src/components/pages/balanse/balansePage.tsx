'use client'
import Header from './header'
import MockPollCard from './trending-section/mockPollCard'
import FilterTabs from './filtertabs'
import BalanceList from './balanseList'
import { fetchVotes } from '../../../api/pages/valanse/balanseListapi'
import { useEffect, useState, Suspense, useCallback, useRef } from 'react'
import { Vote } from '@/types/balanse/vote'
import { useRouter, useSearchParams } from 'next/navigation'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Loading from '@/components/_shared/loading'
import React from 'react'
import { SectionHeader } from './trending-section/sectionHeader'
import { PinButton } from './trending-section/pinButton'
import { fetchTrendingVotes } from '@/api/pages/valanse/trendingVoteApi'
import { TrendingVoteResponse } from '@/api/pages/valanse/trendingVoteApi'

const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
]

function BalancePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [votes, setVotes] = useState<Vote[]>([])
  const [trendingVote, setTrendingVote] = useState<TrendingVoteResponse>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // URL에서 카테고리와 정렬 옵션 가져오기
  const category = searchParams.get('category') || 'ALL'
  const sort = (searchParams.get('sort') as 'latest' | 'popular') || 'latest'

  // URL 업데이트 함수
  const updateURL = (newCategory?: string, newSort?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newCategory) {
      params.set('category', newCategory)
    }
    if (newSort) {
      params.set('sort', newSort)
    }

    router.push(`?${params.toString()}`)
  }

  // 카테고리 변경
  const handleCategoryChange = (newCategory: string) => {
    updateURL(newCategory)
  }

  // 정렬 변경
  const handleSortChange = (newSort: 'latest' | 'popular') => {
    updateURL(undefined, newSort)
  }

  // 무한 스크롤 콜백
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

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 },
    )

    if (loadingRef.current) {
      observer.observe(loadingRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMore, hasNextPage, isLoadingMore])

  // 초기 데이터 로드
  useEffect(() => {
    const getVotes = async () => {
      try {
        setLoading(true)
        setError(null)

        // 최소 0.8초 로딩 시간 보장
        const startTime = Date.now()
        const data = await fetchVotes({ category, sort, size: 5 })
        const elapsedTime = Date.now() - startTime
        const remainingTime = Math.max(0, 800 - elapsedTime)

        await new Promise((resolve) => setTimeout(resolve, remainingTime))

        setVotes(data.votes)
        setHasNextPage(data.has_next_page)
        setNextCursor(data.next_cursor)
      } catch {
        setError('불러오기 실패')
      } finally {
        setLoading(false)
      }
    }
    getVotes()
  }, [category, sort])

  // 인기 급상승 토픽 불러오기
  useEffect(() => {
    const getTrendingVote = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await fetchTrendingVotes()
        setTrendingVote(data)
      } catch (_) {
        setError('불러오기 실패')
      } finally {
        setLoading(false)
      }
    }
    getTrendingVote()
  }, [])

  // 초기 로딩 중일 때는 전체 화면 로딩
  if (loading || votes.length === 0 || !trendingVote) {
    return <Loading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      <Header />

      {/* 인기 급상승 토픽 섹션 */}
      <div className="px-4">
        <div className="flex items-center justify-between">
          <SectionHeader />
          <PinButton pinType={trendingVote.pinType} />
        </div>
        <MockPollCard data={trendingVote} />
      </div>

      {/* 투표 목록 섹션 */}
      <div className="flex items-center gap-2 px-4 mt-2">
        <FilterTabs
          selected={category}
          onChangeCategory={handleCategoryChange}
        />
        <select
          className="ml-auto rounded px-2 py-1 text-sm"
          value={sort}
          onChange={(e) =>
            handleSortChange(e.target.value as 'latest' | 'popular')
          }
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="px-4 mt-4 space-y-4 pb-28">
        {error && (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-xl font-bold text-red-500 mb-2">⚠️</p>
            <p className="text-lg font-semibold text-gray-700">{error}</p>
          </div>
        )}
        {!error &&
          votes.map((vote, idx) => (
            <React.Fragment key={vote.id}>
              <BalanceList data={vote} />
              {idx !== votes.length - 1 && (
                <div className="h-px bg-[#E5E5E5] w-full my-2" />
              )}
            </React.Fragment>
          ))}

        {/* 무한 스크롤 로딩 인디케이터 */}
        {hasNextPage && (
          <div ref={loadingRef} className="text-center py-4">
            {isLoadingMore && (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4D7298] mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  더 많은 투표를 불러오는 중...
                </p>
              </>
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
    <Suspense fallback={<Loading />}>
      <BalancePageContent />
    </Suspense>
  )
}
