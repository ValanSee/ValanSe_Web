'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Header from '@/components/_shared/header'
import { Icon } from '@/components/ui/icon'
import { validateLoginOrigin } from '@/utils/authRedirect'
import KakaoLoginButton from './_components/kakaoLoginButton'

// PC 왼쪽 소개 영역에 보여줄 서비스 장점
const FEATURES = [
  {
    icon: 'heroicons:scale',
    title: '둘 중 하나, 바로 투표',
    description: '고르기 어려운 질문에 투표하고 결과를 바로 확인해요',
  },
  {
    icon: 'tabler:users',
    title: '성별·나이별 통계',
    description: '다른 사람들은 무엇을 골랐는지 한눈에 비교해요',
  },
  {
    icon: 'tabler:share',
    title: '직접 만들고 공유',
    description: '나만의 밸런스 게임을 만들어 친구에게 보내요',
  },
]

function EntryPage() {
  const router = useRouter()
  // 페이지 안 동작에서 push 로 들어왔으면 뒤로가기로 원래 화면에 돌아갈 수 있다
  const [canGoBack, setCanGoBack] = useState(false)
  useEffect(() => setCanGoBack(validateLoginOrigin()), [])

  // 가입 부담을 줄이는 안내 말풍선. 꼬리가 아래 카카오 버튼을 가리킨다
  const signupBubble = (
    <div className="relative -mb-ds-1 rounded-full bg-brand-black px-ds-4 py-ds-2 shadow-md">
      <p className="typo-label-03 text-white">⚡ 30초면 회원가입 완료!</p>
      <span
        aria-hidden
        className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-brand-black"
      />
    </div>
  )

  return (
    // PC: 왼쪽 서비스 소개 + 오른쪽 로그인 카드 2단
    <div className="flex min-h-screen flex-col bg-card lg:mx-auto lg:min-h-0 lg:w-full lg:max-w-[1080px] lg:flex-1 lg:flex-row lg:items-center lg:justify-between lg:gap-ds-10 lg:bg-transparent lg:px-ds-10 lg:py-20">
      {/* 로그인 필요 기능에서 진입 시 막다른 길이 되지 않도록 뒤로가기 제공.
          페이지 안 동작(좋아요 등)에서 push 로 왔으면 원래 화면으로 back.
          보호 페이지(/my 등)로 back 하면 가드가 다시 entry 로 보내 루프가 나므로
          그 외에는 공개 홈으로 확실히 탈출시킨다. PC 에선 GNB 로 이동할 수 있어 숨김 */}
      <Header
        className="lg:hidden"
        showBackButton
        onBackClick={() => (canGoBack ? router.back() : router.replace('/'))}
      />
      {/* PC 전용 서비스 소개. 모바일은 카드 안 슬로건으로 충분해 숨김 */}
      <section className="hidden max-w-[480px] flex-col gap-ds-10 lg:flex">
        <div className="flex flex-col gap-ds-4">
          <p className="typo-label-02 text-primary">VALANSE</p>
          <h2 className="typo-heading-01 text-foreground lg:text-4xl lg:leading-tight">
            밸런스 게임에 진심인
            <br />
            사람들을 위한 플랫폼
          </h2>
          <p className="typo-body-b-01 text-brand-gray-200">
            가볍게 고르고, 다른 사람들의 선택과 비교해 보세요
          </p>
        </div>
        <ul className="flex flex-col gap-ds-6">
          {FEATURES.map(({ icon, title, description }) => (
            <li key={title} className="flex items-center gap-ds-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-violet-50 text-primary">
                <Icon icon={icon} width={24} aria-hidden />
              </span>
              <div className="flex flex-col gap-ds-1">
                <p className="typo-title-02 text-foreground">{title}</p>
                <p className="typo-body-b-02 text-brand-gray-200">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <div className="flex flex-1 flex-col items-center justify-between px-6 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-6 text-center lg:w-[420px] lg:flex-none lg:shrink-0 lg:justify-center lg:gap-ds-10 lg:rounded-2xl lg:bg-card lg:p-ds-10 lg:shadow-[0_0_4px_rgba(0,0,0,0.06)]">
        {/* 로고 & 슬로건 */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <Image
            src="/assets/logo.svg"
            alt="Valanse Logo"
            width={104}
            height={96}
            priority
          />
          <div className="flex flex-col items-center gap-3">
            <h1 className="typo-heading-01 text-primary">VALANSE</h1>
            {/* PC 는 왼쪽 소개와 겹쳐 로그인 안내로 바꿈 */}
            <p className="typo-body-b-01 text-brand-gray-200 lg:hidden">
              밸런스 게임에 진심인 사람들을 위한
              <br />
              밸런스 게임 플랫폼
            </p>
            <p className="typo-body-b-01 hidden text-brand-gray-200 lg:block">
              로그인하고 투표에 참여해 보세요
            </p>
          </div>
        </div>

        {/* CTA 영역 */}
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          {signupBubble}
          <Suspense
            fallback={
              <div className="typo-label-02 flex h-14 w-full items-center justify-center rounded-xl bg-brand-kakao/60 font-semibold text-brand-gray-200">
                시작 준비 중…
              </div>
            }
          >
            <KakaoLoginButton />
          </Suspense>
          <Link href="/" className="typo-label-03 text-brand-gray-200">
            로그인 없이 둘러보기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EntryPage
