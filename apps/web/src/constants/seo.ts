import type { Metadata } from 'next'

export const SITE_URL = 'https://valanse.kr'
export const SITE_NAME = 'ValanSe'
// 네이버 노출 상위 검색어(밸런스게임 주제 · 연애/연인 밸런스게임)를 앞에, 브랜드는 뒤에
export const DEFAULT_TITLE =
  '밸런스게임 주제 모음 · 연애·커플 질문 투표 | 발란세 ValanSe'
export const DEFAULT_DESCRIPTION =
  '연애·커플·친구·술자리용 밸런스게임 주제 100개 이상. 둘 중 하나 골라 투표하고 다른 사람들의 선택 비율을 확인해 보세요. 나만의 밸런스게임도 만들어 공유할 수 있어요.'

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
