'use client'

import { useState } from 'react'
import MBTIBottomSheet from './mbtiBottomSheet'
import { checkNickname, createMemberProfile } from '@/api/member/member'
import { usePathname, useRouter } from 'next/navigation'
import {
  consumePostAuthRedirect,
  entryHrefWithRedirect,
} from '@/utils/authRedirect'
import { MBTI, mbtiIe, mbtiTf, Age, Gender } from '@/types/member'
import { Profile } from '@/types/member'

const ageOptions = ['10대', '20대', '30대', '40대']
const genderOptions = ['여성', '남성']

const OnboardingPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [nickname, setNickname] = useState('')
  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [nicknameMessage, setNicknameMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [checkingNickname, setCheckingNickname] = useState(false)
  const [gender, setGender] = useState<string | null>(null)
  const [age, setAge] = useState<string | null>(null)
  const [mbtiBottomSheetOpen, setMbtiBottomSheetOpen] = useState(false)
  const [mbti, setMbti] = useState<MBTI | null>(null)

  const refineForm = (): Profile => {
    const mbtiIe = mbti![0] as mbtiIe
    const mbtiTf = mbti![2] as mbtiTf

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
      nickname: nickname!,
      gender: genderData,
      age: ageData,
      mbtiIe: mbtiIe,
      mbtiTf: mbtiTf,
      mbti: mbti!,
      role: 'USER',
    }
  }

  const handleNicknameChange = (value: string) => {
    setNickname(value)
    setNicknameChecked(false)
    setNicknameMessage(null)
  }

  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      setNicknameMessage({ type: 'error', text: '닉네임을 입력해주세요' })
      return
    }

    setCheckingNickname(true)
    try {
      const { isAvailable, isClean } = await checkNickname(nickname)

      if (!isAvailable) {
        setNicknameChecked(false)
        setNicknameMessage({ type: 'error', text: '이미 사용 중인 닉네임이에요' })
        return
      }

      if (!isClean) {
        setNicknameChecked(false)
        setNicknameMessage({ type: 'error', text: '사용할 수 없는 닉네임이에요' })
        return
      }

      setNicknameChecked(true)
      setNicknameMessage({ type: 'success', text: '사용 가능한 닉네임이에요' })
    } catch (error) {
      console.error('Failed to check nickname:', error)
      setNicknameChecked(false)
      setNicknameMessage({
        type: 'error',
        text: '닉네임 확인에 실패했어요. 다시 시도해주세요',
      })
    } finally {
      setCheckingNickname(false)
    }
  }

  const handleSubmit = async () => {
    if (!nicknameChecked) {
      return
    }

    const refinedForm = refineForm()
    try {
      await createMemberProfile(refinedForm)
      router.replace(consumePostAuthRedirect() ?? '/main')
    } catch (error) {
      console.error('Failed to create member profile:', error)
      alert('회원 정보 생성에 실패했습니다.')
      router.replace(entryHrefWithRedirect(pathname))
    }
  }

  return (
    <div className="flex flex-col min-h-dvh px-6 py-10 bg-white">
      <h1 className="text-xl font-bold mb-9 mt-10">이것만 작성해주세요!</h1>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">닉네임</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 placeholder:text-[#8E8E8E] focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="button"
            onClick={handleCheckNickname}
            disabled={checkingNickname || !nickname.trim() || nicknameChecked}
            className="shrink-0 px-4 py-2 rounded-md bg-[#839DB7] text-white text-sm font-bold disabled:opacity-40"
          >
            {checkingNickname ? '확인 중' : nicknameChecked ? '확인 완료' : '중복 확인'}
          </button>
        </div>
        {nicknameMessage && (
          <p
            className={`mt-2 text-sm ${
              nicknameMessage.type === 'success'
                ? 'text-blue-500'
                : 'text-red-500'
            }`}
          >
            {nicknameMessage.text}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">성별</label>
        <div className="flex gap-4">
          {genderOptions.map((option) => (
            <button
              key={option}
              type="button"
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
              type="button"
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
        <button
          type="button"
          onClick={() => setMbtiBottomSheetOpen(true)}
          className={`w-full text-left text-sm border border-gray-300 px-4 py-3 rounded-md ${
            mbti ? '' : 'text-[#8E8E8E]'
          }`}
        >
          {mbti ? mbti : 'MBTI를 알려주세요'}
        </button>
      </div>
      {mbtiBottomSheetOpen && (
        <MBTIBottomSheet
          onClose={() => setMbtiBottomSheetOpen(false)}
          setMbti={setMbti}
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={!nicknameChecked || !mbti}
        className="w-full py-4 rounded-md bg-[#839DB7] text-white mt-auto disabled:opacity-40"
      >
        완료
      </button>
    </div>
  )
}

export default OnboardingPage
