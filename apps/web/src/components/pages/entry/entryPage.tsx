'use client'

import Image from 'next/image'
import { Suspense } from 'react'
// import Divider from './_components/divider'
import KakaoLoginButton from './_components/kakaoLoginButton'

function EntryPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-10 text-center">
      {/* 로고 영역 */}
      <div className="mb-6 flex flex-col items-center">
        <Image
          src="/assets/logo.svg"
          alt="Valanse Logo"
          width={104}
          height={96}
          className="mb-2"
        />
        {/* TODO(design): 로고 워드마크 색은 Figma 확정 시 브랜드 토큰으로 치환 */}
        <h1 className="typo-heading-02 text-[#5B6B8A]">VALANSE</h1>
      </div>

      {/* 설명 */}
      <p className="typo-body-b-02 mb-12 text-brand-gray-200">
        밸런스 게임에 진심인 사람들을 위한
        <br />
        밸런스 게임 플랫폼
      </p>

      <div className="w-full max-w-xs">
        <Suspense
          fallback={
            <div className="mb-4 w-full max-w-xs rounded-xl bg-[#FEE500]/60 py-3 text-center typo-label-03 text-brand-gray-200">
              로그인 준비 중…
            </div>
          }
        >
          <KakaoLoginButton />
        </Suspense>
        {/*
        <Divider />

        <button className="w-full max-w-xs bg-white/60 text-gray-600 border border-gray-300 py-3 rounded-xl font-medium hover:bg-white/80">
          로그인 없이 시작하기
        </button>
        */}
      </div>
    </div>
  )
}

export default EntryPage
