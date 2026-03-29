/** 하단 네비게이션 탭 루트 경로 (탭 화면일 때 뒤로가기 → 종료 모달) */
const TAB_ROUTES = ['/main', '/poll/hot', '/balanse', '/create', '/my'] as const

export function isTabRoute(pathname: string): boolean {
  return TAB_ROUTES.some((route) => pathname === route)
}
