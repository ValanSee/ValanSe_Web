import type { Metadata } from 'next'
import { BASE_OPEN_GRAPH } from '@/constants/seo'
import BalansePage from '../../../components/pages/balanse/balansePage'
import { getCategoryMeta } from '@/constants/category'

type Props = {
  searchParams: Promise<{ category?: string | string[] }>
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { category } = await searchParams
  const meta = typeof category === 'string' ? getCategoryMeta(category) : null

  // 카테고리별 목록은 sitemap 에 별도 URL 로 올라가므로 canonical 도 카테고리 단위로 분리
  const path = meta ? `/balanse?category=${meta.param}` : '/balanse'
  const title = meta ? `${meta.label} 밸런스게임 모음` : '밸런스게임 모음'
  const description = meta
    ? `${meta.label} 밸런스게임 질문 모음. 둘 중 하나를 골라 투표하고 다른 사람들의 선택을 확인해 보세요.`
    : '카테고리별 인기 밸런스게임 질문 모음. 둘 중 하나를 골라 투표하고 다른 사람들의 선택을 확인해 보세요.'

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...BASE_OPEN_GRAPH, url: path, title, description },
  }
}

function Balanse() {
  return <BalansePage />
}

export default Balanse
