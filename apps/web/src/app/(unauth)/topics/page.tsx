import type { Metadata } from 'next'
import TopicsPage, {
  type TopicsSection,
} from '@/components/pages/topics/topicsPage'
import { fetchVotesForServer } from '@/api/pages/valanse/listServer'
import { CATEGORIES } from '@/constants/category'
import { BASE_OPEN_GRAPH, SITE_NAME, SITE_URL } from '@/constants/seo'
import { JsonLd } from '@/components/_shared/jsonLd'

const PATH = '/topics'
const TITLE = '밸런스게임 주제 추천 모음 - 연애·음식·친구 밸런스 질문'
const DESCRIPTION =
  '커플·친구·술자리에서 바로 쓰는 밸런스게임 주제 추천. 지금 인기 있는 질문과 연애·음식·살까말까·스포츠·고민상담 카테고리별 밸런스게임을 모았어요.'

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
