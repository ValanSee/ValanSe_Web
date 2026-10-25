import { fetchVotesForServer } from '@/api/pages/valanse/listServer'
import PollSidebar from './pollSidebar'

const SIDEBAR_SIZE = 5

interface Props {
  voteId: number
  category: string
}

/**
 * 투표 상세 PC 사이드바 데이터를 서버에서 조회한다.
 * 페이지에서 Suspense 로 감싸 스트리밍하므로 본문 응답을 붙잡지 않는다.
 */
export default async function PollSidebarServer({ voteId, category }: Props) {
  // 현재 글이 섞여 빠질 수 있어 1개 더 조회
  const [related, latest] = await Promise.all([
    fetchVotesForServer({ category, sort: 'popular', size: SIDEBAR_SIZE + 1 }),
    fetchVotesForServer({ sort: 'latest', size: SIDEBAR_SIZE + 1 }),
  ])

  return (
    <PollSidebar
      currentVoteId={voteId}
      category={category}
      related={related?.votes ?? []}
      latest={latest?.votes ?? []}
    />
  )
}
