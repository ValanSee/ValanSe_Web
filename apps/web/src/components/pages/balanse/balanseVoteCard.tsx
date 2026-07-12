import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Chip } from '@/components/ui/chip'
import type { Vote } from '@/types/balanse/vote'

const CATEGORY_LABEL: Record<string, string> = {
  LOVE: '연애',
  FOOD: '음식',
  BUY: '살까말까',
  SPORT: '스포츠',
  WORRY: '고민',
  ETC: '기타',
}

interface Props {
  data: Vote
}

/**
 * 밸런스 목록 카드. Figma 노드 6397:26818 참조.
 */
export default function BalanseVoteCard({ data }: Props) {
  return (
    <Link
      href={`/poll/${data.id}?source=balance`}
      className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center gap-2">
        <Chip size="s" status="secondary">
          {CATEGORY_LABEL[data.category] ?? data.category}
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
        <div className="flex flex-col gap-2">
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
      <div className="flex items-center gap-4 typo-body-c-02 text-brand-gray-100">
        <span className="flex items-center gap-1">
          <Icon icon="tabler:users" width={16} aria-hidden />
          {data.total_vote_count}
        </span>
        <span className="flex items-center gap-1">
          <Icon icon="tabler:message" width={16} aria-hidden />
          {data.total_comment_count}
        </span>
      </div>
    </Link>
  )
}
