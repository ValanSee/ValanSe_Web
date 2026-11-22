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

/** 하단 탭바를 보여주는 경로 (정확 일치) */
export const BOTTOM_NAV_PATHS: readonly string[] = [
  '/',
  '/balanse',
  '/create',
  '/my',
  '/about',
  '/topics',
  '/topics/mt-ppt',
]

export function showsBottomNav(pathname: string): boolean {
  return BOTTOM_NAV_PATHS.includes(pathname)
}

/** NAV_ITEMS 안에서 pathname 과 정확히 일치하는 탭 인덱스, 없으면 -1 */
export function getTabIndex(pathname: string): number {
  return NAV_ITEMS.findIndex((item) => item.route === pathname)
}
