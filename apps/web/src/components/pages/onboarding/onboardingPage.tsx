'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
import { usePathname, useRouter } from 'next/navigation'
import MBTIBottomSheet from './mbtiBottomSheet'
import {
  onboardingSchema,
  type OnboardingFormValues,
} from './onboarding.schema'
import { checkNickname, createMemberProfile } from '@/api/member/member'
import {
  consumePostAuthRedirect,
  entryHrefWithRedirect,
} from '@/utils/authRedirect'
import { Age, Gender, mbtiIe, mbtiTf, Profile } from '@/types/member'
import Header from '@/components/_shared/header'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/textField'
import { cn } from '@/lib/utils'

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
]

const ageOptions: { value: Age; label: string }[] = [
  { value: 'TEN', label: '10대' },
  { value: 'TWENTY', label: '20대' },
  { value: 'THIRTY', label: '30대' },
  { value: 'OVER_FOURTY', label: '40대 이상' },
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
  const gender = watch('gender')
  const age = watch('age')
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
      if (getValues('nickname').trim() !== value) return

      if (!isAvailable) {
        setValue('nicknameVerified', false, { shouldValidate: true })
        setNicknameMessage({
          type: 'error',
          text: '이미 사용 중인 닉네임이에요',
        })
        return
      }
      if (!isClean) {
        setValue('nicknameVerified', false, { shouldValidate: true })
        setNicknameMessage({
          type: 'error',
          text: '사용할 수 없는 닉네임이에요',
        })
        return
      }
      setValue('nicknameVerified', true, { shouldValidate: true })
      setNicknameMessage({
        type: 'success',
        text: '사용 가능한 닉네임이에요',
      })
    } catch (e) {
      console.error('Failed to check nickname:', e)
      // 입력이 바뀐 뒤 도착한 stale 에러는 무시한다.
      if (getValues('nickname').trim() !== value) return
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
    } catch (e) {
      console.error('Failed to create member profile:', e)
      alert('회원 정보 생성에 실패했습니다.')
      router.replace(entryHrefWithRedirect(pathname))
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-card">
      <Header showBackButton title="회원가입" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-1 flex-col gap-8 px-5 pb-8 pt-6"
      >
        {/* 프로필 아바타 placeholder */}
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-gray-50 text-brand-gray-100"
          aria-hidden
        >
          <Icon icon="tabler:user" width={40} />
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <TextField
              label={
                <>
                  닉네임 <span className="text-destructive">*</span>
                </>
              }
              maxLength={16}
              showCounter
              value={nickname}
              placeholder="닉네임을 입력해주세요"
              {...register('nickname', {
                onChange: () => {
                  setValue('nicknameVerified', false, { shouldValidate: true })
                  setNicknameMessage(null)
                },
              })}
            />
            <Button
              type="button"
              variant={nicknameVerified ? 'secondary' : 'primary'}
              size="l"
              className="shrink-0"
              onClick={handleCheckNickname}
              disabled={checkingNickname || !nickname.trim() || nicknameVerified}
            >
              {checkingNickname
                ? '확인 중'
                : nicknameVerified
                  ? '확인 완료'
                  : '중복 확인'}
            </Button>
          </div>
          {nicknameMessage && (
            <p
              className={cn(
                'typo-body-c-02',
                nicknameMessage.type === 'success'
                  ? 'text-primary'
                  : 'text-destructive',
              )}
            >
              {nicknameMessage.text}
            </p>
          )}
        </div>

        {/* 성별 */}
        <div className="flex flex-col gap-3">
          <span className="typo-title-02 text-foreground">
            성별 <span className="text-destructive">*</span>
          </span>
          <div className="grid grid-cols-2 gap-3">
            {genderOptions.map((opt) => (
              <label key={opt.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={opt.value}
                  {...register('gender')}
                  className="peer sr-only"
                />
                <Button
                  type="button"
                  variant={gender === opt.value ? 'secondary' : 'ghost'}
                  size="l"
                  fullWidth
                  onClick={() =>
                    setValue('gender', opt.value, { shouldValidate: true })
                  }
                >
                  {opt.label}
                </Button>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="typo-body-c-02 text-destructive">
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* 나이 */}
        <div className="flex flex-col gap-3">
          <span className="typo-title-02 text-foreground">
            나이 <span className="text-destructive">*</span>
          </span>
          <div className="grid grid-cols-2 gap-3">
            {ageOptions.map((opt) => (
              <label key={opt.value} className="cursor-pointer">
                <input
                  type="radio"
                  value={opt.value}
                  {...register('age')}
                  className="peer sr-only"
                />
                <Button
                  type="button"
                  variant={age === opt.value ? 'secondary' : 'ghost'}
                  size="l"
                  fullWidth
                  onClick={() =>
                    setValue('age', opt.value, { shouldValidate: true })
                  }
                >
                  {opt.label}
                </Button>
              </label>
            ))}
          </div>
          {errors.age && (
            <p className="typo-body-c-02 text-destructive">
              {errors.age.message}
            </p>
          )}
        </div>

        {/* MBTI */}
        <div className="flex flex-col gap-3">
          <span className="typo-title-02 text-foreground">
            MBTI <span className="text-destructive">*</span>
          </span>
          <button
            type="button"
            onClick={() => setMbtiBottomSheetOpen(true)}
            className={cn(
              'typo-label-02 flex h-12 w-full items-center justify-between rounded-xl border border-brand-gray-75 bg-card px-4 py-2 text-left transition-colors hover:border-primary',
              mbti ? 'text-foreground' : 'text-brand-gray-100',
            )}
          >
            {mbti ?? 'MBTI를 선택해주세요'}
            <Icon
              icon="icon-park-solid:down-one"
              width={20}
              className="text-brand-gray-100"
              aria-hidden
            />
          </button>
          {errors.mbti && (
            <p className="typo-body-c-02 text-destructive">
              {errors.mbti.message}
            </p>
          )}
        </div>
        {mbtiBottomSheetOpen && (
          <MBTIBottomSheet
            onClose={() => setMbtiBottomSheetOpen(false)}
            setMbti={(value) =>
              setValue('mbti', value, { shouldValidate: true })
            }
          />
        )}

        {/* CTA */}
        <Button
          type="submit"
          variant="primary"
          size="xl"
          fullWidth
          disabled={!isValid || isSubmitting}
          className="mt-auto"
        >
          회원가입 하기
        </Button>
      </form>
    </div>
  )
}

export default OnboardingPage
