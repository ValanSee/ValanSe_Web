'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Loading from '@/components/_shared/loading'
import Header from '@/components/_shared/header'
import SearchIconButton from '@/components/_shared/searchIconButton'
import { IconButton } from '@/components/ui/iconButton'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import {
  fetchMypageDataThunk,
  fetchPointHistoryThunk,
  fetchTitlesThunk,
} from '@/store/thunks/memberThunks'
import { logoutThunk } from '@/store/thunks/authThunks'
import { entryHrefWithRedirect } from '@/utils/authRedirect'

const parseGender = (g: string) =>
  g === 'MALE' ? '남성' : g === 'FEMALE' ? '여성' : '기타'

const parseAge = (a: string) =>
  ({
    TEN: '10대',
    TWENTY: '20대',
    THIRTY: '30대',
    OVER_FOURTY: '40대',
  })[a as string] ?? '기타'

function MyPage() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const mypageData = useAppSelector((s) => s.member.mypageData)
  const pointHistory = useAppSelector((s) => s.member.pointHistory)
  const titles = useAppSelector((s) => s.member.titles)

  useEffect(() => {
    if (!mypageData) {
      void (async () => {
        try {
          await dispatch(fetchMypageDataThunk())
        } catch {
          router.replace(entryHrefWithRedirect(pathname))
        }
      })()
    }
  }, [dispatch, mypageData, pathname, router])

  useEffect(() => {
    if (!pointHistory) void dispatch(fetchPointHistoryThunk()).catch(() => {})
  }, [dispatch, pointHistory])

  useEffect(() => {
    if (!titles) void dispatch(fetchTitlesThunk()).catch(() => {})
  }, [dispatch, titles])

  if (!mypageData) return <Loading />

  const point = pointHistory?.[0]?.remainingPoint ?? null
  const equippedTitle =
    titles &&
    [...titles.defaultTitles, ...titles.ownedTitles].find((t) => t.equipped)

  const handleLogout = async () => {
    await dispatch(logoutThunk())
    router.push('/entry')
  }

  return (
    <div className="flex min-h-screen flex-col bg-card pb-24">
      <Header title="마이" trailing={<SearchIconButton />} />

      {/* 프로필 */}
      <section className="flex items-center gap-4 bg-card px-5 py-6">
        <Image
          src={mypageData.profile_image_url || '/file.svg'}
          alt="프로필 이미지"
          width={72}
          height={72}
          className="h-[72px] w-[72px] rounded-full bg-brand-gray-75 object-cover"
        />
        <div className="flex flex-1 flex-col gap-1">
          <p className="typo-heading-05 text-foreground">
            {mypageData.nickname}
          </p>
          <p className="typo-body-c-01 text-brand-gray-100">
            {parseGender(mypageData.gender)} · {parseAge(mypageData.age)} ·{' '}
            {mypageData.mbti}
          </p>
        </div>
        <IconButton
          icon="weui:setting-filled"
          label="프로필 설정"
          onClick={() => router.push('/my/edit')}
        />
      </section>

      {/* 활동 요약 (Figma 3열 stats 카드) */}
      <section className="px-5 pb-4">
        <div className="grid grid-cols-3 divide-x divide-brand-gray-75 rounded-2xl border border-brand-gray-75 bg-card py-4">
          <StatCell label="내 게임" href="/my/created" />
          <StatCell label="투표한 게임" href="/my/voted" />
          <StatCell label="작성한 댓글" href="/my/comment" />
        </div>
      </section>

      {/* 포인트 & 칭호 요약 */}
      <section className="grid grid-cols-2 gap-3 px-5 pb-4">
        <button
          type="button"
          onClick={() => router.push('/my/point')}
          className="flex flex-col items-start gap-1 rounded-2xl bg-card p-4 text-left shadow-[0_0_4px_rgba(0,0,0,0.06)]"
        >
          <span className="typo-body-c-01 text-brand-gray-100">내 포인트</span>
          <span className="typo-title-01 text-primary">
            {point !== null ? `${point.toLocaleString()}P` : '-P'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => router.push('/my/titles')}
          className="flex flex-col items-start gap-1 rounded-2xl bg-card p-4 text-left shadow-[0_0_4px_rgba(0,0,0,0.06)]"
        >
          <span className="typo-body-c-01 text-brand-gray-100">내 칭호</span>
          <span className="typo-title-01 text-foreground">
            {equippedTitle ? equippedTitle.title : '미장착'}
          </span>
        </button>
      </section>

      {/* 내 활동 */}
      <section className="flex flex-col gap-1 bg-card px-5 py-4">
        <h2 className="typo-title-03 pb-2 text-brand-gray-200">내 활동</h2>
        {[
          { href: '/my/created', label: '내가 만든 밸런스 게임' },
          { href: '/my/voted', label: '내가 투표한 밸런스 게임' },
          { href: '/my/comment', label: '내가 작성한 댓글' },
        ].map((item) => (
          <button
            key={item.href}
            type="button"
            onClick={() => router.push(item.href)}
            className="typo-label-01 flex items-center justify-between py-3 text-foreground"
          >
            {item.label}
            <Icon
              icon="icon-park-outline:right"
              className="text-brand-gray-100"
              width={20}
              aria-hidden
            />
          </button>
        ))}
      </section>

      <div className="h-2 bg-brand-gray-50" />

      {/* 계정 관리 */}
      <section className="flex flex-col gap-1 bg-card px-5 py-4">
        <h2 className="typo-title-03 pb-2 text-brand-gray-200">계정 관리</h2>
        <button
          type="button"
          onClick={handleLogout}
          className="typo-label-01 py-3 text-left text-foreground"
        >
          로그아웃
        </button>
        <button
          type="button"
          onClick={() => router.push('/account-deletion')}
          className="typo-label-01 py-3 text-left text-brand-gray-100"
        >
          탈퇴하기
        </button>
      </section>

      <BottomNavBar />
    </div>
  )
}

function StatCell({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-1"
    >
      <span className="typo-body-c-01 text-brand-gray-100">{label}</span>
      <span className="typo-title-02 text-foreground">-</span>
    </Link>
  )
}

export default MyPage
