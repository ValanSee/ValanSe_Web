'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { fetchProfileThunk } from '@/store/thunks/memberThunks'
import { getAccessToken } from '@/utils/tokenUtils'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_WIDE } from '@/constants/layout'

interface MainPageProps {
  /** 서버 조회 결과. undefined 면 서버 조회 실패 → 클라이언트에서 조회 */
  initialFeatured?: TrendingVoteItem | null
  initialLatest?: Vote[]
}

const MainPage = ({ initialFeatured, initialLatest }: MainPageProps) => {
  const [featured, setFeatured] = useState<TrendingVoteItem | null>(
    initialFeatured ?? null,
  )
  const [latest, setLatest] = useState<Vote[]>(initialLatest ?? [])
  const { isReported } = useReportedContent()
  const dispatch = useAppDispatch()
  const router = useRouter()

  // 예전 `/` 인증 분기 화면의 역할: 로그인했지만 프로필(온보딩) 미완료면 온보딩으로.
  // 화면은 막지 않고 백그라운드에서 확인
  useEffect(() => {
    if (!getAccessToken()) return
    let cancelled = false
    dispatch(fetchProfileThunk())
      .then((profile) => {
        // 응답 전에 홈을 떠났으면 이동하지 않음
        if (!cancelled && !profile) router.replace('/onboarding')
      })
      .catch(() => {
        // 조회 실패는 무시하고 공개 홈 유지. 토큰 무효(재발급 실패)는 authApi 인터셉터가
        // 토큰 삭제 후 /entry 로 보냄. 여기서 /entry 로 보내면 "로그인 없이 둘러보기"(→ /)와 왕복함
      })
    return () => {
      cancelled = true
    }
  }, [dispatch, router])

  // 내가 신고한 투표는 관리자 처리 전까지 목록에서 아예 감춘다
  const visibleFeatured =
    featured && !isReported('VOTE', featured.voteId) ? featured : null
  const visibleLatest = latest.filter((v) => !isReported('VOTE', v.id))

  useEffect(() => {
    if (initialFeatured === undefined) {
      fetchTrendingVotes(7)
        .then((res) => setFeatured(res?.votes[0] ?? null))
        .catch(() => {})
    }
    if (initialLatest === undefined) {
      fetchVotes({ category: 'ALL', sort: 'latest', size: 3 })
        .then((data) => setLatest(data.votes))
        .catch(() => {})
    }
  }, [initialFeatured, initialLatest])

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col bg-card pb-24 lg:gap-ds-6',
        DESKTOP_PAGE_WIDE,
      )}
    >
      {/* PC 에서는 상단 GNB 에 로고가 있어 숨김 */}
      <Header
        className="lg:hidden"
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

      {/* 모바일은 로고 헤더뿐이라 화면에 숨기고, PC 에선 소개 문구로 노출 */}
      <div className="sr-only lg:not-sr-only lg:flex lg:flex-col lg:gap-ds-1">
        <h1 className="typo-heading-03 text-foreground">
          밸런스게임, 둘 중 하나를 골라보세요
        </h1>
        <p className="typo-body-b-01 text-brand-gray-200">
          지금 뜨고 있는 질문에 투표하고 다른 사람들의 선택을 확인해 보세요.
        </p>
      </div>

      {/* PC: 뜨고 있는 밸런스 | 카테고리 2단 */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-ds-6">
        {/* 뜨고 있는 밸런스 */}
        <section className="flex flex-col gap-3 px-4 pt-4 lg:rounded-2xl lg:bg-card lg:p-ds-6 lg:shadow-[0_0_4px_rgba(0,0,0,0.06)]">
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
        <section className="mt-6 flex flex-col gap-3 border-b-8 border-brand-gray-50 bg-card py-5 lg:mt-0 lg:rounded-2xl lg:border-b-0 lg:p-ds-6 lg:shadow-[0_0_4px_rgba(0,0,0,0.06)]">
          <div className="px-4 lg:px-0">
            <SectionHeader title="이런 주제는 어때요?" moreHref="/topics" />
          </div>
          <HorizontalScroll
            shadowClassName="lg:hidden"
            className="flex gap-4 px-4 lg:grid lg:grid-cols-3 lg:gap-ds-4 lg:px-0"
          >
            {CATEGORIES.map((c, index) => (
              <Link
                key={c.param}
                href={`/balanse?category=${c.param}`}
                style={{ animationDelay: `${index * 50}ms` }}
                className="flex shrink-0 flex-col items-center gap-2 transition-transform duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-both active:scale-95"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gray-50">
                  <Icon icon={c.icon} width={32} aria-hidden />
                </span>
                <span className="typo-title-03 text-foreground">{c.label}</span>
              </Link>
            ))}
          </HorizontalScroll>
        </section>
      </div>

      {/* 올라오고 있는 밸런스 */}
      <section className="mt-4 flex flex-col gap-3 px-4 lg:mt-0 lg:px-0">
        <SectionHeader title="올라오고 있는 밸런스" moreHref="/balanse" />
        {visibleLatest.length === 0 ? (
          <EmptyState text="아직 올라온 밸런스가 없어요" />
        ) : (
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-ds-4">
            {visibleLatest.map((v, index) => (
              <div
                key={v.id}
                className="duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <BalanseVoteCard data={v} />
              </div>
            ))}
          </div>
        )}
      </section>

      <BottomNavBar />
    </div>
  )
}

export default MainPage
