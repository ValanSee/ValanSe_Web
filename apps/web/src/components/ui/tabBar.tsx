/* eslint-disable react/prop-types */

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 안쪽 탭 목록(role=tablist)에 붙일 클래스 */
  tablistClassName?: string
}

// 탭을 바꿀 때 탭바가 헤더 아래에 붙어 있는(스크롤된) 상태면, 새 목록을 맨 위부터 보여준다
const scrollTopOnTabChange = (e: React.MouseEvent<HTMLDivElement>) => {
  const tab = (e.target as HTMLElement).closest('[role="tab"]')
  if (!tab || tab.getAttribute('aria-selected') === 'true') return
  const bar = e.currentTarget.parentElement
  if (!bar || getComputedStyle(bar).position !== 'sticky') return
  const stuck =
    bar.getBoundingClientRect().top <= parseFloat(getComputedStyle(bar).top)
  if (stuck) window.scrollTo({ top: 0 })
}

/**
 * 가로 탭바. 모바일은 상단 고정 헤더(h-14) 바로 아래에 같이 고정되고 PC 는 해제.
 * className 은 바깥(고정되는) 요소에, tablistClassName 은 안쪽 탭 목록에 붙는다.
 */
const TabBar = React.forwardRef<HTMLDivElement, TabBarProps>(
  (
    { className, tablistClassName, children, onClickCapture, ...props },
    ref,
  ) => (
    <div
      className={cn(
        'sticky top-14 z-30 border-b border-brand-gray-75 bg-card lg:relative lg:top-auto lg:z-auto',
        className,
      )}
    >
      <div
        ref={ref}
        role="tablist"
        className={cn(
          'scrollbar-hide flex w-full items-stretch overflow-x-auto',
          tablistClassName,
        )}
        onClickCapture={(e) => {
          scrollTopOnTabChange(e)
          onClickCapture?.(e)
        }}
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
