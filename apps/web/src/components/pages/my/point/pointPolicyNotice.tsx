'use client'

import { useState } from 'react'

const POLICIES: { label: string; amount: string }[] = [
  { label: '회원가입', amount: '40P' },
  { label: '게시물 작성', amount: '5P' },
  { label: '좋아요 받기', amount: '1P / 1개' },
  { label: '핫이슈 선정', amount: '50P' },
  { label: '댓글 작성', amount: '1P (일일 3회 제한)' },
]

const PointPolicyNotice = () => {
  const [open, setOpen] = useState(false)

  return (
    <section className="mx-4 mb-2 border border-[#F0F0F0] rounded-lg">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[#1D1D1D]">
          포인트 적립 정책
        </span>
        <span className="text-xs text-[#8E8E8E]">
          {open ? '접기' : '펼치기'}
        </span>
      </button>
      {open && (
        <ul className="px-4 pb-3 space-y-1.5 text-sm">
          {POLICIES.map((p) => (
            <li key={p.label} className="flex justify-between">
              <span className="text-[#1D1D1D]">{p.label}</span>
              <span className="text-[#4D7298] font-medium">{p.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default PointPolicyNotice
