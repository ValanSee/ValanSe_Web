'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Chip } from '@/components/ui/chip'
import type { BestVoteResponse } from '@/api/votes'

interface Props {
  data: BestVoteResponse
}

const CATEGORY_LABEL: Record<string, string> = {
  LOVE: '연애',
  FOOD: '음식',
  BUY: '살까말까',
  SPORT: '스포츠',
  WORRY: '고민',
  ETC: '기타',
  ALL: '전체',
}

/**
 * 홈 화면의 텍스트형 투표 카드. Figma 노드 6397:26776 참조.
 * - 상단: 카테고리 chip · 작성자 · N분 전
 * - 제목: Heading-06
 * - 선택지 A/B 요약
 * - 하단: 참여자 수 + 댓글 아이콘
 */
export default function HomeVoteCard({ data }: Props) {
  return (
    <Link
      href={`/poll/${data.voteId}?source=hot`}
      className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center gap-2">
        <Chip size="s" status="secondary">
          {CATEGORY_LABEL[data.category] ?? data.category}
        </Chip>
        <span className="typo-body-c-02 text-brand-gray-100">
          {data.createdBy}
        </span>
      </div>
      <h2 className="typo-heading-06 text-foreground">{data.title}</h2>
      <div className="flex flex-col gap-2">
        {data.options.slice(0, 2).map((opt, i) => (
          <div
            key={opt.optionId}
            className="typo-label-02 flex items-center gap-3 rounded-xl bg-brand-gray-50 px-4 py-3 text-primary"
          >
            <span className="typo-heading-06">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1 truncate">{opt.content}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between typo-body-c-02 text-brand-gray-100">
        <span>{data.totalParticipants.toLocaleString()}명 참여</span>
        <span className="flex items-center gap-1">
          <Icon icon="tabler:message" width={16} aria-hidden />0
        </span>
      </div>
    </Link>
  )
}
