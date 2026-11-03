'use client'

import { useRouter } from 'next/navigation'
import { IconButton } from '@/components/ui/iconButton'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: React.ReactNode
  showBackButton?: boolean
  onBackClick?: () => void
  /** 좌측 슬롯 (로고 등). 지정하면 back 버튼 자리를 대체 */
  leading?: React.ReactNode
  /** 우측 액션 슬롯 (검색·설정 등) */
  trailing?: React.ReactNode
  /** 배경 회색 여부 (bg-background), 기본은 bg-card */
  bgGray?: boolean
  className?: string
  /** 제목 태그. 본문에 더 구체적인 h1 이 있는 화면은 'p' 로 낮춘다 (기본 h1) */
  titleAs?: 'h1' | 'p'
}

export default function Header({
  title,
  showBackButton,
  onBackClick,
  leading,
  trailing,
  bgGray,
  className,
  titleAs: TitleTag = 'h1',
}: HeaderProps) {
  const router = useRouter()
  const handleBack = () => {
    if (onBackClick) onBackClick()
    else router.back()
  }

  return (
    // 모바일은 스크롤해도 상단 고정. PC 는 GNB(desktopHeader)가 sticky 라 겹치지 않게 해제
    <header
      className={cn(
        'sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between gap-2 px-4 lg:static lg:z-auto',
        bgGray ? 'bg-background' : 'bg-card',
        className,
      )}
    >
      <div className="flex min-w-[24px] items-center">
        {leading
          ? leading
          : showBackButton && (
              <IconButton
                icon="icon-park-outline:left"
                label="뒤로가기"
                onClick={handleBack}
              />
            )}
      </div>
      {title && (
        <TitleTag className="typo-heading-05 flex-1 text-center text-foreground">
          {title}
        </TitleTag>
      )}
      <div className="flex min-w-[24px] items-center justify-end">
        {trailing}
      </div>
    </header>
  )
}
