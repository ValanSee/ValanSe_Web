'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Header from '@/components/_shared/header'
import { getCategoryIntro } from '@/constants/categoryIntro'
import { TabBar, TabItem } from '@/components/ui/tabBar'
import { fetchVotes } from '@/api/pages/valanse/balanseListapi'
import type { Vote, VoteListResponse } from '@/types/balanse/vote'
import { useReportedContent } from '@/hooks/utils/useReportedContent'
import BalanseVoteCard from './balanseVoteCard'
import HotTrendingBar from './hotTrendingBar'
import { CATEGORIES, getCategoryMeta } from '@/constants/category'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_WIDE } from '@/constants/layout'
import {
  balanseListHref,
  balanseListKey,
  parseBalanseCursor,
} from '@/utils/balanseList'

const TABS = [
  { label: '전체', value: 'ALL' as const },
  ...CATEGORIES.map((c) => ({ label: c.label, value: c.param })),
]

const SORTS = [
  { label: '최신순', value: 'latest' as const },
  { label: '인기순', value: 'popular' as const },
]

/** 서버에서 비로그인으로 조회한 첫 페이지. key 는 balanseListKey(category, sort, cursor) */
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
  // 크롤러용 다음 페이지(?cursor=)로 들어온 경우 그 지점부터 목록을 이어 보여준다
  const cursor = parseBalanseCursor(searchParams.get('cursor'))
  const listKey = balanseListKey(category, sort, cursor)

  const { isReported } = useReportedContent()
  // 내가 신고한 투표는 관리자 처리 전까지 목록에서 아예 감춘다
  const visibleVotes = votes.filter((v) => !isReported('VOTE', v.id))

  // PC 사이드바는 크롤러가 따라가도록 버튼 대신 링크로 이동
  // utm 등 다른 쿼리는 빼고 category · sort 만 유지
  const hrefWith = (key: 'category' | 'sort', value: string) => {
    const params = new URLSearchParams({ category, sort })
    params.set(key, value)
    return `/balanse?${params.toString()}`
  }
  const categoryLabel = getCategoryMeta(category)?.label

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
    if (initialData?.key === listKey) {
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
        const data = await fetchVotes({ category, sort, cursor, size: 5 })
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
  }, [category, sort, cursor, listKey, initialData])

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col bg-card pb-24',
        DESKTOP_PAGE_WIDE,
      )}
    >
      {/* 모바일 헤더는 화면 제목만, 페이지 h1 은 아래 카테고리 제목 하나로 */}
      <Header className="lg:hidden" titleAs="p" title="밸런스 게임" />

      <div className="lg:hidden">
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
      </div>

      <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-ds-8">
        {/* PC: 카테고리 · 정렬 사이드바 */}
        <aside className="hidden flex-col gap-ds-4 lg:sticky lg:top-24 lg:flex">
          <SideNav
            title="카테고리"
            items={TABS.map((tab) => ({
              label: tab.label,
              href: hrefWith('category', tab.value),
              active: tab.value === category,
            }))}
          />
          <SideNav
            title="정렬"
            items={SORTS.map((s) => ({
              label: s.label,
              href: hrefWith('sort', s.value),
              active: s.value === sort,
            }))}
          />
        </aside>

        <div className="flex min-w-0 flex-col lg:gap-ds-4">
          {/* 모바일에선 시각적으로 숨기되 크롤러·스크린리더용으로 유지 */}
          <h1 className="typo-heading-04 sr-only text-foreground lg:not-sr-only">
            {categoryLabel ? `${categoryLabel} 밸런스게임` : '밸런스게임 모음'}
          </h1>
          {/* 카테고리 소개 (meta description 과 같은 문장, 검색어 노출용) */}
          <p className="typo-body-c-01 px-4 py-3 text-brand-gray-100 lg:p-0">
            {getCategoryIntro(category)}
          </p>

          <div className="lg:overflow-hidden lg:rounded-2xl empty:hidden lg:shadow-[0_0_4px_rgba(0,0,0,0.06)] lg:[&>div]:border-b-0">
            <HotTrendingBar />
          </div>

          {cursor && (
            <Link
              href={balanseListHref({ category, sort })}
              className="typo-label-02 flex items-center gap-1 px-4 pt-4 text-brand-gray-200 lg:px-0 lg:pt-0"
            >
              ← 처음부터 보기
            </Link>
          )}

          <div className="flex flex-col gap-3 px-4 pt-4 lg:grid lg:grid-cols-2 lg:gap-ds-4 lg:px-0 lg:pt-0">
            {error && (
              <p className="typo-body-b-01 py-8 text-center text-destructive lg:col-span-2">
                {error}
              </p>
            )}
            {!error && !loading && visibleVotes.length === 0 && (
              <p className="typo-body-b-01 py-8 text-center text-brand-gray-100 lg:col-span-2">
                해당 카테고리의 밸런스게임이 아직 없어요
              </p>
            )}
            {visibleVotes.map((vote, index) => (
              <div
                key={vote.id}
                className="duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                style={{ animationDelay: `${Math.min(index, 6) * 50}ms` }}
              >
                <BalanseVoteCard data={vote} />
              </div>
            ))}
            {hasNextPage && (
              <div ref={loadingRef} className="py-4 text-center lg:col-span-2">
                {isLoadingMore ? (
                  <p className="typo-body-c-02 text-brand-gray-100">
                    불러오는 중…
                  </p>
                ) : (
                  // 무한 스크롤을 못 하는 크롤러가 다음 목록(상세 링크)으로 이어가도록 실제 링크로 둔다
                  nextCursor && (
                    <Link
                      href={balanseListHref({
                        category,
                        sort,
                        cursor: nextCursor,
                      })}
                      rel="next"
                      className="typo-body-c-02 text-brand-gray-100 underline-offset-2 hover:underline"
                    >
                      다음 밸런스게임 보기
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavBar />
    </div>
  )
}

function SideNav({
  title,
  items,
}: {
  title: string
  items: { label: string; href: string; active: boolean }[]
}) {
  return (
    <nav
      aria-label={title}
      className="flex flex-col gap-ds-2 rounded-2xl bg-card p-ds-4 shadow-[0_0_4px_rgba(0,0,0,0.06)]"
    >
      <h2 className="typo-label-03 px-ds-2 text-brand-gray-100">{title}</h2>
      <ul className="flex flex-col">
        {items.map(({ label, href, active }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'typo-title-03 block rounded-lg px-ds-2 py-ds-2 transition-colors',
                active
                  ? 'bg-brand-violet-50 text-primary'
                  : 'text-foreground hover:bg-brand-gray-50',
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function BalancePage({ initialData }: BalancePageProps) {
  return (
    <Suspense fallback={null}>
      <BalancePageContent initialData={initialData} />
    </Suspense>
  )
}
