'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import KakaoLoginButton from './_components/kakaoLoginButton'

function EntryPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-card">
      {/* 시안에 헤더/뒤로가기가 없어 제거. 보호 페이지에서 튕겨온 경우의
          탈출로는 하단 '로그인 없이 시작하기'(→ /main)가 담당한다. */}
      {/* 상하 여백(시안 146px)은 고정하지 않고 justify-center가 만들어낸다.
          pt/pb는 작은 화면에서 가장자리에 닿지 않도록 하는 최소 여백. */}
      <div className="flex flex-1 flex-col items-center justify-center gap-[76px] px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-8 text-center">
        {/* 로고 & 슬로건 */}
        <div className="flex flex-col items-center justify-center gap-7">
          {/* 로고 이미지가 워드마크를 포함하므로 제목은 스크린리더 전용으로 둔다 */}
          <h1 className="sr-only">VALANSE</h1>
          <Image
            src="/assets/logo-lockup.svg"
            alt=""
            width={244}
            height={244}
            priority
          />
          <p className="typo-body-c-03 text-brand-black">
            밸런스 게임에 진심인 사람들을 위한
            <br />
            밸런스 게임 플랫폼
          </p>
        </div>

        {/* CTA 영역 */}
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <Suspense
            fallback={
              <div className="typo-label-02 flex h-14 w-full items-center justify-center rounded-xl bg-brand-kakao/60 font-semibold text-brand-gray-200">
                시작 준비 중…
              </div>
            }
          >
            <KakaoLoginButton />
          </Suspense>
          <Link href="/main" className="typo-label-03 text-brand-gray-300">
            로그인 없이 시작하기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EntryPage
