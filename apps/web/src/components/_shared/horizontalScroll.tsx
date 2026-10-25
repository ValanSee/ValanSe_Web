import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  /** 우측 페이드 shadow 표시 여부 (기본 true) */
  shadow?: boolean
  /** 페이드 shadow 에 추가할 클래스 (예: PC 그리드에선 lg:hidden) */
  shadowClassName?: string
}

/**
 * 가로 스크롤 컨테이너 + 우측 페이드 shadow.
 * 스크롤바는 숨기고, 우측에 배경색 → 투명 그라디언트로 "더 있음" 힌트 노출.
 */
export default function HorizontalScroll({
  children,
  className,
  shadow = true,
  shadowClassName,
}: Props) {
  return (
    // min-w-0: flex 부모(flex-col 등) 안에서 min-width:auto로 인해 컨테이너가
    // 콘텐츠 min-content 만큼 늘어나 overflow-x-auto가 무력화되는 문제 방지
    <div className="relative min-w-0">
      <div className={cn('scrollbar-hide overflow-x-auto', className)}>
        {children}
      </div>
      {shadow && (
        <>
          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent',
              shadowClassName,
            )}
            aria-hidden
          />
          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent',
              shadowClassName,
            )}
            aria-hidden
          />
        </>
      )}
    </div>
  )
}
