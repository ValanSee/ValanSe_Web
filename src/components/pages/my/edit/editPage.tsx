'use client'

import { useState } from 'react'
import MBTIBottomSheet from '@/components/pages/onboarding/mbtiBottomSheet'
import { MBTI, mbtiIe, mbtiTf, Age, Gender } from '@/types/_shared/profile'
import { Profile } from '@/types/_shared/profile'

const ageOptions = ['10대', '20대', '30대', '40대']
const genderOptions = ['여성', '남성']

const EditPage = () => {
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState<string | null>(null)
  const [age, setAge] = useState<string | null>(null)
  const [mbtiBottomSheetOpen, setMbtiBottomSheetOpen] = useState(false)
  const [mbti, setMbti] = useState<MBTI>('ISTJ')

  const refineForm = (): Profile => {
    const mbtiIe = mbti[0] as mbtiIe
    const mbtiTf = mbti[2] as mbtiTf

    let ageData: Age = 'TEN'
    if (age === '10대') {
      ageData = 'TEN'
    } else if (age === '20대') {
      ageData = 'TWENTY'
    } else if (age === '30대') {
      ageData = 'THIRTY'
    } else if (age === '40대') {
      ageData = 'OVER_FOURTY'
    }

    let genderData: Gender = 'FEMALE'
    if (gender === '여성') {
      genderData = 'FEMALE'
    } else if (gender === '남성') {
      genderData = 'MALE'
    }

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
      <h1 className="text-xl font-bold mb-9 mt-10">이것만 작성해주세요!</h1>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임을 입력해주세요"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">성별</label>
        <div className="flex gap-4">
          {genderOptions.map((option) => (
            <button
              key={option}
              onClick={() => setGender(option)}
              className={`flex-1 border border-gray-300 py-2 rounded-md 
               ${gender === option ? 'text-blue-500 border-blue-500' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">나이</label>
        <div className="flex gap-2">
          {ageOptions.map((option) => (
            <button
              key={option}
              onClick={() => setAge(option)}
              className={`flex-1 border border-gray-300 py-2 rounded-md
                 ${age === option ? 'text-blue-500 border-blue-500' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">MBTI</label>
        <div
          onClick={() => setMbtiBottomSheetOpen(true)}
          className="text-sm border border-gray-300 px-4 py-3 rounded-md"
        >
          {mbti ? mbti : 'MBTI를 알려주세요'}
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
