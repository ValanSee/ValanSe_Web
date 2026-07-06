/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva('inline-flex items-center gap-1 whitespace-nowrap', {
  variants: {
    size: {
      s: 'rounded-xl px-2 py-1 typo-body-c-03',
      l: 'rounded-[15px] px-2.5 py-1.5 typo-label-03',
    },
    status: {
      filled: '',
      outlined: 'border',
      weak: '',
      ghost: '',
    },
    color: {
      purple: '',
      yellow: '',
      gray: '',
    },
  },
  compoundVariants: [
    // purple
    { color: 'purple', status: 'filled', className: 'bg-brand-violet-200 text-white' },
    {
      color: 'purple',
      status: 'outlined',
      className: 'bg-brand-violet-50 text-primary border-primary',
    },
    { color: 'purple', status: 'weak', className: 'bg-brand-violet-50 text-primary' },
    { color: 'purple', status: 'ghost', className: 'bg-transparent text-primary' },
    // yellow
    {
      color: 'yellow',
      status: 'filled',
      className: 'bg-brand-yellow-300 text-brand-gray-400',
    },
    {
      color: 'yellow',
      status: 'outlined',
      className: 'bg-brand-yellow-50 text-brand-gray-500 border-brand-yellow-300',
    },
    {
      color: 'yellow',
      status: 'weak',
      className: 'bg-brand-yellow-75 text-brand-gray-500',
    },
    // gray
    {
      color: 'gray',
      status: 'outlined',
      className: 'bg-brand-gray-50 text-foreground border-brand-gray-75',
    },
    { color: 'gray', status: 'weak', className: 'bg-brand-gray-50 text-foreground' },
    { color: 'gray', status: 'ghost', className: 'bg-card text-foreground' },
  ],
  defaultVariants: { size: 'l', status: 'filled', color: 'purple' },
})

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof badgeVariants> {
  /** 앞쪽 아이콘/이모지 슬롯 */
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, size, status, color, icon, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ size, status, color }), className)}
      {...props}
    >
      {icon}
      {children}
    </span>
  ),
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
