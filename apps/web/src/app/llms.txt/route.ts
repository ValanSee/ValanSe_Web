import { fetchVotesForServer } from '@/api/pages/valanse/listServer'
import { CATEGORIES } from '@/constants/category'
import { SITE_NAME, SITE_URL } from '@/constants/seo'
import type { Vote } from '@/types/balanse/vote'

// AI 검색·LLM 용 사이트 안내 (https://llmstxt.org). sitemap 과 같은 주기로 갱신
export const revalidate = 3600

const POPULAR_SIZE = 10
const SECTION_SIZE = 5

// 목록 API 에는 선택지별 득표수가 없어 참여 수만 표기 (비율은 각 상세 페이지 메타에 있음)
function voteLine(vote: Vote) {
  const versus = vote.options.map((o) => o.content).join(' vs ')
  return `- [${vote.title}](${SITE_URL}/poll/${vote.id}): ${versus} (${vote.total_vote_count}명 참여)`
}

export async function GET() {
  // 실패한 목록은 섹션만 빠지고 나머지는 그대로 내려간다
  const [popular, ...byCategory] = await Promise.all([
    fetchVotesForServer({ sort: 'popular', size: POPULAR_SIZE }),
    ...CATEGORIES.map((c) =>
      fetchVotesForServer({
        category: c.param,
        sort: 'popular',
        size: SECTION_SIZE,
      }),
    ),
  ])

  const sections = [
    `# ${SITE_NAME} (발란세)`,
    '> 둘 중 하나를 골라 투표하고, 다른 사람들의 선택 결과를 확인하는 한국어 밸런스게임 서비스. 누구나 밸런스게임을 만들어 친구와 공유할 수 있고, 각 게임 페이지에서 참여 인원과 선택지별 비율을 볼 수 있습니다.',
    [
      '## 주요 페이지',
      `- [밸런스게임 홈](${SITE_URL}/): 급상승·최신 밸런스게임과 카테고리`,
      `- [밸런스게임 모음](${SITE_URL}/balanse): 전체 게임 목록 (최신순·인기순)`,
      `- [밸런스게임 주제 추천](${SITE_URL}/topics): 커플·친구·술자리용 인기 질문과 카테고리별 추천`,
      `- [서비스 소개 · 자주 묻는 질문](${SITE_URL}/about): 이용 방법 · 로그인 · 결과 확인 · 앱 · 모임용 문의`,
      `- [앱 다운로드](${SITE_URL}/app): Android 앱(Google Play) · iOS 출시 예정 · 웹에서 바로 시작`,
      ...CATEGORIES.map(
        (c) =>
          `- [${c.label} 밸런스게임](${SITE_URL}/balanse?category=${c.param}): ${c.label} 카테고리 게임 목록`,
      ),
    ].join('\n'),
  ]

  if (popular?.votes.length) {
    sections.push(
      ['## 지금 인기 있는 밸런스게임', ...popular.votes.map(voteLine)].join(
        '\n',
      ),
    )
  }

  CATEGORIES.forEach((c, i) => {
    const votes = byCategory[i]?.votes ?? []
    if (votes.length === 0) return
    sections.push(
      [`## ${c.label} 인기 밸런스게임`, ...votes.map(voteLine)].join('\n'),
    )
  })

  sections.push(
    [
      '## Optional',
      `- [개인정보 처리방침](${SITE_URL}/privacy)`,
      `- [사이트맵](${SITE_URL}/sitemap.xml): 전체 게임 URL`,
    ].join('\n'),
  )

  return new Response(`${sections.join('\n\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
