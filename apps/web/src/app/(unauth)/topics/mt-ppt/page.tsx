import type { Metadata } from 'next'
import MtPptPage from '@/components/pages/topics/mtPptPage'
import { BASE_OPEN_GRAPH, SITE_NAME, SITE_URL } from '@/constants/seo'
import { JsonLd } from '@/components/_shared/jsonLd'
import {
  MT_PPT_FAQS,
  MT_PPT_FILE,
  MT_PPT_PATH,
  MT_PPT_PREVIEWS,
  MT_PPT_QUESTIONS,
} from '@/constants/mtPpt'

const TITLE = 'MT 밸런스게임 PPT 무료 다운로드 - 모임·워크숍용 질문 10개'
const DESCRIPTION =
  'MT·동아리·워크숍·송년회에서 프로젝터에 바로 띄우는 밸런스게임 PPT 무료 샘플. 실제로 많이 고른 질문 10개, 손 들고 진행하는 방법까지 담았어요. 회원가입 없이 다운로드.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'MT 밸런스게임',
    '밸런스게임 PPT',
    'MT 게임',
    '워크숍 레크리에이션',
    '송년회 게임',
    '동아리 MT 게임',
    '밸런스게임 질문',
  ],
  alternates: { canonical: MT_PPT_PATH },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    url: MT_PPT_PATH,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: MT_PPT_PREVIEWS[0].src, width: 1280, height: 720 }],
  },
}

const JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: '밸런스게임 주제 추천',
        item: `${SITE_URL}/topics`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'MT 밸런스게임 PPT',
        item: `${SITE_URL}${MT_PPT_PATH}`,
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: 'MT · 모임 밸런스게임 PPT 샘플',
    description: DESCRIPTION,
    url: `${SITE_URL}${MT_PPT_PATH}`,
    encodingFormat:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    contentUrl: `${SITE_URL}${MT_PPT_FILE}`,
    image: `${SITE_URL}${MT_PPT_PREVIEWS[0].src}`,
    inLanguage: 'ko',
    isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    hasPart: MT_PPT_QUESTIONS.map((q) => ({
      '@type': 'Question',
      name: q.title,
      url: `${SITE_URL}/poll/${q.id}`,
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: MT_PPT_FAQS.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  },
]

export default function MtPpt() {
  return (
    <>
      {JSON_LD.map((data) => (
        <JsonLd key={data['@type']} data={data} />
      ))}
      <MtPptPage />
    </>
  )
}
