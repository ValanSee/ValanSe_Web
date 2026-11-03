import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PollDetailPage from '@/components/pages/poll/pollDetailPage'
import {
  fetchPollCommentsForServer,
  fetchPollDetailForServer,
} from '@/api/pages/poll/pollDetailServer'
import PollSidebarServer from '@/components/pages/poll/pollSidebarServer'
import RelatedPollsServer from '@/components/pages/poll/relatedPollsServer'
import { getCategoryMeta } from '@/constants/category'
import { BASE_OPEN_GRAPH, SITE_NAME, SITE_URL } from '@/constants/seo'
import { JsonLd } from '@/components/_shared/jsonLd'
import type { PollDetail } from '@/api/pages/poll/pollDetailServer'

type Props = {
  params: Promise<{ id: string }>
}

const DESCRIPTION_MAX = 150
const { images: _baseImages, ...OPEN_GRAPH_WITHOUT_IMAGES } = BASE_OPEN_GRAPH

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

// AI 검색·검색 스니펫이 인용할 수 있도록 결과를 문장으로 (예: "41명 참여 · 마라탕 41% · 피자 29%")
// 화면 UI 는 그대로(투표 후 공개) — 메타·JSON-LD 에만 사용
// 표본이 너무 작으면 "1명 참여 · 100%" 처럼 의미 없는 수치가 되므로 생략
const MIN_VOTES_FOR_SUMMARY = 5

function summarizeResults({ totalVoteCount, options }: PollDetail) {
  if (totalVoteCount < MIN_VOTES_FOR_SUMMARY) return undefined
  const ranked = [...options]
    .sort((a, b) => b.voteCount - a.voteCount)
    .map(
      (o) =>
        `${o.content} ${Math.round((o.voteCount / totalVoteCount) * 100)}%`,
    )
  return [`${totalVoteCount}명 참여`, ...ranked].join(' · ')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const path = `/poll/${id}`
  const result = await fetchPollDetailForServer(id)

  if (result.status !== 'ok') {
    return {
      alternates: { canonical: path },
      openGraph: { ...BASE_OPEN_GRAPH, url: path },
    }
  }

  const { title, content, category, options } = result.data
  const versus = options.map((o) => o.content).join(' vs ')
  const categoryLabel = getCategoryMeta(category)?.label
  const description = truncate(
    [
      content?.trim(),
      versus,
      summarizeResults(result.data),
      '둘 중 하나를 골라 투표하고 결과를 확인해 보세요.',
    ]
      .filter(Boolean)
      .join(' · '),
    DESCRIPTION_MAX,
  )
  const pageTitle = categoryLabel
    ? `${title} - ${categoryLabel} 밸런스게임`
    : `${title} - 밸런스게임`

  return {
    title: pageTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      // images 를 지정하면 opengraph-image.tsx(게임별 이미지)가 무시되므로 공통 이미지는 제외
      ...OPEN_GRAPH_WITHOUT_IMAGES,
      type: 'article',
      url: path,
      title: pageTitle,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      // 이미지는 opengraph-image.tsx (게임별 생성) → twitter 도 og:image 를 그대로 사용
    },
  }
}

// createdAt 은 시간대 없이 내려오므로 날짜만 사용
const toDate = (createdAt: string) => createdAt.slice(0, 10)

function buildJsonLd(poll: PollDetail, commentCount: number | null) {
  const url = `${SITE_URL}/poll/${poll.voteId}`
  const category = getCategoryMeta(poll.category)
  const versus = poll.options.map((o) => o.content).join(' vs ')

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'DiscussionForumPosting',
      '@id': url,
      url,
      mainEntityOfPage: url,
      headline: poll.title,
      text: [poll.content?.trim(), versus, summarizeResults(poll)]
        .filter(Boolean)
        .join('\n'),
      datePublished: toDate(poll.createdAt),
      author: { '@type': 'Person', name: poll.creatorNickname },
      ...(category && { articleSection: category.label }),
      // 참여(투표) 수. 검색엔진이 토론 활성도 판단에 쓰는 지표
      // 댓글 수 (2026-03 구글 권장 항목). 조회 실패 시 생략
      ...(commentCount !== null && { commentCount }),
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/VoteAction',
        userInteractionCount: poll.totalVoteCount,
      },
      inLanguage: 'ko-KR',
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: category ? `${category.label} 밸런스게임` : '밸런스게임',
          item: category
            ? `${SITE_URL}/balanse?category=${category.param}`
            : `${SITE_URL}/balanse`,
        },
        { '@type': 'ListItem', position: 3, name: poll.title, item: url },
      ],
    },
  ]
}

// (public) 그룹에는 loading.tsx · Suspense 레이아웃을 두지 않는다.
// 응답이 스트리밍되기 전에 notFound() 가 실행돼야 없는 게임이 실제 HTTP 404 로 내려간다 (소프트 404 방지)
export default async function Page({ params }: Props) {
  const { id } = await params
  // 댓글도 함께 받아 첫 HTML 에 담는다 (클라이언트 조회 후 아래 영역이 밀리는 CLS 방지 · 댓글 텍스트 색인)
  const [result, initialComments] = await Promise.all([
    fetchPollDetailForServer(id),
    fetchPollCommentsForServer(id),
  ])

  if (result.status === 'not-found') notFound()

  // API 오류·타임아웃이면 null 로 넘겨 기존처럼 클라이언트에서 다시 조회
  if (result.status !== 'ok') return <PollDetailPage initialData={null} />

  return (
    <>
      {buildJsonLd(
        result.data,
        initialComments.best?.totalCommentCount ?? null,
      ).map((data) => (
        <JsonLd key={String(data['@type'])} data={data} />
      ))}
      <PollDetailPage
        initialData={result.data}
        initialComments={initialComments}
        sidebar={
          // PC 사이드바는 따로 스트리밍 (목록 조회가 느려도 본문은 먼저 응답)
          <Suspense fallback={null}>
            <PollSidebarServer
              voteId={result.data.voteId}
              category={result.data.category}
            />
          </Suspense>
        }
        related={
          <Suspense fallback={null}>
            <RelatedPollsServer
              voteId={result.data.voteId}
              category={result.data.category}
            />
          </Suspense>
        }
      />
    </>
  )
}
