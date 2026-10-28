import Link from 'next/link'
import Header from '@/components/_shared/header'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import { TopicCard } from '@/components/pages/topics/topicCard'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'
import { CATEGORIES } from '@/constants/category'
import { ABOUT_FAQS } from '@/constants/about'

/**
 * 서비스 소개 · 자주 묻는 질문 페이지 (/about).
 * AI 검색이 "ValanSe 가 뭐야" 류 질문에 인용할 수 있도록 서비스 설명을 정적 문구로 둔다.
 */
export default function AboutPage() {
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
        title="서비스 소개"
        showBackButton
      />

      <div className="flex flex-col gap-4 px-4 pt-2 lg:gap-ds-6 lg:px-0 lg:pt-ds-8">
        <section className="flex flex-col gap-2">
          <h1 className="typo-heading-04 text-foreground">
            ValanSe(발란세) 소개
          </h1>
          <p className="typo-body-b-01 text-brand-gray-200">
            ValanSe(발란세)는 둘 중 하나를 골라 투표하고, 다른 사람들이 무엇을
            골랐는지 바로 확인하는 밸런스게임 서비스예요.{' '}
            {CATEGORIES.map((c) => c.label).join('·')} {CATEGORIES.length}개
            카테고리의 질문이 있고, 누구나 직접 게임을 만들어 친구와 공유할 수
            있어요.
          </p>
        </section>

        <TopicCard title="자주 묻는 질문">
          <dl className="flex flex-col gap-4">
            {ABOUT_FAQS.map(({ question, answer, link }) => (
              <div key={question} className="flex flex-col gap-1">
                <dt className="typo-title-03 text-foreground">{question}</dt>
                <dd className="typo-body-c-01 text-brand-gray-200">
                  {answer}
                  {link &&
                    (link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-primary underline"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="ml-1 text-primary underline"
                      >
                        {link.label}
                      </Link>
                    ))}
                </dd>
              </div>
            ))}
          </dl>
        </TopicCard>
      </div>

      <BottomNavBar />
    </div>
  )
}
