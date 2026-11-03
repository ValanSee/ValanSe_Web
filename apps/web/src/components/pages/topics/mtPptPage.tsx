import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/_shared/header'
import BottomNavBar from '@/components/_shared/nav/bottomNavBar'
import { TopicCard } from './topicCard'
import MtPptDownloadButton from './mtPptDownloadButton'
import { cn } from '@/lib/utils'
import { DESKTOP_PAGE_COLUMN } from '@/constants/layout'
import { EVENT_INQUIRY_FORM_URL } from '@/constants/url'
import {
  MT_PPT_FAQS,
  MT_PPT_PREVIEWS,
  MT_PPT_QUESTIONS,
  MT_PPT_SLIDE_COUNT,
  MT_PPT_STEPS,
} from '@/constants/mtPpt'

/**
 * MT·모임용 밸런스게임 무료 샘플 PPT 페이지 (/topics/mt-ppt).
 * "MT 밸런스게임 PPT" 검색 유입 → 샘플 다운로드 → 맞춤 세트 문의로 이어지게 한다.
 * 질문 목록은 각 투표 상세로 링크해 내부 링크(크롤링 경로) 역할도 한다.
 */
export default function MtPptPage() {
  const previewGrid = (
    <ul className="grid grid-cols-2 gap-2 lg:gap-ds-3">
      {MT_PPT_PREVIEWS.map(({ src, alt }, index) => (
        <li
          key={src}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <Image
            src={src}
            alt={alt}
            width={1280}
            height={720}
            sizes="(min-width: 1024px) 380px, 50vw"
            // 첫 화면에 보이는 미리보기라 lazy 로딩 대신 먼저 받는다
            priority={index < 2}
            className="h-auto w-full"
          />
        </li>
      ))}
    </ul>
  )

  const questionList = (
    <ol className="-mx-2 flex flex-col">
      {MT_PPT_QUESTIONS.map(({ id, title, options }, index) => (
        <li key={id}>
          <Link
            href={`/poll/${id}`}
            className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-brand-gray-50"
          >
            <span className="typo-label-03 w-5 shrink-0 pt-0.5 text-primary">
              {index + 1}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="typo-title-03 text-foreground">{title}</span>
              <span className="typo-body-c-02 text-brand-gray-100">
                {options.join(' vs ')}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )

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
        title="MT 밸런스게임 PPT"
        showBackButton
      />

      <div className="flex flex-col gap-4 px-4 pt-2 lg:gap-ds-6 lg:px-0 lg:pt-ds-8">
        <section className="flex flex-col gap-2">
          <h1 className="typo-heading-04 text-foreground">
            MT 밸런스게임 PPT 무료 다운로드
          </h1>
          <p className="typo-body-b-01 text-brand-gray-200">
            MT·동아리·워크숍·송년회에서 프로젝터에 바로 띄우는 밸런스게임
            PPT예요. 사람들이 실제로 많이 고른 질문 {MT_PPT_QUESTIONS.length}
            개를 질문 장과 공개 장 {MT_PPT_SLIDE_COUNT}장으로 묶었어요. 회원가입
            없이 무료로 내려받으세요.
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-[0_0_4px_rgba(0,0,0,0.06)]">
          {previewGrid}
          <MtPptDownloadButton />
          <p className="typo-body-c-02 text-center text-brand-gray-100">
            PPTX · {MT_PPT_SLIDE_COUNT}장 · 약 90KB · 파워포인트·키노트·구글
            슬라이드
          </p>
        </section>

        <TopicCard title="이렇게 쓰면 돼요">
          <ol className="flex flex-col gap-4">
            {MT_PPT_STEPS.map(({ title, body }, index) => (
              <li key={title} className="flex gap-3">
                <span className="typo-label-02 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {index + 1}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="typo-title-03 text-foreground">{title}</span>
                  <span className="typo-body-c-01 text-brand-gray-200">
                    {body}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </TopicCard>

        <TopicCard
          title={`들어 있는 질문 ${MT_PPT_QUESTIONS.length}개`}
          moreHref="/topics"
        >
          {questionList}
        </TopicCard>

        <TopicCard title="우리 모임에 딱 맞춘 세트가 필요하다면">
          <p className="typo-body-c-01 text-brand-gray-200">
            모임 성격·인원·분위기에 맞춘 질문 25개를 PPT와 참여자 폰 투표 링크로
            만들어 드려요. 결과는 그 자리 사람들의 선택만 모아서 보여 줘요.
          </p>
          <p className="typo-title-03 text-foreground">
            행사 1회 3만 원 · 문의 후 2일 안에 전달
          </p>
          <a
            href={EVENT_INQUIRY_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="typo-label-02 flex h-11 items-center justify-center rounded-xl border border-primary bg-card text-primary transition-colors hover:bg-brand-violet-50"
          >
            맞춤 세트 문의하기
          </a>
        </TopicCard>

        <TopicCard title="자주 묻는 질문">
          <dl className="flex flex-col gap-4">
            {MT_PPT_FAQS.map(({ question, answer }) => (
              <div key={question} className="flex flex-col gap-1">
                <dt className="typo-title-03 text-foreground">{question}</dt>
                <dd className="typo-body-c-01 text-brand-gray-200">{answer}</dd>
              </div>
            ))}
          </dl>
        </TopicCard>
      </div>

      <BottomNavBar />
    </div>
  )
}
