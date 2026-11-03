import type { Metadata } from 'next'
import AppLandingPage from '@/components/pages/app/appLandingPage'
import { PLAY_STORE_URL } from '@/constants/about'
import { BASE_OPEN_GRAPH, SITE_NAME, SITE_URL } from '@/constants/seo'
import { JsonLd } from '@/components/_shared/jsonLd'

const PATH = '/app'
const TITLE = 'ValanSe(발란세) 앱 다운로드 · 밸런스게임 투표 앱'
const DESCRIPTION =
  '둘 중 하나를 골라 투표하고 남녀·나이·MBTI별 결과를 비교하는 밸런스게임 앱 ValanSe(발란세). Google Play에서 받거나 웹에서 바로 시작하세요.'

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

const JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: SITE_NAME,
    alternateName: '발란세',
    operatingSystem: 'ANDROID',
    applicationCategory: 'EntertainmentApplication',
    url: `${SITE_URL}${PATH}`,
    installUrl: PLAY_STORE_URL,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'KRW' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: '앱 다운로드',
        item: `${SITE_URL}${PATH}`,
      },
    ],
  },
]

export default function App() {
  return (
    <>
      {JSON_LD.map((data) => (
        <JsonLd key={data['@type']} data={data} />
      ))}
      <AppLandingPage />
    </>
  )
}
