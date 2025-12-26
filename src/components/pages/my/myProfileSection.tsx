// 수정된 MyProfileSection.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import Loading from '@/components/_shared/loading'

export default function MyProfileSection() {
  const router = useRouter()
  const { mypageData } = useAppSelector((state) => state.member)

  if (!mypageData) {
    return <Loading />
  }

  const parseGender = (gender: string) => {
    switch (gender) {
      case 'MALE':
        return '남성'
      case 'FEMALE':
        return '여성'
      default:
        return '기타'
    }
  }

  const parseAge = (age: string) => {
    switch (age) {
      case 'TEN':
        return '10대'
      case 'TWENTY':
        return '20대'
      case 'THIRTY':
        return '30대'
      case 'OVER_FOURTY':
        return '40대'
      default:
        return '기타'
    }
  }

  return (
    <section className="bg-white px-4 py-6">
      {/* 타이틀 */}
      <div className="flex items-center py-2.5">
        <h1 className="text-[21px] font-bold">내 정보</h1>
      </div>

      {/* 프로필 */}
      <div className="flex items-center gap-4 pt-4">
        <Image
          src={mypageData.profile_image_url || '/file.svg'}
          alt="프로필 이미지"
          width={84}
          height={84}
          className="rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm text-gray-500">안녕하세요!</p>
          <p className="text-lg font-semibold">{mypageData.nickname} 님</p>
        </div>
      </div>

      <div className="text-md text-gray-700">
        {/* 연결된 계정 */}
        <div className="flex items-center justify-between pt-8 h-20">
          <div>
            <div className="font-bold">연결된 계정</div>
            <div className="text-gray-500">{mypageData.email}</div>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/kakaoIcon.svg"
              alt="카카오 아이콘"
              width={18}
              height={18}
            />
            <div className="font-medium">카카오</div>
          </div>
        </div>

        {/* 회원 정보 */}
        <div className="flex items-center justify-between pt-5 h-17">
          <div className="text-md text-gray-700">
            <div className="font-bold">회원 정보</div>
            <div className="font-medium">
              {parseGender(mypageData.gender)} · {parseAge(mypageData.age)} ·{' '}
              {mypageData.mbti}
            </div>
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
