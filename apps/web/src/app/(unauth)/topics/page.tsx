import type { Metadata } from 'next'
import TopicsPage, {
  type TopicsSection,
} from '@/components/pages/topics/topicsPage'
import { fetchVotesForServer } from '@/api/pages/valanse/listServer'
import { CATEGORIES } from '@/constants/category'
import { BASE_OPEN_GRAPH, SITE_NAME, SITE_URL } from '@/constants/seo'
import { JsonLd } from '@/components/_shared/jsonLd'

const PATH = '/topics'
// 홈 title 이 '밸런스게임 주제 모음' 을 쓰므로 여기는 '질문 추천' 으로 검색어를 나눈다
const TITLE = '밸런스게임 질문 추천 - 커플·친구·술자리 인기 주제'
const DESCRIPTION =
  '라면 면 먼저 vs 스프 먼저처럼 바로 쓸 수 있는 밸런스게임 질문을 인기순으로 모았어요. 연애·음식·살까말까·고민상담 카테고리별로 고르고 다른 사람들의 선택 비율도 확인해 보세요.'

const POPULAR_SIZE = 10
const SECTION_SIZE = 5

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    url: PATH,
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default async function Topics() {
  // 실패한 카테고리는 섹션만 빠지고 나머지는 그대로 렌더
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

  const popularVotes = popular?.votes ?? []
  const sections: TopicsSection[] = CATEGORIES.map((category, i) => ({
    category,
    votes: byCategory[i]?.votes ?? [],
  })).filter((s) => s.votes.length > 0)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: '밸런스게임 주제 추천',
          item: `${SITE_URL}${PATH}`,
        },
      ],
    },
    ...(popularVotes.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '지금 인기 있는 밸런스게임 주제',
            itemListElement: popularVotes.map((v, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: v.title,
              url: `${SITE_URL}/poll/${v.id}`,
            })),
          },
        ]
      : []),
  ]

  return (
    <>
      {jsonLd.map((data) => (
        <JsonLd key={String(data['@type'])} data={data} />
      ))}
      <TopicsPage popular={popularVotes} sections={sections} />
    </>
  )
}
