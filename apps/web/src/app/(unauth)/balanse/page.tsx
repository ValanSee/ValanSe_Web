import type { Metadata } from 'next'
import { BASE_OPEN_GRAPH } from '@/constants/seo'
import BalansePage, {
  type BalanseInitialData,
} from '../../../components/pages/balanse/balansePage'
import { getCategoryMeta } from '@/constants/category'
import { getCategoryIntro } from '@/constants/categoryIntro'
import { fetchVotesForServer } from '@/api/pages/valanse/listServer'
import { balanseListKey, parseBalanseCursor } from '@/utils/balanseList'

type Props = {
  searchParams: Promise<{
    category?: string | string[]
    sort?: string | string[]
    cursor?: string | string[]
  }>
}

// 첫 화면 SSR 개수. 크롤러가 따라갈 /poll 링크를 충분히 담기 위해 클라이언트 페이지 크기(5)보다 크게
const SSR_PAGE_SIZE = 10

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { category, cursor } = await searchParams
  const meta = typeof category === 'string' ? getCategoryMeta(category) : null

  // 카테고리별 목록은 sitemap 에 별도 URL 로 올라가므로 canonical 도 카테고리 단위로 분리
  const path = meta ? `/balanse?category=${meta.param}` : '/balanse'
  const title = meta ? `${meta.label} 밸런스게임 모음` : '밸런스게임 모음'
  // 화면 상단 소개 문구와 같은 문장
  const description = getCategoryIntro(meta?.param ?? 'ALL')

  // 다음 페이지(?cursor=)는 크롤러가 상세 링크를 따라가기 위한 경로일 뿐이라 색인하지 않음
  // 커서는 새 글이 올라올 때마다 바뀌는 불안정한 주소이므로 링크만 따라가게 한다
  if (parseBalanseCursor(cursor)) {
    return {
      title,
      description,
      robots: { index: false, follow: true },
    }
  }

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...BASE_OPEN_GRAPH, url: path, title, description },
  }
}

async function Balanse({ searchParams }: Props) {
  const {
    category: rawCategory,
    sort: rawSort,
    cursor: rawCursor,
  } = await searchParams
  // 클라이언트(balansePage)와 같은 규칙으로 키를 만들어야 초기 데이터를 재사용함
  const category =
    typeof rawCategory === 'string' && rawCategory ? rawCategory : 'ALL'
  const sort = typeof rawSort === 'string' && rawSort ? rawSort : 'latest'
  const cursor = parseBalanseCursor(rawCursor)

  const isKnown =
    (category === 'ALL' || !!getCategoryMeta(category)) &&
    (sort === 'latest' || sort === 'popular')

  let initialData: BalanseInitialData | null = null
  if (isKnown) {
    const data = await fetchVotesForServer({
      category,
      sort: sort as 'latest' | 'popular',
      size: SSR_PAGE_SIZE,
      cursor,
    })
    if (data)
      initialData = { key: balanseListKey(category, sort, cursor), ...data }
  }

  return <BalansePage initialData={initialData} />
}

export default Balanse
