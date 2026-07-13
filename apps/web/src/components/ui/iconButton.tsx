/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { Icon } from '@iconify/react'
import * as React from 'react'
import { cn } from '@/lib/utils'

const iconButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center transition-[colors,transform] active:scale-[0.92] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:active:scale-100 disabled:text-brand-gray-75',
  {
    variants: {
      variant: {
        /** 배경 없음 · 아이콘 색 foreground · Header 검색/뒤로/설정 등 */
        default: 'text-foreground hover:text-primary',
        /** G50 배경 · 원형 액션 (좋아요·좋아요 취소 등) */
        ghost: 'bg-brand-gray-50 text-foreground hover:bg-brand-violet-50',
        /** V300 배경 · white 아이콘 · 강조 액션 (플로팅 등) */
        primary:
          'bg-primary text-primary-foreground hover:bg-brand-violet-400 disabled:bg-brand-gray-75',
      },
      size: {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-14 w-14',
      },
      shape: {
        square: 'rounded-lg',
        circle: 'rounded-full',
      },
    },
    defaultVariants: { variant: 'default', size: 'sm', shape: 'square' },
  },
)

const ICON_SIZE: Record<NonNullable<VariantProps<typeof iconButtonVariants>['size']>, number> = {
  sm: 24,
  md: 22,
  lg: 28,
}

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof iconButtonVariants> {
  /** iconify 아이콘 이름 (예: iconamoon:search) 또는 React 노드 */
  icon: React.ReactNode | string
  /** aria-label — 스크린리더용 필수 라벨 */
  label: string
  /** true 이면 spinner 노출 · 클릭 잠금 */
  loading?: boolean
  /** true 이면 button 대신 Slot 으로 렌더 · Link 위임용 */
  asChild?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size = 'sm',
      shape,
      type = 'button',
      loading = false,
      disabled,
      icon,
      label,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const iconSize = ICON_SIZE[size ?? 'sm']
    const displayIcon = loading ? (
      <Icon icon="line-md:loading-twotone-loop" width={iconSize} aria-hidden />
    ) : typeof icon === 'string' ? (
      <Icon icon={icon} width={iconSize} aria-hidden />
    ) : (
      icon
    )

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        disabled={asChild ? undefined : disabled || loading}
        aria-busy={loading || undefined}
        aria-label={label}
        className={cn(iconButtonVariants({ variant, size, shape }), className)}
        {...props}
      >
        {displayIcon}
      </Comp>
    )
  },
)
IconButton.displayName = 'IconButton'

export { IconButton, iconButtonVariants }
