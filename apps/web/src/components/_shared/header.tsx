'use client'

import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
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
}

export default function Header({
  title,
  showBackButton,
  onBackClick,
  leading,
  trailing,
  bgGray,
  className,
}: HeaderProps) {
  const router = useRouter()
  const handleBack = () => {
    if (onBackClick) onBackClick()
    else router.back()
  }

  return (
    <header
      className={cn(
        'flex h-14 w-full items-center justify-between gap-2 px-4',
        bgGray ? 'bg-background' : 'bg-card',
        className,
      )}
    >
      <div className="flex min-w-[24px] items-center">
        {leading
          ? leading
          : showBackButton && (
              <button
                type="button"
                onClick={handleBack}
                aria-label="뒤로가기"
                className="flex h-6 w-6 items-center justify-center text-foreground"
              >
                <Icon
                  icon="icon-park-outline:left"
                  width={24}
                  height={24}
                  aria-hidden
                />
              </button>
            )}
      </div>
      {title && (
        <h1 className="typo-heading-05 flex-1 text-center text-foreground">
          {title}
        </h1>
      )}
      <div className="flex min-w-[24px] items-center justify-end">
        {trailing}
      </div>
    </header>
  )
}
