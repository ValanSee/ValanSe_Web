import { EVENT_INQUIRY_FORM_URL } from '@/constants/url'

export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.valanse'

export interface AboutFaq {
  question: string
  answer: string
  link?: { label: string; href: string; external?: boolean }
}

/** 서비스 소개 페이지(/about) FAQ. 화면과 FAQPage JSON-LD 가 같은 문구를 쓴다 */
export const ABOUT_FAQS: AboutFaq[] = [
  {
    question: '밸런스게임이 뭔가요?',
    answer:
      '두 가지(또는 그 이상) 선택지 중 하나만 고르는 질문 게임이에요. "평생 짜장면만 vs 평생 짬뽕만"처럼 정답이 없어서 대화 소재로 많이 쓰여요.',
  },
  {
    question: '로그인 없이도 볼 수 있나요?',
    answer:
      '게임 목록과 질문, 댓글은 누구나 볼 수 있어요. 투표와 게임 만들기, 댓글 작성은 카카오 로그인 후에 할 수 있어요.',
  },
  {
    question: '다른 사람들의 선택 결과는 어떻게 보나요?',
    answer: '투표하면 선택지별 비율과 참여 인원이 바로 나와요.',
  },
  {
    question: '밸런스게임은 어떻게 만드나요?',
    answer:
      "로그인 후 '밸런스 만들기'에서 제목과 선택지 2~4개, 카테고리를 정하면 바로 올라가요.",
    link: { label: '밸런스게임 만들기', href: '/create' },
  },
  {
    question: '커플·친구·술자리용 질문을 추천해 주세요.',
    answer:
      '밸런스게임 주제 추천에 지금 인기 있는 질문과 카테고리별 추천을 모아 뒀어요.',
    link: { label: '밸런스게임 주제 추천', href: '/topics' },
  },
  {
    question: '포인트와 칭호는 뭔가요?',
    answer:
      '활동하면 포인트가 쌓이고, 포인트로 프로필에 붙는 칭호를 살 수 있어요.',
  },
  {
    question: '앱도 있나요?',
    answer: 'Android 앱을 Google Play에서 받을 수 있어요.',
    link: {
      label: 'Google Play에서 받기',
      href: PLAY_STORE_URL,
      external: true,
    },
  },
  {
    question: 'MT·워크숍·모임에서 쓸 수 있나요?',
    answer:
      '모임 분위기에 맞춘 행사용 밸런스게임 세트를 문의할 수 있어요. 모임 종류와 날짜를 남겨 주세요.',
    link: {
      label: '모임·행사용 문의',
      href: EVENT_INQUIRY_FORM_URL,
      external: true,
    },
  },
]
