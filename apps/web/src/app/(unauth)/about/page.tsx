import type { Metadata } from 'next'
import AboutPage from '@/components/pages/about/aboutPage'
import { ABOUT_FAQS, PLAY_STORE_URL } from '@/constants/about'
import { BASE_OPEN_GRAPH, SITE_NAME, SITE_URL } from '@/constants/seo'
import { JsonLd } from '@/components/_shared/jsonLd'

const PATH = '/about'
const TITLE = 'ValanSe(발란세) 소개 · 자주 묻는 질문'
const DESCRIPTION =
  'ValanSe(발란세)는 둘 중 하나를 골라 투표하고 다른 사람들의 선택 결과를 확인하는 밸런스게임 서비스예요. 이용 방법과 자주 묻는 질문을 모았어요.'

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

// FAQ 리치 결과는 구글에서 정부·의료 사이트만 표시되지만, Bing · AI 검색은 FAQPage 를 읽는다
const JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: '발란세',
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/assets/logo.svg`,
    sameAs: [PLAY_STORE_URL],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ABOUT_FAQS.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: '서비스 소개',
        item: `${SITE_URL}${PATH}`,
      },
    ],
  },
]

export default function About() {
  return (
    <>
      {JSON_LD.map((data) => (
        <JsonLd key={data['@type']} data={data} />
      ))}
      <AboutPage />
    </>
  )
}
