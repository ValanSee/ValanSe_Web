import type { Metadata } from 'next'
import MainPage from '@/components/pages/main/mainPage'
import {
  fetchTrendingVotesForServer,
  fetchVotesForServer,
} from '@/api/pages/valanse/listServer'
import { BASE_OPEN_GRAPH } from '@/constants/seo'

export const metadata: Metadata = {
  alternates: { canonical: '/main' },
  openGraph: { ...BASE_OPEN_GRAPH, url: '/main' },
}

// (auth) 레이아웃의 AuthGuard 가 useSearchParams 를 써서, 정적 생성 시 화면 전체가 CSR 로 빠짐(BAILOUT).
// 요청 시 렌더링해야 SSR HTML 에 목록이 담김. API 응답은 fetch 캐시(60초)로 재사용
export const dynamic = 'force-dynamic'

const LATEST_SIZE = 3
const TRENDING_DAYS = 7

async function Main() {
  // 비로그인 기준 SSR. 실패한 섹션은 undefined 로 넘겨 클라이언트에서 다시 조회
  const [trending, latest] = await Promise.all([
    fetchTrendingVotesForServer(TRENDING_DAYS),
    fetchVotesForServer({
      category: 'ALL',
      sort: 'latest',
      size: LATEST_SIZE,
    }),
  ])

  return (
    <MainPage
      initialFeatured={trending ? (trending.votes[0] ?? null) : undefined}
      initialLatest={latest ? latest.votes : undefined}
    />
  )
}
export default Main
