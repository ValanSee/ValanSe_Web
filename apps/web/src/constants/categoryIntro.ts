import type { CategoryParam } from './category'

/**
 * 밸런스 목록(/balanse) 카테고리별 소개 문구.
 * 화면 상단 설명 + meta description 으로 함께 쓰여 "연애 밸런스게임" 같은 일반 검색어를 담는다.
 */
export const ALL_CATEGORY_INTRO =
  '커플·친구·술자리에서 바로 쓸 수 있는 밸런스게임 질문 모음이에요. 둘 중 하나를 골라 투표하면 다른 사람들의 선택을 바로 확인할 수 있어요.'

export const CATEGORY_INTRO: Record<CategoryParam, string> = {
  LOVE: '연애·커플 밸런스게임 질문 모음이에요. 연락 빈도, 데이트 비용, 기념일처럼 연인 사이에 한 번쯤 고민해 본 상황에서 당신의 선택은?',
  FOOD: '음식 밸런스게임 질문 모음이에요. 끝나지 않는 메뉴 고민부터 먹는 취향까지, 둘 중 하나만 골라야 한다면 무엇을 고를까요?',
  BUY: '살까 말까 고민될 때 보는 밸런스게임이에요. 가성비와 브랜드, 지금과 나중 사이에서 다른 사람들은 어떤 선택을 했는지 확인해 보세요.',
  SPORT:
    '스포츠 밸런스게임 질문 모음이에요. 응원하는 팀, 운동 취향까지 스포츠 팬이라면 한 번쯤 논쟁해 본 질문에 투표해 보세요.',
  WORRY:
    '고민상담 밸런스게임이에요. 진로, 인간관계, 일상 속 선택 고민을 둘 중 하나로 묻고 다른 사람들의 의견을 들어 보세요.',
  ETC: '그 밖의 재미있는 밸런스게임 질문 모음이에요. 엉뚱한 상상부터 황당한 선택까지, 친구와 함께 골라 보세요.',
}

export function getCategoryIntro(category: string): string {
  return CATEGORY_INTRO[category as CategoryParam] ?? ALL_CATEGORY_INTRO
}
