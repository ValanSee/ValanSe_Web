/**
 * PC(lg 이상)에서 페이지 루트에 붙이는 기본 컬럼.
 * - 상단 GNB · 푸터 사이를 채우도록 flex-1 (모바일용 min-h-screen 해제)
 * - 하단 탭바가 없으니 탭바 여백(pb-24) 대신 기본 하단 여백
 * PC 전용 레이아웃이 있는 페이지는 이 대신 자체 폭을 지정한다.
 */
export const DESKTOP_PAGE_COLUMN =
  'lg:mx-auto lg:w-full lg:max-w-3xl lg:min-h-0 lg:flex-1 lg:pb-ds-10'
