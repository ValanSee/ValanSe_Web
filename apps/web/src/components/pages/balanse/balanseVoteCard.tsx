import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Chip } from '@/components/ui/chip'
import type { Vote } from '@/types/balanse/vote'
import { getCategoryMeta } from '@/constants/category'

interface Props {
  data: Vote
}

/**
 * 밸런스 목록 카드. Figma 노드 6397:26818 참조.
 */
export default function BalanseVoteCard({ data }: Props) {
  const category = getCategoryMeta(data.category)
  return (
    <Link
      href={`/poll/${data.id}?source=balance`}
      className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center gap-2">
        <Chip
          size="s"
          status="secondary"
          className="hover:bg-brand-violet-50"
          icon={
            category && (
              <Icon icon={category.icon} width={14} aria-hidden />
            )
          }
        >
          {category?.label ?? data.category}
        </Chip>
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
      {data.options?.length >= 2 && (
        <div className="relative flex flex-col gap-3">
          <div
            className="typo-title-04 pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground"
            aria-hidden
          >
            VS
          </div>
          {data.options.slice(0, 2).map((opt, idx) => (
            <div
              key={opt.id}
              className="typo-label-02 flex items-center gap-3 rounded-xl bg-brand-gray-50 px-4 py-3 text-primary"
            >
              <span className="typo-heading-06">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 truncate">{opt.content}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between typo-body-c-02">
        <span className="typo-label-03 text-primary">
          {data.total_vote_count}명 참여 중
        </span>
        <span className="flex items-center gap-1 text-brand-gray-100">
          <Icon icon="tabler:message" width={16} aria-hidden />
          {data.total_comment_count}
        </span>
      </div>
    </Link>
  )
}
