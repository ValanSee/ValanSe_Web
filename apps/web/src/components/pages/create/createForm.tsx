'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { CreateVoteData } from '@/types/api/votes'
import { VoteCategory } from '@/types/_shared/vote'
import { createVote } from '@/api/votes'
import { useRouter } from 'next/navigation'
import { ALLOWED_IMAGE_TYPES, validateImageFile } from '@/utils/imageFile'

const categories = [
  { label: '음식', value: 'FOOD' },
  { label: '연애', value: 'LOVE' },
  { label: '기타', value: 'ETC' },
]

type OptionInput = {
  content: string
  imageFile: File | null
  previewUrl: string | null
}

const emptyOption = (): OptionInput => ({
  content: '',
  imageFile: null,
  previewUrl: null,
})

const CreateForm = () => {
  const router = useRouter()
  const [title, setTitle] = useState<string>('')
  const [category, setCategory] = useState<string | null>(null)
  const [options, setOptions] = useState<OptionInput[]>([
    emptyOption(),
    emptyOption(),
  ]) // A, B
  const [content, setContent] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 언마운트 시 미리보기 object URL 해제
  const optionsRef = useRef(options)
  optionsRef.current = options
  useEffect(() => {
    return () => {
      optionsRef.current.forEach((option) => {
        if (option.previewUrl) URL.revokeObjectURL(option.previewUrl)
      })
    }
  }, [])

  const onSelectImage = (index: number, file: File | undefined) => {
    if (!file) return
    const errorMessage = validateImageFile(file)
    if (errorMessage) {
      alert(errorMessage)
      return
    }
    setOptions((prev) =>
      prev.map((option, i) => {
        if (i !== index) return option
        if (option.previewUrl) URL.revokeObjectURL(option.previewUrl)
        return {
          ...option,
          imageFile: file,
          previewUrl: URL.createObjectURL(file),
        }
      }),
    )
  }

  const onRemoveImage = (index: number) => {
    setOptions((prev) =>
      prev.map((option, i) => {
        if (i !== index) return option
        if (option.previewUrl) URL.revokeObjectURL(option.previewUrl)
        return { ...option, imageFile: null, previewUrl: null }
      }),
    )
  }

  const isFormValid = () => {
    if (title.trim() === '') return false
    if (!category) return false
    for (const option of options) {
      if (option.content.trim() === '') return false
    }
    return true
  }

  const onSubmit = async () => {
    if (!isFormValid()) {
      alert('필수 정보를 입력해주세요')
      return
    }
    const voteData: CreateVoteData = {
      title,
      options: options.map(({ content, imageFile }) => ({
        content,
        imageFile,
      })),
      category: category as VoteCategory,
      ...(content.trim()
        ? ({ content: content.trim() } as Pick<CreateVoteData, 'content'>)
        : {}),
    }
    const voteId = await createVote(voteData)
    return voteId
  }

  return (
    <div className="flex flex-col items-center gap-10">
      {/* 질문 */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="w-full text-[18px] font-[700] leading-none flex items-center gap-1">
          <div>질문을 작성해주세요</div>
          <div className="text-[#FF3B30]">*</div>
        </div>
        <div className="w-full border border-[#C6C6C6] rounded-lg px-5 py-3">
          <input
            type="text"
            className="w-full text-[18px] text-[#1D1D1D] font-[500]"
            placeholder="예) 나에게 초능력이 생긴다면?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      {/* 썰(경험담) */}
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="w-full flex items-center gap-2">
          <div className="text-[18px] font-[700] leading-none">
            썰(경험담)을 들려주세요
          </div>
          <div className="px-2 py-[2px] rounded-md border border-[#E4E4E4] text-[12px] text-[#8E8E8E] leading-none">
            선택사항
          </div>
        </div>
        <div className="w-full border border-[#C6C6C6] rounded-lg px-5 py-3">
          <textarea
            className="w-full h-[120px] resize-none text-[16px] text-[#1D1D1D] font-[400] outline-none"
            placeholder="예시: 어제 점심시간에 동료들과 뭘 먹을지 정하려다가 시간을 다 쓰고 결국 편의점 도시락을 먹게 되었는데, 여러분이라면 어떤 선택을 하실건가요?"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 500))}
          />
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="text-[12px] font-[400] leading-none text-[#8E8E8E]">
            썰을 추가하면 더 많은 공감과 댓글을 받을 수 있어요!
          </div>
          <div className="text-[12px] font-[400] leading-none text-[#8E8E8E]">
            {content.length}/500
          </div>
        </div>
      </div>

      {/* 주제 */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="w-full text-[18px] font-[700] leading-none flex items-center gap-1">
          <div>주제를 선택해주세요</div>
          <div className="text-[#FF3B30]">*</div>
        </div>
        <div className="flex gap-2 w-full">
          {categories.map((c) => (
            <button
              key={c.label}
              className={`w-[68px] h-10 rounded-full ${
                category === c.value
                  ? 'bg-[#839DB7] text-white'
                  : 'bg-white text-[#8E8E8E] border border-[#C6C6C6]'
              }`}
              onClick={() => {
                if (category === c.value) {
                  setCategory(null)
                  return
                }
                setCategory(c.value)
              }}
            >
              <div className="text-[16px]">{c.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 선택지 */}
      <div className="flex flex-col items-center w-full">
        <div className="w-full text-[18px] font-[700] leading-none flex items-center gap-1">
          <div>선택지를 작성해주세요</div>
          <div className="text-[#FF3B30]">*</div>
        </div>

        {/* 선택지 input들 */}
        <div className="flex flex-col gap-2 w-full pt-3">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 w-full border border-[#C6C6C6] rounded-lg px-5 py-3"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="text-[18px] font-[500] leading-none">
                  {String.fromCharCode(65 + index)}
                </div>
                <input
                  type="text"
                  className="w-full text-[18px] text-[#1D1D1D] font-[500]"
                  value={option.content}
                  onChange={(e) => {
                    const newOptions = [...options]
                    newOptions[index] = {
                      ...newOptions[index],
                      content: e.target.value,
                    }
                    setOptions(newOptions)
                  }}
                />
              </div>
              {option.previewUrl ? (
                <div className="relative self-start pt-2 pr-2">
                  {/* object URL 미리보기는 next/image 최적화 대상이 아니므로 img 사용 */}
                  <img
                    src={option.previewUrl}
                    alt={`선택지 ${String.fromCharCode(65 + index)} 이미지 미리보기`}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    aria-label="이미지 삭제"
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-0 right-0"
                  >
                    <Image
                      src="/letter-x-circle.svg"
                      alt=""
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 self-start cursor-pointer typo-body-c-01 text-brand-gray-300">
                  <Image
                    src="/plus-gray.svg"
                    alt=""
                    width={10}
                    height={10}
                  />
                  이미지 추가
                  <input
                    type="file"
                    accept={ALLOWED_IMAGE_TYPES.join(',')}
                    className="hidden"
                    onChange={(e) => {
                      onSelectImage(index, e.target.files?.[0])
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* 선택지 추가 버튼 */}
        {options.length < 4 && (
          <button
            className="flex items-center pt-4 ml-auto gap-3 text-[#555555] text-[14px] font-[400] leading-none"
            onClick={() => {
              if (options.length < 4) {
                setOptions([...options, emptyOption()])
              }
            }}
          >
            <Image
              src="/plus-gray.svg"
              alt="plus-gray"
              width={12}
              height={12}
            />
            선택지 추가
          </button>
        )}
      </div>
      {/* 제출 버튼 */}
      <div className="flex flex-col items-center gap-3">
        {/* 경고문 */}
        <div className="flex gap-1 w-full items-start">
          <div className="text-[12px] font-[400] leading-none text-[#8E8E8E]">
            *
          </div>
          <div className="text-[12px] font-[400] leading-none text-[#8E8E8E]">
            폭력적이거나 선정적인 내용, 타인에게 불쾌감이나 피해를 줄 수 있는
            게시물은 금지되어 있으며, 위반 시 이용이 제한될 수 있습니다.
          </div>
        </div>
        {/* 버튼 */}
        <div className="flex gap-2 w-full">
          <button
            onClick={() => {
              // NOTE: 뒤로 갈 페이지가 없음
            }}
            className="w-full h-[60px] pl-5 pr-4 py-3 bg-[#E4E4E4] rounded-lg text-[18px] text-[#8E8E8E] font-[400]"
          >
            취소
          </button>
          <button
            disabled={isSubmitting}
            onClick={async () => {
              if (isSubmitting) return
              setIsSubmitting(true)
              try {
                const voteId = await onSubmit()
                if (voteId) {
                  router.push(`/poll/${voteId}?source=create`)
                }
              } catch {
                alert('업로드 실패')
              } finally {
                setIsSubmitting(false)
              }
            }}
            className="w-full h-[60px] pl-5 pr-4 py-3 bg-[#839DB7] rounded-lg text-[18px] text-white font-[400] disabled:opacity-50"
          >
            {isSubmitting ? '업로드 중...' : '업로드'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateForm
