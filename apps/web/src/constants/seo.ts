import type { Metadata } from 'next'

export const SITE_URL = 'https://valanse.kr'
export const SITE_NAME = 'ValanSe'
export const DEFAULT_TITLE = 'ValanSe(발란스) - 밸런스게임 투표 공유 서비스'
export const DEFAULT_DESCRIPTION =
  '재미있는 밸런스게임을 만들고 친구와 공유하세요. 커플·친구·술자리에서 즐기는 둘 중 하나 선택, 이상형 밸런스게임 모음. 음식, 연애 등 카테고리별 인기 질문을 ValanSe에서 만나보세요.'

// metadata 는 최상위 키 단위로 덮어쓰이므로, 하위 페이지에서 openGraph 를 지정할 땐 이 값을 펼쳐서 이미지 등을 유지
export const BASE_OPEN_GRAPH = {
  type: 'website',
  locale: 'ko_KR',
  siteName: SITE_NAME,
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  images: [
    {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'ValanSe - 밸런스게임 투표 공유 서비스',
    },
  ],
} satisfies NonNullable<Metadata['openGraph']>
