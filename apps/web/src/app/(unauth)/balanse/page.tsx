import type { Metadata } from 'next'
import { BASE_OPEN_GRAPH } from '@/constants/seo'
import BalansePage, {
  type BalanseInitialData,
} from '../../../components/pages/balanse/balansePage'
import { getCategoryMeta } from '@/constants/category'
import { fetchVotesForServer } from '@/api/pages/valanse/listServer'

type Props = {
  searchParams: Promise<{
    category?: string | string[]
    sort?: string | string[]
  }>
}

// 첫 화면 SSR 개수. 크롤러가 따라갈 /poll 링크를 충분히 담기 위해 클라이언트 페이지 크기(5)보다 크게
const SSR_PAGE_SIZE = 10

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

async function Balanse({ searchParams }: Props) {
  const { category: rawCategory, sort: rawSort } = await searchParams
  // 클라이언트(balansePage)와 같은 규칙으로 키를 만들어야 초기 데이터를 재사용함
  const category =
    typeof rawCategory === 'string' && rawCategory ? rawCategory : 'ALL'
  const sort = typeof rawSort === 'string' && rawSort ? rawSort : 'latest'

  const isKnown =
    (category === 'ALL' || !!getCategoryMeta(category)) &&
    (sort === 'latest' || sort === 'popular')

  let initialData: BalanseInitialData | null = null
  if (isKnown) {
    const data = await fetchVotesForServer({
      category,
      sort: sort as 'latest' | 'popular',
      size: SSR_PAGE_SIZE,
    })
    if (data) initialData = { key: `${category}|${sort}`, ...data }
  }

  return <BalansePage initialData={initialData} />
}

export default Balanse
