'use client'

import { Icon } from '@iconify/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { TextField } from '@/components/ui/textField'
import { createVote } from '@/api/votes'
import { CreateVoteData } from '@/types/api/votes'
import { VoteCategory } from '@/types/_shared/vote'

const CATEGORIES: { label: string; value: VoteCategory }[] = [
  { label: '연애', value: 'LOVE' },
  { label: '음식', value: 'FOOD' },
  { label: '기타', value: 'ETC' },
]

const CreateForm = () => {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<VoteCategory | null>(null)
  const [options, setOptions] = useState<string[]>(['', ''])
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isValid =
    title.trim() !== '' && !!category && options.every((o) => o.trim() !== '')

  const submit = async () => {
    if (!isValid || submitting) return
    setSubmitting(true)
    try {
      const voteData: CreateVoteData = {
        title,
        options,
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
              key={c.value}
              clickable
              status={category === c.value ? 'primary' : 'ghost'}
              size="l"
              onClick={() =>
                setCategory(category === c.value ? null : c.value)
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
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-brand-gray-75 bg-card px-4 py-3"
            >
              <span className="typo-heading-06 text-foreground">
                {String.fromCharCode(65 + index)}
              </span>
              <input
                type="text"
                className="typo-label-02 w-full bg-transparent text-foreground outline-none placeholder:text-brand-gray-100"
                placeholder={`선택지 ${String.fromCharCode(65 + index)}`}
                value={option}
                onChange={(e) => {
                  const next = [...options]
                  next[index] = e.target.value
                  setOptions(next)
                }}
              />
            </div>
          ))}
        </div>
        {options.length < 4 && (
          <button
            type="button"
            className="typo-label-03 ml-auto flex items-center gap-1 text-brand-gray-200"
            onClick={() => setOptions([...options, ''])}
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

      {/* CTA */}
      <div className="flex gap-3 pt-2 [&>*]:flex-1">
        <Button
          variant="gray"
          size="l"
          onClick={() => router.back()}
          fullWidth
        >
          취소
        </Button>
        <Button
          variant="primary"
          size="l"
          onClick={submit}
          disabled={!isValid || submitting}
          fullWidth
        >
          게임 만들기
        </Button>
      </div>
    </div>
  )
}

export default CreateForm
