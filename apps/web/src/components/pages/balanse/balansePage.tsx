'use client'

import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/_shared/header'
import { getCategoryIntro } from '@/constants/categoryIntro'
import { TabBar, TabItem } from '@/components/ui/tabBar'
import { fetchVotes } from '@/api/pages/valanse/balanseListapi'
import type { Vote, VoteListResponse } from '@/types/balanse/vote'
import { useReportedContent } from '@/hooks/utils/useReportedContent'
import { useSlideDirection } from '@/hooks/utils/useSlideDirection'
import { slideInClass } from '@/lib/slideTransition'
import { BalanseListSkeleton } from '@/components/_shared/skeleton/balanseListSkeleton'
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
  const searchParams = useSearchParams()
  const [votes, setVotes] = useState<Vote[]>(initialData?.votes ?? [])
  // 지금 votes 가 어떤 목록(listKey)의 것인지. 다르면 새 목록을 받는 중
  const [votesKey, setVotesKey] = useState<string | null>(
    initialData?.key ?? null,
  )
  const [error, setError] = useState<string | null>(null)
  const [hasNextPage, setHasNextPage] = useState(
    initialData?.has_next_page ?? false,
  )
  const [nextCursor, setNextCursor] = useState<string | undefined>(
    initialData?.next_cursor,
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadingRef = useRef<HTMLDivElement>(null)
  // 목록 세대. 동기화 effect 가 돌 때마다(목록이 바뀔 때마다) 1 증가.
  // listKey 비교만으로는 A→B→A 로 돌아온 뒤 A 의 옛 다음 페이지가 섞이므로 세대로 구분한다
  const listGenRef = useRef(0)

  const category = searchParams.get('category') || 'ALL'
  const sort = (searchParams.get('sort') as 'latest' | 'popular') || 'latest'
  // 크롤러용 다음 페이지(?cursor=)로 들어온 경우 그 지점부터 목록을 이어 보여준다
  const cursor = parseBalanseCursor(searchParams.get('cursor'))
  const listKey = balanseListKey(category, sort, cursor)
  // votes 가 지금 카테고리 것이 아니면(받는 중 · 실패) 이전 목록은 보이지 않는다
  const votesSynced = votesKey === listKey
  // 서버가 내려준 첫 페이지와 같은 목록이면 effect 동기화를 기다리지 않고 바로 그린다
  // (PC 사이드바 링크 이동 · 처음 카테고리로 뒤로가기 때 스켈레톤이 한 프레임 비치지 않게)
  const serverVotes =
    !votesSynced && initialData?.key === listKey ? initialData.votes : null
  const listReady = votesSynced || !!serverVotes
  const categorySlideClass = useSlideDirection(
    TABS.findIndex((t) => t.value === category),
  )
  // 마지막 변경이 정렬이면 목록이 다시 마운트돼도 직전 카테고리 슬라이드를 재생하지 않고 페이드만
  const [lastChange, setLastChange] = useState({
    category,
    sort,
    by: 'category' as 'category' | 'sort',
  })
  if (lastChange.category !== category || lastChange.sort !== sort) {
    setLastChange({
      category,
      sort,
      by: lastChange.category !== category ? 'category' : 'sort',
    })
  }
  const listSlideClass =
    lastChange.by === 'sort' ? slideInClass(null) : categorySlideClass

  const { isReported } = useReportedContent()
  // 내가 신고한 투표는 관리자 처리 전까지 목록에서 아예 감춘다
  const visibleVotes = (serverVotes ?? votes).filter(
    (v) => !isReported('VOTE', v.id),
  )

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
    // 다른 카테고리는 첫 페이지부터 (?cursor= 로 들어온 경우)
    params.delete('cursor')
    // 서버 왕복(loading.tsx 전체 덮기) 없이 URL 만 바꾼다. Next 가 useSearchParams 와 동기화하고
    // 아래 effect 가 목록만 받아온다. PC 사이드바 링크 · 직접 접속은 그대로 서버 렌더링
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage || !nextCursor) return
    const requestGen = listGenRef.current
    try {
      setIsLoadingMore(true)
      const data = await fetchVotes({
        category,
        sort,
        cursor: nextCursor,
        size: 5,
      })
      // 받는 사이 목록이 바뀌었으면(같은 카테고리로 돌아왔어도) 이전 목록의 다음 페이지는 버린다
      if (listGenRef.current !== requestGen) return
      setVotes((prev) => [...prev, ...data.votes])
      setHasNextPage(data.has_next_page)
      setNextCursor(data.next_cursor)
    } catch {
      // 받는 사이 목록이 바뀌었으면 이전 목록의 실패도 새 목록에 띄우지 않는다
      if (listGenRef.current !== requestGen) return
      setError('추가 데이터를 불러오지 못했습니다.')
    } finally {
      // 버려진 요청은 로딩 상태를 건드리지 않는다. 세대가 바뀔 때 effect 가 이미 풀었고,
      // 그 뒤 새 목록이 시작한 요청의 로딩을 여기서 풀면 같은 커서로 중복 요청이 나갈 수 있다
      if (listGenRef.current === requestGen) setIsLoadingMore(false)
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
    // 목록이 다시 마운트되면(카테고리 전환) 새 감시 대상을 붙인다
  }, [loadMore, hasNextPage, isLoadingMore, votesSynced])

  useEffect(() => {
    // 새 목록 세대 시작: 진행 중이던 다음 페이지 요청은 버려지므로 로딩 상태를 여기서 푼다
    listGenRef.current += 1
    setIsLoadingMore(false)
    // 서버가 내려준 첫 페이지(직접 접속 · PC 사이드바 링크 · 처음 카테고리로 뒤로가기)와 일치하면 재조회 생략
    if (initialData?.key === listKey) {
      setVotes(initialData.votes)
      setHasNextPage(initialData.has_next_page)
      setNextCursor(initialData.next_cursor)
      setVotesKey(listKey)
      setError(null)
      return
    }

    // 빠르게 연달아 바꾸면 이전 요청은 버리고 마지막 요청만 반영
    let cancelled = false
    const load = async () => {
      try {
        setError(null)
        const data = await fetchVotes({ category, sort, cursor, size: 5 })
        if (cancelled) return
        setVotes(data.votes)
        setHasNextPage(data.has_next_page)
        setNextCursor(data.next_cursor)
        setVotesKey(listKey)
      } catch {
        if (!cancelled) setError('불러오기 실패')
      }
    }
    load()
    return () => {
      cancelled = true
    }
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

      <TabBar className="lg:hidden">
        {TABS.map((tab) => (
          <TabItem
            key={tab.value}
            label={tab.label}
            selected={tab.value === category}
            onClick={() => updateCategory(tab.value)}
          />
        ))}
      </TabBar>

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

          {/* 카드 제목(h3)이 h1 바로 아래로 건너뛰지 않도록 목록 구획 제목 (홈에서는 섹션 h2 가 이 역할) */}
          <h2 className="sr-only">밸런스게임 목록</h2>
          {!listReady ? (
            error ? (
              <p className="typo-body-b-01 px-4 py-8 text-center text-destructive">
                {error}
              </p>
            ) : (
              <BalanseListSkeleton />
            )
          ) : (
            // 카테고리가 바뀌면 다시 마운트돼 탭 순서 방향으로 슬라이드
            <div
              key={category}
              className={cn(
                'flex flex-col gap-3 px-4 pt-4 lg:grid lg:grid-cols-2 lg:gap-ds-4 lg:px-0 lg:pt-0',
                listSlideClass,
                // 방향 슬라이드는 모바일 탭 전용. PC 는 기존처럼 카드별 등장 애니메이션 (! 로 lg:animate-fade-only 보다 우선)
                'lg:!animate-none',
              )}
            >
              {/* 다음 페이지 실패 등은 목록 위에 표시 */}
              {error && (
                <p className="typo-body-b-01 py-8 text-center text-destructive lg:col-span-2">
                  {error}
                </p>
              )}
              {!error && visibleVotes.length === 0 && (
                <p className="typo-body-b-01 py-8 text-center text-brand-gray-100 lg:col-span-2">
                  해당 카테고리의 밸런스게임이 아직 없어요
                </p>
              )}
              {visibleVotes.map((vote, index) => (
                <div
                  key={vote.id}
                  className="lg:duration-300 lg:animate-in lg:fade-in lg:slide-in-from-bottom-2 lg:fill-mode-both"
                  style={{ animationDelay: `${Math.min(index, 6) * 50}ms` }}
                >
                  <BalanseVoteCard data={vote} />
                </div>
              ))}
              {/* 다음 페이지 커서는 동기화된 뒤에만 (이전 목록 커서로 불러오지 않게) */}
              {votesSynced && hasNextPage && (
                <div
                  ref={loadingRef}
                  className="py-4 text-center lg:col-span-2"
                >
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
          )}
        </div>
      </div>
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
