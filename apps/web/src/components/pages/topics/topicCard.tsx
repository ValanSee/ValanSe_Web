'use client'

import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { useReportedContent } from '@/hooks/utils/useReportedContent'
import type { Vote } from '@/types/balanse/vote'

interface TopicCardProps {
  title: string
  icon?: string
  moreHref?: string
  children: React.ReactNode
}

/** 주제 추천 페이지 공통 카드 (제목 · 더보기) */
export function TopicCard({ title, icon, moreHref, children }: TopicCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="typo-title-02 flex items-center gap-2 text-foreground">
          {icon && <Icon icon={icon} width={22} aria-hidden />}
          {title}
        </h2>
        {moreHref && (
          <Link
            href={moreHref}
            className="typo-label-03 flex shrink-0 items-center text-brand-gray-100 hover:text-foreground"
          >
            더보기
            <Icon icon="mingcute:right-line" width={16} aria-hidden />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

interface TopicVoteCardProps extends Omit<TopicCardProps, 'children'> {
  votes: Vote[]
  /** 순위 번호 노출 (인기 목록) */
  ranked?: boolean
}

/**
 * 게임 목록 카드. 내가 신고한 투표는 다른 목록 화면과 동일하게 감추고, 전부 감춰지면 카드도 숨긴다.
 * 신고 기록은 기기에만 있어 서버 HTML(크롤러)에는 항상 전체 목록이 담긴다.
 */
export function TopicVoteCard({ votes, ranked, ...card }: TopicVoteCardProps) {
  const { isReported } = useReportedContent()
  const visibleVotes = votes.filter((v) => !isReported('VOTE', v.id))

  if (visibleVotes.length === 0) return null

  const ListTag = ranked ? 'ol' : 'ul'

  return (
    <TopicCard {...card}>
      <ListTag className="-mx-2 flex flex-col">
        {visibleVotes.map((vote, index) => (
          <li key={vote.id}>
            <TopicLink vote={vote} rank={ranked ? index + 1 : undefined} />
          </li>
        ))}
      </ListTag>
    </TopicCard>
  )
}

function TopicLink({ vote, rank }: { vote: Vote; rank?: number }) {
  return (
    <Link
      href={`/poll/${vote.id}`}
      className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-brand-gray-50"
    >
      {rank !== undefined && (
        <span className="typo-label-01 w-5 shrink-0 text-center text-primary">
          {rank}
        </span>
      )}
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
  )
}
