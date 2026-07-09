'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import KakaoLoginButton from './_components/kakaoLoginButton'

function EntryPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-card px-6 pb-10 pt-20 text-center">
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
        <Suspense
          fallback={
            <div className="typo-label-01 flex h-14 w-full items-center justify-center rounded-xl bg-brand-kakao/60 text-brand-gray-200">
              로그인 준비 중…
            </div>
          }
        >
          <KakaoLoginButton />
        </Suspense>
        <Link
          href="/main"
          className="typo-label-01 text-brand-gray-200"
        >
          로그인 없이 시작하기
        </Link>
      </div>
    </div>
  )
}

export default EntryPage
