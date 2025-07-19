'use client'

import Image from 'next/image'
import { useState } from 'react'
import { CreateVoteData } from '@/types/api/votes'
import { VoteCategory } from '@/types/_shared/vote'
import { createVote } from '@/api/votes'
import { useRouter } from 'next/navigation'

const categories = [
  { label: '음식', value: 'FOOD' },
  { label: '연애', value: 'LOVE' },
  { label: '기타', value: 'ETC' },
]

const CreateForm = () => {
  const router = useRouter()
  const [title, setTitle] = useState<string>('')
  const [category, setCategory] = useState<string | null>(null)
  const [options, setOptions] = useState<string[]>(['', '']) // A, B

  const isFormValid = () => {
    if (title.trim() === '') return false
    if (!category) return false
    for (const option of options) {
      if (option.trim() === '') return false
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
      options,
      category: category as VoteCategory,
    }
    const voteId = await createVote(voteData)
    return voteId
  }

  return (
    <div className="flex flex-col items-center gap-10">
      {/* 질문 */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="w-full text-[18px] font-[700] leading-none">
          질문을 작성해주세요
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

      {/* 주제 */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="w-full text-[18px] font-[700] leading-none">
          주제를 선택해주세요
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
        <div className="w-full text-[18px] font-[700] leading-none">
          선택지를 작성해주세요
        </div>

        {/* 선택지 input들 */}
        <div className="flex flex-col gap-2 w-full pt-3">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-3 w-full border border-[#C6C6C6] rounded-lg px-5 py-3"
            >
              <div className="text-[18px] font-[500] leading-none">
                {String.fromCharCode(65 + index)}
              </div>
              <input
                type="text"
                className="w-full text-[18px] text-[#1D1D1D] font-[500]"
                value={option}
                onChange={(e) => {
                  const newOptions = [...options]
                  newOptions[index] = e.target.value
                  setOptions(newOptions)
                }}
              />
            </div>
          ))}
        </div>

        {/* 선택지 추가 버튼 */}
        {options.length < 4 && (
          <button
            className="flex items-center pt-4 ml-auto gap-3 text-[#555555] text-[14px] font-[400] leading-none"
            onClick={() => {
              if (options.length < 5) {
                setOptions([...options, ''])
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
            onClick={async () => {
              try {
                const voteId = await onSubmit()
                if (voteId) {
                  router.push(`/poll/${voteId}`)
                }
              } catch {
                alert('업로드 실패')
              }
            }}
            className="w-full h-[60px] pl-5 pr-4 py-3 bg-[#839DB7] rounded-lg text-[18px] text-white font-[400]"
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateForm
