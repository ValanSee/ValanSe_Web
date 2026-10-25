'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { getCategoryMeta } from '@/constants/category'
import { useReportedContent } from '@/hooks/utils/useReportedContent'
import type { Vote } from '@/types/balanse/vote'

interface Props {
  category: string
  votes: Vote[]
}

/**
 * 투표 상세 하단 "같은 카테고리 밸런스게임" 목록.
 * 서버에서 받은 목록을 그대로 렌더해 크롤러가 다른 상세 페이지로 이어지는 링크를 따라갈 수 있게 한다.
 */
export default function RelatedPolls({ category, votes }: Props) {
  const { isReported } = useReportedContent()
  const meta = getCategoryMeta(category)
  // 내가 신고한 투표는 목록과 동일하게 감춘다
  const visibleVotes = votes.filter((v) => !isReported('VOTE', v.id))

  if (visibleVotes.length === 0) return null

  const label = meta ? `${meta.label} 밸런스게임` : '밸런스게임'
  const listHref = meta ? `/balanse?category=${meta.param}` : '/balanse'

  return (
    <section
      aria-labelledby="related-polls-title"
      className="mt-4 flex flex-col gap-2 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-between">
        <h2 id="related-polls-title" className="typo-title-03 text-foreground">
          {label} 더 보기
        </h2>
        <Link
          href={listHref}
          className="typo-label-03 flex items-center text-brand-gray-100 hover:text-foreground"
        >
          전체
          <Icon icon="mingcute:right-line" width={16} aria-hidden />
        </Link>
      </div>
      <ul className="-mx-2 flex flex-col">
        {visibleVotes.map((vote) => (
          <li key={vote.id}>
            <Link
              href={`/poll/${vote.id}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-brand-gray-50"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="typo-body-b-01 truncate text-foreground">
                  {vote.title}
                </span>
                {vote.options.length > 0 && (
                  <span className="typo-body-c-01 truncate text-brand-gray-100">
                    {vote.options.map((o) => o.content).join(' vs ')}
                  </span>
                )}
              </div>
              <span className="typo-label-03 shrink-0 text-brand-gray-100">
                {vote.total_vote_count.toLocaleString()}명
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
