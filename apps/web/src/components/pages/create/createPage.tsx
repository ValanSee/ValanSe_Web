'use client'

import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import Header from '@/components/_shared/header'
import { Chip } from '@/components/ui/chip'
import { TextField } from '@/components/ui/textField'
import { createVote } from '@/api/votes'
import { CreateVoteData } from '@/types/api/votes'
import { VoteCategory } from '@/types/_shared/vote'
import { CATEGORIES } from '@/constants/category'
import { cn } from '@/lib/utils'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 서버(R2StorageService) 제한과 동일
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

type OptionDraft = {
  content: string
  imageFile: File | null
  preview: string | null
}

const emptyOption = (): OptionDraft => ({
  content: '',
  imageFile: null,
  preview: null,
})

const CreatePage = () => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<VoteCategory | null>(null)
  const [options, setOptions] = useState<OptionDraft[]>([
    emptyOption(),
    emptyOption(),
  ])
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 언마운트 시 미리보기 objectURL 정리 (최신 options 참조)
  const optionsRef = useRef(options)
  optionsRef.current = options
  useEffect(
    () => () => {
      optionsRef.current.forEach(
        (o) => o.preview && URL.revokeObjectURL(o.preview),
      )
    },
    [],
  )

  const isValid =
    title.trim() !== '' &&
    !!category &&
    options.every((o) => o.content.trim() !== '')

  const updateContent = (index: number, value: string) => {
    setOptions((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], content: value }
      return next
    })
  }

  const handleImageSelect = (
    index: number,
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
    setOptions((prev) => {
      const next = [...prev]
      if (next[index].preview) URL.revokeObjectURL(next[index].preview!)
      next[index] = {
        ...next[index],
        imageFile: file,
        preview: URL.createObjectURL(file),
      }
      return next
    })
  }

  const removeImage = (index: number) => {
    setOptions((prev) => {
      const next = [...prev]
      if (next[index].preview) URL.revokeObjectURL(next[index].preview!)
      next[index] = { ...next[index], imageFile: null, preview: null }
      return next
    })
  }

  const submit = async () => {
    if (!isValid || submitting) return
    setSubmitting(true)
    try {
      const voteData: CreateVoteData = {
        title,
        options: options.map((o) => ({
          content: o.content,
          imageFile: o.imageFile,
        })),
        category: category as VoteCategory,
        ...(content.trim() ? { content: content.trim() } : {}),
      }
      const voteId = await createVote(voteData)
      if (voteId) router.push(`/poll/${voteId}?source=create`)
    } catch {
      alert('업로드 실패')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-card pb-24">
      <Header
        showBackButton
        title="밸런스 게임 만들기"
        trailing={
          <button
            type="button"
            onClick={submit}
            disabled={!isValid || submitting}
            className={cn(
              'typo-label-01',
              !isValid || submitting
                ? 'text-brand-gray-100'
                : 'text-primary',
            )}
          >
            완료
          </button>
        }
      />
      <div className="flex-1 px-5 pb-10 pt-4">
        <div className="flex flex-col gap-8">
          {/* 질문 */}
          <TextField
            label={
              <>
                질문을 작성해주세요 <span className="text-destructive">*</span>
              </>
            }
            placeholder="예) 나에게 초능력이 생긴다면?"
            maxLength={40}
            showCounter
            value={title}
            onValueChange={setTitle}
          />

          {/* 썰 (선택사항) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="typo-title-02 text-foreground">
                썰(경험담)을 들려주세요
              </span>
              <span className="typo-body-c-02 rounded-md border border-brand-gray-75 px-2 py-0.5 text-brand-gray-100">
                선택사항
              </span>
            </div>
            <div className="rounded-xl border border-brand-gray-75 bg-card px-4 py-3">
              <textarea
                className="typo-body-a-01 h-[120px] w-full resize-none bg-transparent text-foreground outline-none placeholder:text-brand-gray-100"
                placeholder="어제 점심시간에 동료들과 뭘 먹을지 정하려다가…"
                value={content}
                maxLength={500}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between typo-body-c-02 text-brand-gray-100">
              <span>썰을 추가하면 더 많은 공감과 댓글을 받을 수 있어요!</span>
              <span>{content.length}/500</span>
            </div>
          </div>

          {/* 주제 */}
          <div className="flex flex-col gap-3">
            <span className="typo-title-02 text-foreground">
              주제를 선택해주세요 <span className="text-destructive">*</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip
                  key={c.param}
                  clickable
                  status={category === c.param ? 'primary' : 'ghost'}
                  size="l"
                  onClick={() =>
                    setCategory(category === c.param ? null : c.param)
                  }
                >
                  {c.label}
                </Chip>
              ))}
            </div>
          </div>

          {/* 선택지 A~D */}
          <div className="flex flex-col gap-3">
            <span className="typo-title-02 text-foreground">
              선택지를 작성해주세요 <span className="text-destructive">*</span>
            </span>
            <div className="flex flex-col gap-2">
              {options.map((option, index) => {
                const label = String.fromCharCode(65 + index)
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl border border-brand-gray-75 bg-card px-4 py-3"
                  >
                    <span className="typo-heading-06 text-foreground">
                      {label}
                    </span>
                    <input
                      type="text"
                      className="typo-label-02 w-full bg-transparent text-foreground outline-none placeholder:text-brand-gray-100"
                      placeholder={`선택지 ${label}`}
                      value={option.content}
                      onChange={(e) => updateContent(index, e.target.value)}
                    />
                    {option.preview ? (
                      <div className="relative h-11 w-11 shrink-0">
                        {/* 로컬 미리보기는 objectURL이라 next/image 대신 img 사용 */}
                        <img
                          src={option.preview}
                          alt={`선택지 ${label} 이미지 미리보기`}
                          className="h-11 w-11 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label={`선택지 ${label} 이미지 삭제`}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-black text-white"
                        >
                          <Icon icon="tabler:x" width={12} aria-hidden />
                        </button>
                      </div>
                    ) : (
                      <label
                        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed border-brand-gray-100 text-brand-gray-100"
                        aria-label={`선택지 ${label} 이미지 추가`}
                      >
                        <Icon icon="tabler:camera-plus" width={20} aria-hidden />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageSelect(index, e)}
                        />
                      </label>
                    )}
                  </div>
                )
              })}
            </div>
            {options.length < 4 && (
              <button
                type="button"
                className="typo-label-03 ml-auto flex items-center gap-1 text-brand-gray-200"
                onClick={() => setOptions([...options, emptyOption()])}
              >
                <Icon icon="tabler:plus" width={16} aria-hidden />
                선택지 추가
              </button>
            )}
          </div>

          {/* 경고문 */}
          <p className="typo-body-c-02 text-brand-gray-100">
            * 폭력적이거나 선정적인 내용, 타인에게 불쾌감이나 피해를 줄 수 있는
            게시물은 금지되어 있으며, 위반 시 이용이 제한될 수 있습니다.
          </p>
        </div>
      </div>
      <BottomNavBar />
    </div>
  )
}

export default CreatePage
