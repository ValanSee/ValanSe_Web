// 수정된 MyProfileSection.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { updateProfileImageThunk } from '@/store/thunks/memberThunks'
import { ALLOWED_IMAGE_TYPES, validateImageFile } from '@/utils/imageFile'
import Loading from '@/components/_shared/loading'

export default function MyProfileSection() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { mypageData, pointHistory, titles } = useAppSelector(
    (state) => state.member,
  )
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const onSelectProfileImage = async (file: File | undefined) => {
    if (!file || isUploadingImage) return
    const errorMessage = validateImageFile(file)
    if (errorMessage) {
      alert(errorMessage)
      return
    }
    try {
      setIsUploadingImage(true)
      await dispatch(updateProfileImageThunk(file))
    } catch {
      alert('프로필 이미지 변경에 실패했습니다.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  if (!mypageData) {
    return <Loading />
  }

  // 잔액: 가장 최신 항목의 remainingPoint. fetch 전이거나 빈 배열이면 null로 두고 "-" 표시.
  const point = pointHistory?.[0]?.remainingPoint ?? null

  // 장착 칭호: defaultTitles + ownedTitles에서 equipped 찾기. fetch 전이거나 없으면 null.
  const equippedTitle =
    titles &&
    [...titles.defaultTitles, ...titles.ownedTitles].find((t) => t.equipped)

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
        <label
          className="relative shrink-0 cursor-pointer"
          aria-label="프로필 이미지 변경"
        >
          {/* R2 이미지는 도메인이 환경별로 달라 next/image 허용 목록에 넣을 수 없어 img 사용 */}
          <img
            src={mypageData.profile_image_url || '/file.svg'}
            alt="프로필 이미지"
            className={`w-[84px] h-[84px] rounded-full object-cover ${
              isUploadingImage ? 'opacity-50' : ''
            }`}
          />
          <span className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 rounded-full bg-secondary border border-border">
            <Image src="/plus-gray.svg" alt="" width={10} height={10} />
          </span>
          <input
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            className="hidden"
            disabled={isUploadingImage}
            onChange={(e) => {
              onSelectProfileImage(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </label>
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

        {/* 내 포인트 */}
        <button
          type="button"
          onClick={() => router.push('/my/point')}
          className="flex items-center w-full pt-5 h-17 text-left"
        >
          <div className="text-md text-gray-700">
            <div className="font-bold">내 포인트</div>
            <div className="font-medium text-[#4D7298]">
              {point !== null ? `${point.toLocaleString()}P` : '-P'}
            </div>
          </div>
        </button>

        {/* 내 칭호 */}
        <button
          type="button"
          onClick={() => router.push('/my/titles')}
          className="flex items-center w-full pt-5 h-17 text-left"
        >
          <div className="text-md text-gray-700">
            <div className="font-bold">내 칭호</div>
            <div className="font-medium text-[#1D1D1D]">
              {equippedTitle ? equippedTitle.title : '미장착'}
            </div>
          </div>
        </button>
      </div>
    </section>
  )
}
