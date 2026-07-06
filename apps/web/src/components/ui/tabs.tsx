/* eslint-disable react/prop-types */

import * as React from 'react'
import { cn } from '@/lib/utils'

type TabBarProps = React.HTMLAttributes<HTMLDivElement>

const TabBar = React.forwardRef<HTMLDivElement, TabBarProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'flex w-full items-stretch border-b border-border bg-card',
        className,
      )}
      {...props}
    />
  ),
)
TabBar.displayName = 'TabBar'

interface TabItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  selected?: boolean
  label: React.ReactNode
}

const TabItem = React.forwardRef<HTMLButtonElement, TabItemProps>(
  ({ className, selected, label, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      role="tab"
      aria-selected={selected}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 px-1 pb-2 pt-3 text-base font-semibold transition-colors',
        selected
          ? '-mb-px border-b border-primary text-primary'
          : 'text-brand-gray-75 hover:text-foreground',
        className,
      )}
      {...props}
    >
      {label}
    </button>
  ),
)
TabItem.displayName = 'TabItem'

export { TabBar, TabItem }
export type { TabBarProps, TabItemProps }
