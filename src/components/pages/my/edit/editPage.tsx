// TODO: api 호출 -> 내 정보 불러오기

'use client'

import { useState } from 'react'
import MBTIBottomSheet from '@/components/pages/onboarding/mbtiBottomSheet'
import { MBTI, mbtiIe, mbtiTf, Age, Gender } from '@/types/_shared/profile'
import { Profile } from '@/types/_shared/profile'

const ageOptions = ['10대', '20대', '30대', '40대']
const genderOptions = ['여성', '남성']

const responseNickname = 'dinopark'
const responseGender = 'MALE'
const responseAge = 'TEN'
const responseMBTI = 'ISTJ'

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
  const [nickname, setNickname] = useState(responseNickname)
  const [isNicknameEditing, setIsNicknameEditing] = useState(false)
  const [gender, setGender] = useState<string | null>(responseGender)
  const [age, setAge] = useState<string | null>(responseAge)
  const [mbtiBottomSheetOpen, setMbtiBottomSheetOpen] = useState(false)
  const [mbti, setMbti] = useState<MBTI | null>(responseMBTI)

  const refineForm = (): Profile => {
    if (!mbti) {
      throw new Error('MBTI is required')
    }
    const mbtiIe = mbti[0] as mbtiIe
    const mbtiTf = mbti[2] as mbtiTf

    const ageData: Age = age! as Age
    const genderData: Gender = gender! as Gender

    return {
      nickname: nickname,
      gender: genderData,
      age: ageData,
      mbtiIe: mbtiIe,
      mbtiTf: mbtiTf,
      mbti: mbti,
    }
  }

  const handleSubmit = async () => {
    const refinedForm = refineForm()
    console.log(refinedForm)
    // TODO: api 호출
  }

  return (
    <div className="px-6 py-10">
      <div className="flex flex-col gap-4 mb-6">
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

      <button
        onClick={handleSubmit}
        className="w-full py-4 rounded-md bg-[#839DB7] text-white mt-8"
      >
        완료
      </button>
    </div>
  )
}

export default EditPage
