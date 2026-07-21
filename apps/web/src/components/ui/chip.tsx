/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const chipVariants = cva(
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full transition-colors',
  {
    variants: {
      size: {
        s: 'px-2 py-1 typo-label-03',
        m: 'px-3 py-1.5 typo-label-03',
        l: 'px-3.5 py-2 typo-label-02',
      },
      status: {
        /** V300 배경 · white 텍스트 · 강조 */
        primary:
          'bg-primary text-primary-foreground hover:bg-brand-violet-400',
        /** V50 배경 · V300 텍스트 · 선택된 필터 */
        secondary:
          'bg-brand-violet-50 text-primary hover:bg-brand-violet-75',
        /** 흰 배경 · V300 텍스트 · V100 border · 미선택 */
        outline:
          'border border-brand-violet-100 bg-card text-primary hover:bg-brand-violet-50',
        /** 흰 배경 · G200 텍스트 · G75 border · 카테고리 미선택 */
        ghost:
          'border border-brand-gray-75 bg-card text-brand-gray-200 hover:bg-brand-gray-50',
        /** G50 배경 · G100 텍스트 · 비활성 */
        disabled:
          'bg-brand-gray-50 text-brand-gray-75 cursor-not-allowed',
        /** Y75 배경 · G500 텍스트 · HOT 배지 */
        hot: 'bg-brand-yellow-75 text-foreground',
      },
    },
    defaultVariants: { size: 'm', status: 'ghost' },
  },
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  /** 앞쪽 아이콘/이모지 슬롯 */
  icon?: React.ReactNode
  /** 뒤쪽 슬롯 (예: 삭제 X) */
  trailing?: React.ReactNode
  /** 클릭 가능 여부 — true 시 button 렌더 */
  clickable?: boolean
}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    { className, size, status, icon, trailing, clickable, children, ...props },
    ref,
  ) => {
    const content = (
      <>
        {icon}
        {children}
        {trailing}
      </>
    )
    if (clickable) {
      return (
        <button
          type="button"
          className={cn(chipVariants({ size, status }), className)}
          {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {content}
        </button>
      )
    }
    return (
      <span
        ref={ref}
        className={cn(chipVariants({ size, status }), className)}
        {...props}
      >
        {content}
      </span>
    )
  },
)
Chip.displayName = 'Chip'

export { Chip, chipVariants }
