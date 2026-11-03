import type { Metadata } from 'next'
import MainPage from '@/components/pages/main/mainPage'
import {
  fetchTrendingVotesForServer,
  fetchVotesForServer,
} from '@/api/pages/valanse/listServer'
import { BASE_OPEN_GRAPH } from '@/constants/seo'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { ...BASE_OPEN_GRAPH, url: '/' },
}

// (public) 그룹: AuthGuard(useSearchParams) · loading.tsx 가 없어 정적 생성 가능.
// 60초마다 백그라운드에서 다시 만들어(ISR) CDN 캐시로 응답 → 매 요청 서버 렌더링 제거
export const revalidate = 60

const LATEST_SIZE = 3
const TRENDING_DAYS = 7

/** 홈. 예전 `/main` 을 루트로 통합 (SEO: 대표 URL 에 콘텐츠를 SSR) */
async function Home() {
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
export default Home
