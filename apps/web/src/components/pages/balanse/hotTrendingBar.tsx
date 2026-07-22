'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { Chip } from '@/components/ui/chip'
import {
  fetchTrendingVotes,
  type TrendingVoteItem,
} from '@/api/pages/valanse/trendingVoteApi'

/** 조회 기간(일) — hotissue/trending 통합 API의 days 파라미터 */
const TRENDING_DAYS = 7

/**
 * 밸런스 게임 리스트 상단 HOT(인기 급상승) 드롭다운. Figma 노드 6651:12395 참조.
 * 접힘: 1위 제목만 노출 · 펼침: 1~5위 랭킹(각 항목 클릭 시 상세로 이동).
 */
export default function HotTrendingBar() {
  const [votes, setVotes] = useState<TrendingVoteItem[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchTrendingVotes(TRENDING_DAYS)
      .then((res) => setVotes(res?.votes ?? []))
      .catch(() => {})
  }, [])

  if (votes.length === 0) return null

  const [top] = votes

  return (
    <div className="border-b-8 border-brand-gray-50 bg-card px-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 py-3 text-left"
      >
        <Chip size="s" status="primary" className="shrink-0 bg-brand-violet-200">
          HOT
        </Chip>
        <span className="typo-title-04 min-w-0 flex-1 truncate text-foreground">
          {top.title}
        </span>
        <Icon
          icon="mingcute:down-line"
          width={24}
          className={cn(
            'shrink-0 text-brand-gray-100 transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul className="flex flex-col pb-2 duration-200 animate-in fade-in slide-in-from-top-1">
          {votes.map((vote, index) => (
            <li key={vote.voteId}>
              <Link
                href={`/poll/${vote.voteId}`}
                className="flex items-center gap-3 rounded-lg px-1 py-2.5 hover:bg-brand-gray-50"
              >
                <span className="typo-label-01 w-5 shrink-0 text-center text-primary">
                  {index + 1}
                </span>
                <span className="typo-body-b-01 min-w-0 flex-1 truncate text-foreground">
                  {vote.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
