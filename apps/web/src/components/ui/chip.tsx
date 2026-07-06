/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const chipVariants = cva('inline-flex items-center gap-1 whitespace-nowrap', {
  variants: {
    size: {
      s: 'rounded-xl px-2 py-1 typo-body-c-03', // 4px 8px · 12px radius
      l: 'rounded-[15px] px-2.5 py-1.5 typo-label-03', // 6px 10px · 15px radius
    },
    status: {
      primary: 'bg-brand-violet-200 text-white',
      secondary: 'bg-brand-violet-50 text-primary',
      outline: 'border border-brand-violet-100 bg-card text-primary',
      ghost: 'bg-card text-primary',
      disabled:
        'border border-brand-gray-75 bg-brand-gray-50 text-brand-gray-75 cursor-not-allowed',
      unselected:
        'border border-brand-gray-75 bg-card text-brand-gray-200',
    },
  },
  defaultVariants: { size: 'l', status: 'primary' },
})

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {
  /** 앞쪽 아이콘/이모지 슬롯 */
  icon?: React.ReactNode
}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, size, status, icon, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(chipVariants({ size, status }), className)}
      {...props}
    >
      {icon}
      {children}
    </span>
  ),
)
Chip.displayName = 'Chip'

export { Chip, chipVariants }
