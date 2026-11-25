export type SlideDirection = 'left' | 'right' | null

/** 탭 인덱스 기준 슬라이드 방향. 탭이 아니거나(<0) 같으면 null(페이드만). */
export function getSlideDirection(prev: number, next: number): SlideDirection {
  if (prev < 0 || next < 0 || prev === next) return null
  return next > prev ? 'right' : 'left'
}

/**
 * Tailwind JIT 가 읽도록 클래스는 완성된 리터럴로 둔다.
 *
 * transform 이 걸린 동안 래퍼가 `position: fixed` 자손(투표 상세 하단 댓글 바 등)의
 * 기준 상자가 돼 버리므로, 이동이 없는 경우(방향 없음 · PC · 동작 줄이기)는
 * transform 없는 `animate-fade-only`(opacity 만) 를 쓴다.
 * 모바일 방향 슬라이드만 tailwindcss-animate 의 enter(translate3d) 를 쓴다.
 */
export function slideInClass(dir: SlideDirection): string {
  const timing =
    '[animation-duration:250ms] [animation-timing-function:cubic-bezier(0,0,0.2,1)]'
  if (dir === 'right') {
    return `animate-in fade-in slide-in-from-right-1/4 ${timing} lg:animate-fade-only motion-reduce:animate-fade-only`
  }
  if (dir === 'left') {
    return `animate-in fade-in slide-in-from-left-1/4 ${timing} lg:animate-fade-only motion-reduce:animate-fade-only`
  }
  return `animate-fade-only ${timing}`
}
