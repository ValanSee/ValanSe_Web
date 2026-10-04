import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PollDetailPage from '@/components/pages/poll/pollDetailPage'
import { fetchPollDetailForServer } from '@/api/pages/poll/pollDetailServer'
import { getCategoryMeta } from '@/constants/category'
import { BASE_OPEN_GRAPH } from '@/constants/seo'

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

export default async function Page({ params }: Props) {
  const { id } = await params
  const result = await fetchPollDetailForServer(id)

  if (result.status === 'not-found') notFound()

  // API 오류·타임아웃이면 null 로 넘겨 기존처럼 클라이언트에서 다시 조회
  return (
    <PollDetailPage initialData={result.status === 'ok' ? result.data : null} />
  )
}
