'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import CategoryChip from '@/components/_shared/categoryChip'
import VsBadge from '@/components/_shared/vsBadge'
import VoteOptionPill from '@/components/_shared/voteOptionPill'
import { useVoteAction } from '@/hooks/utils/useVoteAction'
import type { Vote } from '@/types/balanse/vote'

interface Props {
  data: Vote
}

export default function BalanseVoteCard({ data }: Props) {
  const detailHref = `/poll/${data.id}?source=balance`
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const { submit, isVoting, loginModal } = useVoteAction({
    voteId: data.id,
    detailHref,
    onVoted: (_res, optionId) => {
      setSelectedId((prev) => (prev === optionId ? null : optionId))
    },
  })

  return (
    <>
      <article className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.08)]">
        <Link href={detailHref} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CategoryChip category={data.category} />
            <span className="typo-body-c-02 text-brand-gray-100">
              {data.nickname} · {data.created_at}
            </span>
          </div>
          <h3 className="typo-heading-06 text-foreground">{data.title}</h3>
          {data.content && (
            <p className="typo-body-b-01 line-clamp-2 text-brand-gray-200">
              {data.content}
            </p>
          )}
        </Link>

        {data.options?.length >= 2 && (
          <div className="relative flex flex-col gap-3">
            <VsBadge />
            {data.options.slice(0, 2).map((opt, idx) => (
              <VoteOptionPill
                key={opt.id}
                index={idx}
                content={opt.content}
                isSelected={selectedId === opt.id}
                disabled={isVoting}
                onClick={() => submit(opt.id)}
              />
            ))}
          </div>
        )}

        <Link
          href={detailHref}
          className="flex items-center justify-between typo-body-c-02"
        >
          <span className="typo-label-03 text-primary">
            {data.total_vote_count}명 참여 중
          </span>
          <span className="flex items-center gap-1 text-brand-gray-100">
            <Icon icon="tabler:message" width={16} aria-hidden />
            {data.total_comment_count}
          </span>
        </Link>
      </article>
      {loginModal}
    </>
  )
}
