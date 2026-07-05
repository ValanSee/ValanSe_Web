'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import MBTIBottomSheet from './mbtiBottomSheet'
import {
  onboardingSchema,
  type OnboardingFormValues,
} from './onboarding.schema'
import { checkNickname, createMemberProfile } from '@/api/member/member'
import { usePathname, useRouter } from 'next/navigation'
import {
  consumePostAuthRedirect,
  entryHrefWithRedirect,
} from '@/utils/authRedirect'
import { Age, Gender, mbtiIe, mbtiTf, Profile } from '@/types/member'
import RequiredMark from '@/components/_shared/requiredMark'

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'FEMALE', label: '여성' },
  { value: 'MALE', label: '남성' },
]

const ageOptions: { value: Age; label: string }[] = [
  { value: 'TEN', label: '10대' },
  { value: 'TWENTY', label: '20대' },
  { value: 'THIRTY', label: '30대' },
  { value: 'OVER_FOURTY', label: '40대' },
]

const OnboardingPage = () => {
  const router = useRouter()
  const pathname = usePathname()

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      nicknameVerified: false,
    },
  })

  const nickname = watch('nickname')
  const nicknameVerified = watch('nicknameVerified')
  const mbti = watch('mbti')

  const [nicknameMessage, setNicknameMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [checkingNickname, setCheckingNickname] = useState(false)
  const [mbtiBottomSheetOpen, setMbtiBottomSheetOpen] = useState(false)

  const handleCheckNickname = async () => {
    const value = getValues('nickname').trim()
    if (!value) {
      setNicknameMessage({ type: 'error', text: '닉네임을 입력해주세요' })
      return
    }

    setCheckingNickname(true)
    try {
      const { isAvailable, isClean } = await checkNickname(value)

      // 응답을 기다리는 사이 입력이 바뀌었으면 stale 응답이므로 무시한다.
      if (getValues('nickname').trim() !== value) {
        return
      }

      if (!isAvailable) {
        setValue('nicknameVerified', false, { shouldValidate: true })
        setNicknameMessage({ type: 'error', text: '이미 사용 중인 닉네임이에요' })
        return
      }

      if (!isClean) {
        setValue('nicknameVerified', false, { shouldValidate: true })
        setNicknameMessage({ type: 'error', text: '사용할 수 없는 닉네임이에요' })
        return
      }

      setValue('nicknameVerified', true, { shouldValidate: true })
      setNicknameMessage({ type: 'success', text: '사용 가능한 닉네임이에요' })
    } catch (error) {
      console.error('Failed to check nickname:', error)
      // 입력이 바뀐 뒤 도착한 stale 에러는 무시한다.
      if (getValues('nickname').trim() !== value) {
        return
      }
      setValue('nicknameVerified', false, { shouldValidate: true })
      setNicknameMessage({
        type: 'error',
        text: '닉네임 확인에 실패했어요. 다시 시도해주세요',
      })
    } finally {
      setCheckingNickname(false)
    }
  }

  const onSubmit = async (values: OnboardingFormValues) => {
    const profile: Profile = {
      nickname: values.nickname,
      gender: values.gender,
      age: values.age,
      mbtiIe: values.mbti[0] as mbtiIe,
      mbtiTf: values.mbti[2] as mbtiTf,
      mbti: values.mbti,
      role: 'USER',
    }

    try {
      await createMemberProfile(profile)
      router.replace(consumePostAuthRedirect() ?? '/main')
    } catch (error) {
      console.error('Failed to create member profile:', error)
      alert('회원 정보 생성에 실패했습니다.')
      router.replace(entryHrefWithRedirect(pathname))
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col min-h-dvh px-6 py-10 bg-white"
    >
      <h1 className="text-xl font-bold mb-9 mt-10">이것만 작성해주세요!</h1>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">
          닉네임 <RequiredMark />
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            {...register('nickname', {
              onChange: () => {
                setValue('nicknameVerified', false, { shouldValidate: true })
                setNicknameMessage(null)
              },
            })}
            placeholder="닉네임을 입력해주세요"
            className="flex-1 min-w-0 border border-gray-300 rounded-md px-4 py-2 placeholder:text-[#8E8E8E] focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="button"
            onClick={handleCheckNickname}
            disabled={checkingNickname || !nickname.trim() || nicknameVerified}
            className="shrink-0 px-4 py-2 rounded-md bg-[#839DB7] text-white text-sm font-bold disabled:opacity-40"
          >
            {checkingNickname
              ? '확인 중'
              : nicknameVerified
                ? '확인 완료'
                : '중복 확인'}
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
        <label className="block mb-4 text-sm font-bold">
          성별 <RequiredMark />
        </label>
        <div className="flex gap-4">
          {genderOptions.map((option) => (
            <label key={option.value} className="flex-1">
              <input
                type="radio"
                value={option.value}
                {...register('gender')}
                className="peer sr-only"
              />
              <span className="block text-center border border-gray-300 py-2 rounded-md cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-500 peer-focus-visible:ring-2 peer-focus-visible:ring-black">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="mt-2 text-sm text-red-500">{errors.gender.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">
          나이 <RequiredMark />
        </label>
        <div className="flex gap-2">
          {ageOptions.map((option) => (
            <label key={option.value} className="flex-1">
              <input
                type="radio"
                value={option.value}
                {...register('age')}
                className="peer sr-only"
              />
              <span className="block text-center border border-gray-300 py-2 rounded-md cursor-pointer peer-checked:text-blue-500 peer-checked:border-blue-500 peer-focus-visible:ring-2 peer-focus-visible:ring-black">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {errors.age && (
          <p className="mt-2 text-sm text-red-500">{errors.age.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-4 text-sm font-bold">
          MBTI <RequiredMark />
        </label>
        <button
          type="button"
          onClick={() => setMbtiBottomSheetOpen(true)}
          className={`w-full text-left text-sm border border-gray-300 px-4 py-3 rounded-md ${
            mbti ? '' : 'text-[#8E8E8E]'
          }`}
        >
          {mbti ? mbti : 'MBTI를 알려주세요'}
        </button>
        {errors.mbti && (
          <p className="mt-2 text-sm text-red-500">{errors.mbti.message}</p>
        )}
      </div>
      {mbtiBottomSheetOpen && (
        <MBTIBottomSheet
          onClose={() => setMbtiBottomSheetOpen(false)}
          setMbti={(value) => setValue('mbti', value, { shouldValidate: true })}
        />
      )}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full py-4 rounded-md bg-[#839DB7] text-white mt-auto disabled:opacity-40"
      >
        완료
      </button>
    </form>
  )
}

export default OnboardingPage
