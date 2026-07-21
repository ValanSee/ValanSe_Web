/* eslint-disable react/prop-types */

import * as React from 'react'
import { cn } from '@/lib/utils'

type TabBarProps = React.HTMLAttributes<HTMLDivElement>

const TabBar = React.forwardRef<HTMLDivElement, TabBarProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative border-b border-brand-gray-75 bg-card">
      <div
        ref={ref}
        role="tablist"
        className={cn(
          'scrollbar-hide flex w-full items-stretch overflow-x-auto',
          className,
        )}
        {...props}
      >
        {children}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent"
        aria-hidden
      />
    </div>
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
        'flex flex-1 shrink-0 items-center justify-center whitespace-nowrap px-4 pb-2 pt-3 typo-label-02 transition-colors',
        selected
          ? '-mb-px border-b-2 border-primary text-primary'
          : 'text-brand-gray-200 hover:text-foreground',
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
export type { TabItemProps, TabBarProps }
