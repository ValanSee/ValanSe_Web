import { Icon } from '@iconify/react'
import { useAppSelector } from '@/hooks/utils/useAppSelector'
import { MyVoteHistoryItem } from '@/types/my/history'
import { Chip } from '@/components/ui/chip'
import { numberToAlphabet } from '@/utils/map'

const CATEGORY_LABEL: Record<string, string> = {
  LOVE: '연애',
  FOOD: '음식',
  BUY: '살까말까',
  SPORT: '스포츠',
  WORRY: '고민',
  ETC: '기타',
}

export default function BalanseHistoryCard({
  data,
  onClick,
}: {
  data: MyVoteHistoryItem
  onClick?: () => void
}) {
  const nickname = useAppSelector((s) => s.member.profile?.nickname)

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col gap-3 rounded-2xl bg-card p-5 text-left shadow-[0_0_4px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center gap-2">
        <Chip size="s" status="secondary">
          {CATEGORY_LABEL[data.category] ?? data.category}
        </Chip>
        <span className="typo-body-c-02 text-brand-gray-100">
          {nickname} · {data.createdAt}
        </span>
      </div>
      <h3 className="typo-heading-06 text-foreground">{data.title}</h3>
      {data.content && (
        <p className="typo-body-b-01 line-clamp-2 text-brand-gray-200">
          {data.content}
        </p>
      )}
      <div className="flex flex-col gap-1">
        {data.options.map((opt, index) => (
          <div
            key={index}
            className="typo-body-b-01 text-brand-gray-200"
          >
            <span className="mr-1 text-primary">{numberToAlphabet(index)}</span>
            {opt.content}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 typo-body-c-02 text-brand-gray-100">
        <Icon icon="tabler:users" width={16} aria-hidden />
        {data.totalVoteCount}
      </div>
    </button>
  )
}
