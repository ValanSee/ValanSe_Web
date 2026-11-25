import RouteTransition from '@/components/_shared/nav/routeTransition'

/**
 * 라우트 전환 시 페이지 진입 애니메이션.
 * 루트 template 은 라우트 그룹 단위로만 재마운트되므로 RouteTransition 이 pathname key 로 직접 재마운트한다.
 * 하단 탭바는 레이아웃에 있어 transform 을 써도 흔들리지 않는다.
 * page-safe-bottom: 페이지 루트 끝에 하단 안전영역 여백 (globals.css)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>
}
