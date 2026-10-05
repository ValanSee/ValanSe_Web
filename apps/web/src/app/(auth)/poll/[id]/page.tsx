import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PollDetailPage from '@/components/pages/poll/pollDetailPage'
import { fetchPollDetailForServer } from '@/api/pages/poll/pollDetailServer'
import { getCategoryMeta } from '@/constants/category'
import { BASE_OPEN_GRAPH, SITE_NAME, SITE_URL } from '@/constants/seo'
import { JsonLd } from '@/components/_shared/jsonLd'
import type { PollDetail } from '@/api/pages/poll/pollDetailServer'

type Props = {
  params: Promise<{ id: string }>
}

const DESCRIPTION_MAX = 150

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
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
      ...BASE_OPEN_GRAPH,
      type: 'article',
      url: path,
      title: pageTitle,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: ['/og-image.png'],
    },
  }
}

// createdAt 은 시간대 없이 내려오므로 날짜만 사용
const toDate = (createdAt: string) => createdAt.slice(0, 10)

function buildJsonLd(poll: PollDetail) {
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
      text: [poll.content?.trim(), versus].filter(Boolean).join('\n'),
      datePublished: toDate(poll.createdAt),
      author: { '@type': 'Person', name: poll.creatorNickname },
      ...(category && { articleSection: category.label }),
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

export default async function Page({ params }: Props) {
  const { id } = await params
  const result = await fetchPollDetailForServer(id)

  if (result.status === 'not-found') notFound()

  // API 오류·타임아웃이면 null 로 넘겨 기존처럼 클라이언트에서 다시 조회
  if (result.status !== 'ok') return <PollDetailPage initialData={null} />

  return (
    <>
      {buildJsonLd(result.data).map((data) => (
        <JsonLd key={String(data['@type'])} data={data} />
      ))}
      <PollDetailPage initialData={result.data} />
    </>
  )
}
