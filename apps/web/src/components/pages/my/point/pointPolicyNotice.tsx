'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

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
    <section className="mx-4 rounded-xl border border-brand-gray-75 bg-card">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="typo-title-03 text-foreground">
          포인트 적립 정책
        </span>
        <Icon
          icon={open ? 'icon-park-outline:up' : 'icon-park-outline:down'}
          className="text-brand-gray-100"
          width={18}
          aria-hidden
        />
      </button>
      {open && (
        <ul className="flex flex-col gap-2 px-4 pb-3 typo-body-b-01">
          {POLICIES.map((p) => (
            <li key={p.label} className="flex justify-between">
              <span className="text-foreground">{p.label}</span>
              <span className="text-primary">{p.amount}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default PointPolicyNotice
