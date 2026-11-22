export type SlideDirection = 'left' | 'right' | null

/** 탭 인덱스 기준 슬라이드 방향. 탭이 아니거나(<0) 같으면 null(페이드만). */
export function getSlideDirection(prev: number, next: number): SlideDirection {
  if (prev < 0 || next < 0 || prev === next) return null
  return next > prev ? 'right' : 'left'
}

/** Tailwind JIT 가 읽도록 클래스는 완성된 리터럴로 둔다. */
export function slideInClass(dir: SlideDirection): string {
  const base = 'animate-in fade-in [animation-duration:250ms] ease-out'
  if (dir === 'right') {
    return `${base} slide-in-from-right-1/4 motion-reduce:slide-in-from-right-0`
  }
  if (dir === 'left') {
    return `${base} slide-in-from-left-1/4 motion-reduce:slide-in-from-left-0`
  }
  return base
}
