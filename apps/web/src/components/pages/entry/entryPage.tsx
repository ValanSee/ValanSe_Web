'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Header from '@/components/_shared/header'
import { validateLoginOrigin } from '@/utils/authRedirect'
import KakaoLoginButton from './_components/kakaoLoginButton'

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
    // PC: 회색 배경 가운데 로그인 카드
    <div className="flex min-h-screen flex-col bg-card lg:min-h-0 lg:flex-1 lg:items-center lg:justify-center lg:bg-transparent lg:py-ds-10">
      {/* 로그인 필요 기능에서 진입 시 막다른 길이 되지 않도록 뒤로가기 제공.
          페이지 안 동작(좋아요 등)에서 push 로 왔으면 원래 화면으로 back.
          보호 페이지(/my 등)로 back 하면 가드가 다시 entry 로 보내 루프가 나므로
          그 외에는 공개 홈으로 확실히 탈출시킨다. PC 에선 GNB 로 이동할 수 있어 숨김 */}
      <Header
        className="lg:hidden"
        showBackButton
        onBackClick={() => (canGoBack ? router.back() : router.replace('/'))}
      />
      <div className="flex flex-1 flex-col items-center justify-between px-6 pb-10 pt-6 text-center lg:w-[420px] lg:flex-none lg:justify-center lg:gap-ds-10 lg:rounded-2xl lg:bg-card lg:p-ds-10 lg:shadow-[0_0_4px_rgba(0,0,0,0.06)]">
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
            <p className="typo-body-b-01 text-brand-gray-200">
              밸런스 게임에 진심인 사람들을 위한
              <br />
              밸런스 게임 플랫폼
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
