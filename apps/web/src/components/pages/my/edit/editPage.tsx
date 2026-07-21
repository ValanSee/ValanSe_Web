'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Icon } from '@iconify/react'
import MBTIBottomSheet from '@/components/pages/onboarding/mbtiBottomSheet'
import { Profile, MBTI, mbtiIe, mbtiTf, Age, Gender } from '@/types/member'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { useAppDispatch } from '@/hooks/utils/useAppDispatch'
import { checkNickname } from '@/api/member/member'
import {
  fetchMypageDataThunk,
  updateProfileThunk,
  updateProfileImageThunk,
} from '@/store/thunks/memberThunks'
import { useDebounce } from '@/hooks/useDebounce'
import Header from '@/components/_shared/header'
import Loading from '@/components/_shared/loading'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const genderOptions: { label: string; value: Gender }[] = [
  { label: '남성', value: 'MALE' },
  { label: '여성', value: 'FEMALE' },
]

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 서버(R2StorageService) 제한과 동일
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

const ageOptions: { label: string; value: Age }[] = [
  { label: '10대', value: 'TEN' },
  { label: '20대', value: 'TWENTY' },
  { label: '30대', value: 'THIRTY' },
  { label: '40대 이상', value: 'OVER_FOURTY' },
]

const EditPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const myPageData = useAppSelector((s) => s.member.mypageData)

  const [nickname, setNickname] = useState<string>(myPageData?.nickname || '')
  const [gender, setGender] = useState<Gender | null>(
    (myPageData?.gender as Gender) ?? null,
  )
  const [age, setAge] = useState<Age | null>(
    (myPageData?.age as Age) ?? null,
  )
  const [mbti, setMbti] = useState<MBTI | null>(
    (myPageData?.mbti as MBTI) ?? null,
  )

  const [isImageUploading, setIsImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isNicknameEditing, setIsNicknameEditing] = useState(false)
  const [nickNameMessage, setNickNameMessage] = useState<string | null>(null)
  const [mbtiBottomSheetOpen, setMbtiBottomSheetOpen] = useState(false)
  const debouncedNickname = useDebounce<string>(nickname, 500)

  useEffect(() => {
    if (!debouncedNickname) return
    ;(async () => {
      try {
        const res = await checkNickname(debouncedNickname)
        if (!res.isAvailable) setNickNameMessage('이미 사용 중인 닉네임이에요')
        else if (!res.isMeaningful)
          setNickNameMessage('의미 있는 닉네임을 입력해주세요')
        else if (!res.isClean) setNickNameMessage('사용할 수 없는 닉네임이에요')
        else setNickNameMessage(null)
      } catch {
        setNickNameMessage('닉네임 확인 중 오류가 발생했어요')
      }
    })()
  }, [debouncedNickname])

  useEffect(() => {
    if (myPageData) {
      setNickname(myPageData.nickname)
      setGender(myPageData.gender as Gender)
      setAge(myPageData.age as Age)
      setMbti(myPageData.mbti as MBTI)
    } else {
      dispatch(fetchMypageDataThunk())
    }
  }, [myPageData, dispatch])

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]
    e.target.value = '' // 같은 파일 재선택 시에도 change 이벤트가 발생하도록 초기화
    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert('jpg, png, webp, gif 형식만 지원해요')
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert('5MB 이하 이미지만 올릴 수 있어요')
      return
    }

    setIsImageUploading(true)
    try {
      await dispatch(updateProfileImageThunk(file))
    } catch {
      alert('이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요')
    } finally {
      setIsImageUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!mbti || !age || !gender) return
    if (nickNameMessage) {
      alert(nickNameMessage)
      return
    }
    const profile: Profile = {
      nickname,
      gender,
      age,
      mbtiIe: mbti[0] as mbtiIe,
      mbtiTf: mbti[2] as mbtiTf,
      mbti,
      role: 'USER',
    }
    dispatch(updateProfileThunk(profile))
    router.push('/my')
  }

  if (!myPageData) return <Loading />

  return (
    <div className="flex min-h-screen flex-col bg-card">
      <Header title="프로필 수정" showBackButton />
      <div className="flex flex-col gap-8 px-5 pb-8 pt-6">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImageUploading}
            aria-label="프로필 이미지 변경"
            className="relative"
          >
            <Image
              src={myPageData.profile_image_url || '/profile-example.svg'}
              alt="프로필"
              width={84}
              height={84}
              className="h-[84px] w-[84px] rounded-full bg-brand-gray-75 object-cover"
            />
            {isImageUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <Icon
                  icon="line-md:loading-twotone-loop"
                  width={28}
                  className="text-white"
                  aria-hidden
                />
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-brand-gray-75 bg-card">
              <Icon
                icon="icon-park-solid:camera"
                width={16}
                className="text-brand-gray-100"
                aria-hidden
              />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(',')}
            onChange={handleImageChange}
            className="hidden"
          />
          <p className="typo-title-02 text-foreground">{myPageData.kakaoname}</p>
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col gap-2">
          <label className="typo-title-02 text-foreground">닉네임</label>
          <div className="flex items-center justify-between rounded-xl border border-brand-gray-75 bg-card px-4 py-3">
            {isNicknameEditing ? (
              <>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="typo-label-02 flex-1 bg-transparent text-foreground outline-none"
                  maxLength={16}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setNickname(myPageData.nickname)
                      setNickNameMessage(null)
                      setIsNicknameEditing(false)
                    }}
                    className="typo-label-03 text-brand-gray-100"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (nickNameMessage) alert(nickNameMessage)
                      else setIsNicknameEditing(false)
                    }}
                    className="typo-label-03 text-primary"
                  >
                    완료
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="typo-label-02 text-foreground">
                  {nickname}
                </span>
                <button
                  type="button"
                  onClick={() => setIsNicknameEditing(true)}
                  className="typo-label-03 text-brand-gray-100"
                >
                  수정
                </button>
              </>
            )}
          </div>
          {nickNameMessage && (
            <p className="typo-body-c-02 text-destructive">{nickNameMessage}</p>
          )}
        </div>

        {/* 성별 */}
        <div className="flex flex-col gap-3">
          <label className="typo-title-02 text-foreground">성별</label>
          <div className="grid grid-cols-2 gap-3">
            {genderOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={gender === opt.value ? 'secondary' : 'ghost'}
                size="l"
                fullWidth
                onClick={() => setGender(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 나이 */}
        <div className="flex flex-col gap-3">
          <label className="typo-title-02 text-foreground">나이</label>
          <div className="grid grid-cols-2 gap-3">
            {ageOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={age === opt.value ? 'secondary' : 'ghost'}
                size="l"
                fullWidth
                onClick={() => setAge(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* MBTI */}
        <div className="flex flex-col gap-3">
          <label className="typo-title-02 text-foreground">MBTI</label>
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
        </div>
        {mbtiBottomSheetOpen && (
          <MBTIBottomSheet
            onClose={() => setMbtiBottomSheetOpen(false)}
            setMbti={setMbti}
          />
        )}

        <div className="flex gap-3 pt-4 [&>*]:flex-1">
          <Button
            variant="gray"
            size="l"
            fullWidth
            onClick={() => router.push('/my')}
          >
            취소
          </Button>
          <Button variant="primary" size="l" fullWidth onClick={handleSubmit}>
            저장
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditPage
