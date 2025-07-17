// TODO: api 호출 -> 내 정보 불러오기

'use client'

import { useState, useEffect } from 'react'
import MBTIBottomSheet from '@/components/pages/onboarding/mbtiBottomSheet'
import { MBTI, mbtiIe, mbtiTf, Age, Gender } from '@/types/_shared/profile'
import { Profile } from '@/types/_shared/profile'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { checkNickname } from '@/api/member'
import { updateProfileThunk } from '@/store/thunks/memberThunks'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'

const ageOptions = ['10대', '20대', '30대', '40대']
const genderOptions = ['여성', '남성']

const ageMap = (label: string) => {
  switch (label) {
    case '10대':
      return 'TEN'
    case '20대':
      return 'TWENTY'
    case '30대':
      return 'THIRTY'
    case '40대':
      return 'OVER_FOURTY'
    default:
      return label
  }
}

const genderMap = (label: string) => {
  switch (label) {
    case '여성':
      return 'FEMALE'
    case '남성':
      return 'MALE'
    default:
      return label
  }
}

const EditPage = () => {
  const router = useRouter()
  const myPageData = useAppSelector((state) => state.member.mypageData)
  const [nickname, setNickname] = useState(myPageData?.nickname)
  const [isNicknameEditing, setIsNicknameEditing] = useState(false)
  const [gender, setGender] = useState<string | null>(
    myPageData?.gender as string,
  )
  const [age, setAge] = useState<string | null>(myPageData?.age as string)
  const [mbtiBottomSheetOpen, setMbtiBottomSheetOpen] = useState(false)
  const [mbti, setMbti] = useState<MBTI | null>(myPageData?.mbti as MBTI)
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log('전역 상태 nickname', myPageData?.nickname)
    console.log('로컬 상태 nickname', nickname)
    if (myPageData) {
      setNickname(myPageData.nickname)
      setGender(myPageData.gender)
      setAge(myPageData.age)
      setMbti(myPageData.mbti as MBTI)
    }
  }, [myPageData])

  const refineForm = (): Profile => {
    if (!mbti) {
      throw new Error('MBTI is required')
    }
    const mbtiIe = mbti[0] as mbtiIe
    const mbtiTf = mbti[2] as mbtiTf

    const ageData: Age = age! as Age
    const genderData: Gender = gender! as Gender

    return {
      nickname: nickname as string,
      gender: genderData,
      age: ageData,
      mbtiIe: mbtiIe,
      mbtiTf: mbtiTf,
      mbti: mbti,
    }
  }

  const handleSubmit = async () => {
    const refinedForm = refineForm()
    const nicknameCheck = await checkNickname(nickname as string)

    // TODO: 닉네임 사용 가능성 체크, response 요소 3개 적절히 판정
    if (!nicknameCheck.isAvailable) {
      alert('이미 사용 중인 닉네임입니다.')
      return
    }

    dispatch(updateProfileThunk(refinedForm))
    router.push('/my')
  }

  if (!myPageData) {
    return (
      <div className="pt-12 text-center text-gray-500">
        마이페이지 정보를 불러오는 중입니다...
      </div>
    )
  }

  return (
    <div className="px-4 py-10">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={myPageData.profile_image_url || '/profile-example.svg'}
          alt="profile"
          width={84}
          height={84}
          className="rounded-full object-cover"
        />
        <div className="text-[20px]">{myPageData.kakaoname}</div>
      </div>
      <div className="flex flex-col gap-4 mb-6 pt-6">
        <label className="text-md font-bold">닉네임</label>
        <div className="flex items-center justify-between pl-5 pr-3.5 py-3 border border-[#C6C6C6] rounded-md">
          {!isNicknameEditing ? (
            <>
              <div className="text-md text-[#1D1D1D]">{nickname}</div>
              <button
                onClick={() => setIsNicknameEditing(true)}
                className="text-[#8E8E8E]"
              >
                수정
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-md text-[#1D1D1D] flex-1"
              />
              <div className="flex gap-2 text-md">
                <button
                  onClick={() => setIsNicknameEditing(false)}
                  className="text-[#8E8E8E]"
                >
                  취소
                </button>
                <button
                  onClick={() => setIsNicknameEditing(false)}
                  className="text-[#4D7298]"
                >
                  완료
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <label className="text-md font-bold">성별</label>
        <div className="flex gap-4">
          {genderOptions.map((option) => (
            <button
              key={genderMap(option)}
              onClick={() => setGender(genderMap(option))}
              className={`flex-1 border py-2 rounded-md 
               ${gender === genderMap(option) ? 'text-[#4D7298] border-[#4D7298]' : 'text-[#8E8E8E] border-[#C6C6C6]'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <label className="text-md font-bold">나이</label>
        <div className="flex gap-2">
          {ageOptions.map((option) => (
            <button
              key={option}
              onClick={() => setAge(ageMap(option))}
              className={`flex-1 border py-2 rounded-md
                 ${age === ageMap(option) ? 'text-[#4D7298] border-[#4D7298]' : 'text-[#8E8E8E] border-[#C6C6C6]'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <label className="text-md font-bold">MBTI</label>
        <div className="flex items-center justify-between pl-5 pr-3.5 py-3 text-md text-[#8E8E8E] border border-gray-300 rounded-md">
          <div className="text-md text-[#8E8E8E]">{mbti}</div>
          <button
            onClick={() => setMbtiBottomSheetOpen(true)}
            className="text-[#8E8E8E]"
          >
            수정
          </button>
        </div>
      </div>
      {mbtiBottomSheetOpen && (
        <MBTIBottomSheet
          onClose={() => setMbtiBottomSheetOpen(false)}
          setMbti={setMbti}
        />
      )}

      {/* Action Bar */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/my')}
          className="w-full py-4 rounded-md bg-[#e4e4e4] text-[#8E8E8E] mt-8"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-md bg-[#839DB7] text-white mt-8"
        >
          변경사항 저장
        </button>
      </div>
    </div>
  )
}

export default EditPage
