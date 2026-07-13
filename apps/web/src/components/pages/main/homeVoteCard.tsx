'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import CategoryChip from '@/components/_shared/categoryChip'
import VoteOptionPill from '@/components/_shared/voteOptionPill'
import { useVoteAction } from '@/hooks/utils/useVoteAction'
import type { BestVoteResponse } from '@/api/votes'

interface Props {
  data: BestVoteResponse
}

export default function HomeVoteCard({ data }: Props) {
  const detailHref = `/poll/${data.voteId}?source=hot`
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { submit, isVoting, loginModal } = useVoteAction({
    voteId: data.voteId,
    detailHref,
    onVoted: (_res, optionId) => {
      setSelectedId((prev) => (prev === optionId ? null : optionId))
    },
  })

  return (
    <>
      <article className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.08)]">
        <Link href={detailHref} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <CategoryChip category={data.category} />
            <span className="typo-body-c-02 text-brand-gray-100">
              {data.createdBy}
            </span>
          </div>
          <h2 className="typo-heading-06 text-foreground">{data.title}</h2>
        </Link>

        <div className="flex flex-col gap-2">
          {data.options.slice(0, 2).map((opt, i) => (
            <VoteOptionPill
              key={opt.optionId}
              index={i}
              content={opt.content}
              isSelected={selectedId === opt.optionId}
              disabled={isVoting}
              onClick={() => submit(opt.optionId)}
            />
          ))}
        </div>

        <Link
          href={detailHref}
          className="flex items-center justify-between typo-body-c-02 text-brand-gray-100"
        >
          <span>{data.totalParticipants.toLocaleString()}명 참여</span>
          <span className="flex items-center gap-1">
            <Icon icon="tabler:message" width={16} aria-hidden />0
          </span>
        </Link>
      </article>
      {loginModal}
    </>
  )
}
