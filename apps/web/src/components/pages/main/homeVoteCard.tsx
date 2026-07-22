'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useVoteAction } from '@/hooks/utils/useVoteAction'
import { cn } from '@/lib/utils'
import type { TrendingVoteItem } from '@/api/pages/valanse/trendingVoteApi'

interface Props {
  data: TrendingVoteItem
}

/**
 * 홈 상단 "뜨고 있는 밸런스" 히어로 카드. Figma 노드 6324:7185 참조.
 * 큰 보라 그라디언트 배경 + 흰 타이틀 + 상단 노란 chip + 중앙 VS 뱃지 + 하단 옵션 버튼.
 */
export default function HomeVoteCard({ data }: Props) {
  const detailHref = `/poll/${data.voteId}`
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { submit, isVoting, loginModal } = useVoteAction({
    voteId: data.voteId,
    detailHref,
    onVoted: (_res, optionId) => {
      setSelectedId((prev) => (prev === optionId ? null : optionId))
    },
  })

  const [optionA, optionB] = data.options.slice(0, 2)

  return (
    <>
      <article className="bg-hero-trending relative overflow-hidden rounded-2xl p-5 shadow-[0_0_4px_rgba(0,0,0,0.08)] duration-500 animate-in fade-in slide-in-from-bottom-2">
        <Link href={detailHref} className="flex flex-col items-center gap-3">
          <span className="typo-label-03 rounded-full bg-brand-yellow-300 px-3 py-1 text-brand-black">
            {data.totalParticipants.toLocaleString()}명 투표 중
          </span>
          <h2 className="typo-heading-05 text-center text-primary-foreground">
            {data.title}
          </h2>
        </Link>

        <div className="relative mt-5 grid grid-cols-2 gap-2">
          {optionA && (
            <HeroOptionButton
              label={optionA.content}
              selected={selectedId === optionA.optionId}
              disabled={isVoting}
              onClick={() => submit(optionA.optionId)}
            />
          )}
          {optionB && (
            <HeroOptionButton
              label={optionB.content}
              selected={selectedId === optionB.optionId}
              disabled={isVoting}
              onClick={() => submit(optionB.optionId)}
            />
          )}
          <span
            className="typo-title-04 pointer-events-none absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground"
            aria-hidden
          >
            VS
          </span>
        </div>
      </article>
      {loginModal}
    </>
  )
}

function HeroOptionButton({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'typo-label-02 flex min-h-12 items-center justify-center rounded-xl px-4 py-3 text-center transition-[colors,transform] active:scale-[0.98] disabled:active:scale-100',
        selected
          ? 'bg-card text-primary'
          : 'bg-card/90 text-primary hover:bg-card',
        disabled && 'cursor-not-allowed opacity-70',
      )}
    >
      {label}
    </button>
  )
}
