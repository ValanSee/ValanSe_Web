export type NavItem = {
  label: string
  route: string
  icon: string
}

/** 하단 탭바(모바일) · 상단 GNB(PC) 공용 메뉴 */
export const NAV_ITEMS: NavItem[] = [
  { label: '홈', route: '/', icon: 'ic:round-home' },
  { label: '밸런스', route: '/balanse', icon: 'heroicons:scale' },
  { label: '만들기', route: '/create', icon: 'jam:write' },
  { label: '마이', route: '/my', icon: 'weui:setting-filled' },
]

export function isNavActive(pathname: string, route: string): boolean {
  // 홈('/')은 모든 경로의 접두사라 정확히 일치할 때만 활성
  return route === '/' ? pathname === '/' : pathname.startsWith(route)
}
