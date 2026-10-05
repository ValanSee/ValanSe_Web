'use client'

import Link from 'next/link'
import { getCategoryMeta } from '@/constants/category'
import { useReportedContent } from '@/hooks/utils/useReportedContent'
import type { Vote } from '@/types/balanse/vote'

const MAX_ITEMS = 5

interface Props {
  currentVoteId: number
  category: string
  /** 같은 카테고리 인기순 (서버 조회) */
  related: Vote[]
  /** 전체 최신순 (서버 조회) */
  latest: Vote[]
}

/**
 * 투표 상세 PC(lg) 우측 사이드바. 다른 투표로의 내부 링크를 SSR HTML 에 담는다.
 */
export default function PollSidebar({
  currentVoteId,
  category,
  related,
  latest,
}: Props) {
  const { isReported } = useReportedContent()
  const visible = (votes: Vote[]) =>
    votes
      .filter((v) => v.id !== currentVoteId && !isReported('VOTE', v.id))
      .slice(0, MAX_ITEMS)

  const categoryMeta = getCategoryMeta(category)
  const relatedVotes = visible(related)
  const latestVotes = visible(latest)

  return (
    <aside className="hidden flex-col gap-ds-4 lg:flex">
      {relatedVotes.length > 0 && (
        <SidebarSection
          title={
            categoryMeta ? `${categoryMeta.label} 인기 밸런스` : '인기 밸런스'
          }
          moreHref={
            categoryMeta
              ? `/balanse?category=${categoryMeta.param}&sort=popular`
              : '/balanse?sort=popular'
          }
          votes={relatedVotes}
        />
      )}
      {latestVotes.length > 0 && (
        <SidebarSection
          title="새로 올라온 밸런스"
          moreHref="/balanse"
          votes={latestVotes}
        />
      )}
    </aside>
  )
}

function SidebarSection({
  title,
  moreHref,
  votes,
}: {
  title: string
  moreHref: string
  votes: Vote[]
}) {
  return (
    <section className="flex flex-col gap-ds-3 rounded-2xl bg-card p-ds-5 shadow-[0_0_4px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="typo-title-02 text-foreground">{title}</h2>
        <Link
          href={moreHref}
          className="typo-label-03 text-brand-gray-100 hover:text-primary"
        >
          더보기
        </Link>
      </div>
      <ul className="flex flex-col">
        {votes.map((v) => (
          <li
            key={v.id}
            className="border-t border-brand-gray-50 first:border-t-0"
          >
            <Link
              href={`/poll/${v.id}`}
              className="group flex flex-col gap-ds-1 py-ds-3"
            >
              <span className="typo-title-04 line-clamp-2 text-foreground group-hover:text-primary">
                {v.title}
              </span>
              {v.options.length >= 2 && (
                <span className="typo-body-c-02 truncate text-brand-gray-100">
                  {v.options[0].content} vs {v.options[1].content}
                </span>
              )}
              <span className="typo-label-03 text-primary">
                {v.total_vote_count.toLocaleString()}명 참여
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
