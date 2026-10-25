import { fetchVotesForServer } from '@/api/pages/valanse/listServer'
import RelatedPolls from './relatedPolls'

// 화면엔 최대 5개. PC 사이드바와 같은 요청이 되도록 크기를 맞춤 (현재 글 제외분 +1)
const FETCH_SIZE = 6

interface Props {
  voteId: number
  category: string
}

/**
 * 투표 상세 모바일 하단 "같은 카테고리" 목록 데이터를 서버에서 조회한다.
 * PC 사이드바(pollSidebarServer)와 같은 요청이라 fetch 캐시로 한 번만 호출된다.
 */
export default async function RelatedPollsServer({ voteId, category }: Props) {
  const related = await fetchVotesForServer({
    category,
    sort: 'popular',
    size: FETCH_SIZE,
  })

  return (
    <RelatedPolls
      currentVoteId={voteId}
      category={category}
      votes={related?.votes ?? []}
    />
  )
}
