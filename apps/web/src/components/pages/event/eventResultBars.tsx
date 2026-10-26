import { cn } from '@/lib/utils'
import type { EventOption } from '@/lib/event/types'

interface Props {
  options: EventOption[]
  counts: Record<string, number>
  /** 프로젝터용 큰 글자 */
  large?: boolean
  className?: string
}

/** 현재 질문의 선택 비율 막대. 1위는 보라, 나머지는 연보라 */
export default function EventResultBars({
  options,
  counts,
  large,
  className,
}: Props) {
  const total = options.reduce((s, o) => s + (counts[o.label] ?? 0), 0)
  const max = Math.max(0, ...options.map((o) => counts[o.label] ?? 0))

  return (
    <ul className={cn('flex flex-col', large ? 'gap-ds-6' : 'gap-ds-3', className)}>
      {options.map((o) => {
        const count = counts[o.label] ?? 0
        const pct = total ? Math.round((count / total) * 100) : 0
        const win = total > 0 && count === max
        return (
          <li key={o.label} className="flex flex-col gap-ds-2">
            <div className="flex items-end justify-between gap-ds-4">
              <span
                className={cn(
                  'flex min-w-0 items-center gap-ds-3',
                  large ? 'text-3xl font-semibold' : 'typo-title-03',
                  win ? 'text-foreground' : 'text-brand-gray-200',
                )}
              >
                <span
                  className={cn(
                    'flex shrink-0 items-center justify-center rounded-full font-bold',
                    large ? 'h-12 w-12 text-2xl' : 'h-8 w-8 typo-label-02',
                    win
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-brand-violet-50 text-brand-violet-500',
                  )}
                >
                  {o.label}
                </span>
                <span className="truncate">{o.content}</span>
              </span>
              <span
                className={cn(
                  'shrink-0 font-bold tabular-nums',
                  large ? 'text-5xl' : 'typo-heading-04',
                  win ? 'text-primary' : 'text-brand-gray-100',
                )}
              >
                {pct}%
                <span
                  className={cn(
                    'ml-ds-2 font-medium text-brand-gray-100',
                    large ? 'text-2xl' : 'typo-body-c-02',
                  )}
                >
                  {count}명
                </span>
              </span>
            </div>
            <div
              className={cn(
                'w-full overflow-hidden rounded-full bg-brand-gray-50',
                large ? 'h-6' : 'h-3',
              )}
              role="presentation"
            >
              <div
                className={cn(
                  'h-full rounded-full transition-[width] duration-500',
                  win ? 'bg-primary' : 'bg-brand-violet-100',
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
