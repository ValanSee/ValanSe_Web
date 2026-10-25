import Link from 'next/link'
import { Icon } from '@iconify/react'
import Header from '@/components/_shared/header'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'
import type { CategoryMeta } from '@/constants/category'
import type { Vote } from '@/types/balanse/vote'

export interface TopicsSection {
  category: CategoryMeta
  votes: Vote[]
}

interface Props {
  popular: Vote[]
  sections: TopicsSection[]
}

const GUIDES = [
  {
    title: '밸런스게임이란?',
    body: '둘 중 하나만 고를 수 있는 질문에 답하는 게임이에요. 정답은 없고, 왜 그 쪽을 골랐는지 이야기하는 재미가 핵심이에요.',
  },
  {
    title: '어디서 하면 좋아요?',
    body: '커플·연인끼리 서로를 알아갈 때, 친구 모임이나 술자리에서 분위기를 띄울 때, 처음 만난 사람과 어색함을 풀 때 쓰기 좋아요.',
  },
  {
    title: '주제를 직접 만들 수도 있나요?',
    body: '네. 떠오르는 질문이 있다면 밸런스게임을 직접 만들어 다른 사람들의 선택을 받아 보세요.',
  },
]

/**
 * "밸런스게임 주제 추천" 모음 페이지 (/topics).
 * 서버에서 받은 인기 목록을 그대로 렌더해 검색어("밸런스게임 주제") 노출과 상세 페이지 내부 링크를 담당한다.
 */
export default function TopicsPage({ popular, sections }: Props) {
  return (
    <div
      className={cn(
        'flex min-h-screen flex-col bg-background pb-24',
        DESKTOP_PAGE_COLUMN,
      )}
    >
      <Header
        className="lg:hidden"
        titleAs="p"
        title="주제 추천"
        showBackButton
      />

      <div className="flex flex-col gap-4 px-4 pt-2 lg:gap-ds-6 lg:px-0 lg:pt-ds-8">
        <section className="flex flex-col gap-2">
          <h1 className="typo-heading-04 text-foreground">
            밸런스게임 주제 추천
          </h1>
          <p className="typo-body-b-01 text-brand-gray-200">
            커플·연인과 하기 좋은 연애 밸런스게임부터 친구·술자리에서 바로 쓰는
            음식·고민 질문까지, 지금 사람들이 가장 많이 고른 밸런스게임 주제를
            카테고리별로 모았어요. 마음에 드는 주제를 눌러 바로 투표해 보세요.
          </p>
        </section>

        {popular.length > 0 && (
          <TopicCard
            title="지금 인기 있는 밸런스게임 주제"
            moreHref="/balanse?sort=popular"
          >
            <ol className="-mx-2 flex flex-col">
              {popular.map((vote, index) => (
                <li key={vote.id}>
                  <TopicLink vote={vote} rank={index + 1} />
                </li>
              ))}
            </ol>
          </TopicCard>
        )}

        {sections.map(({ category, votes }) => (
          <TopicCard
            key={category.param}
            title={`${category.label} 밸런스게임 주제`}
            icon={category.icon}
            moreHref={`/balanse?category=${category.param}&sort=popular`}
          >
            <ul className="-mx-2 flex flex-col">
              {votes.map((vote) => (
                <li key={vote.id}>
                  <TopicLink vote={vote} />
                </li>
              ))}
            </ul>
          </TopicCard>
        ))}

        <TopicCard title="밸런스게임 이렇게 즐겨요">
          <dl className="flex flex-col gap-4">
            {GUIDES.map(({ title, body }) => (
              <div key={title} className="flex flex-col gap-1">
                <dt className="typo-title-03 text-foreground">{title}</dt>
                <dd className="typo-body-c-01 text-brand-gray-200">{body}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/create"
            className="typo-label-02 mt-1 flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"
          >
            밸런스게임 만들기
          </Link>
        </TopicCard>
      </div>

      <BottomNavBar />
    </div>
  )
}

function TopicCard({
  title,
  icon,
  moreHref,
  children,
}: {
  title: string
  icon?: string
  moreHref?: string
  children: React.ReactNode
}) {
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
