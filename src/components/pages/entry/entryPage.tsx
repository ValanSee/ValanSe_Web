'use client'

import Image from 'next/image'
import Divider from './_components/divider'
import KakaoLoginButton from './_components/kakaoLoginButton'

function EntryPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center items-center px-6 py-10 text-center">
      {/* 로고 영역 */}
      <div className="flex flex-col items-center mb-6">
        <Image
          src="/assets/logo.svg"
          alt="Valanse Logo"
          width={104}
          height={96}
          className="mb-2"
        />
        <h1 className="text-2xl font-bold text-[#5B6B8A]">VALANSE</h1>
      </div>

      {/* 설명 */}
      <p className="text-sm text-gray-700 mb-12">
        밸런스 게임에 진심인 사람들을 위한
        <br />
        밸런스 게임 플랫폼
      </p>

      <div className="w-full max-w-xs">
        {/* 카카오 로그인 버튼 */}
        <KakaoLoginButton />

        {/* 구분선 텍스트 */}
        <Divider />

        {/* 로그인 없이 시작하기 */}
        <button className="w-full max-w-xs bg-white/60 text-gray-600 border border-gray-300 py-3 rounded-xl font-medium hover:bg-white/80">
          로그인 없이 시작하기
        </button>
      </div>
    </div>
  )
}

export default EntryPage
