'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function MyProfileSection() {
  const router = useRouter()

  return (
    <section className="bg-white px-4 py-6 border-b">
      {/* 타이틀 */}
      <div className="flex items-center py-2.5">
        <h1 className="text-2xl font-bold">내 정보</h1>
      </div>
      {/* 프로필 */}
      <div className="flex items-center gap-4 pt-4">
        <Image
          src="/file.svg"
          alt="프로필 이미지"
          width={84}
          height={84}
          className="rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm text-gray-500">안녕하세요!</p>
          <p className="text-lg font-semibold">dinopark47 님</p>
        </div>
      </div>

      <div className="text-md text-gray-700">
        {/* 연결된 계정 */}
        <div className="flex items-center justify-between pt-8 h-20">
          <div>
            <div className="font-bold">연결된 계정</div>
            <div className="text-gray-500">park987@naver.com</div>
          </div>
          <div className="font-medium">카카오</div>
        </div>

        {/* 회원 정보 */}
        <div className="flex items-center justify-between pt-5 h-17">
          <div className="text-md text-gray-700">
            <div className="font-bold">회원 정보</div>
            <div className="font-medium">남성 · 30대 · ENFP</div>
          </div>
          {/* 수정 버튼 */}
          <button
            onClick={() => router.push('/my/edit')}
            className="text-sm text-gray-400 hover:text-black"
          >
            수정
          </button>
        </div>
      </div>
    </section>
  )
}
