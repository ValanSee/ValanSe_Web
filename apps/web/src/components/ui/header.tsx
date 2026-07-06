/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const headerVariants = cva(
  'flex items-center justify-between w-full h-14 px-6 bg-card text-foreground',
  {
    variants: {
      size: {
        xl: '',
        s: '',
      },
    },
    defaultVariants: { size: 'xl' },
  },
)

const headerTitleVariants = cva('flex-1', {
  variants: {
    size: {
      xl: 'typo-heading-04',
      s: 'typo-heading-06',
    },
  },
  defaultVariants: { size: 'xl' },
})

export interface HeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>,
    VariantProps<typeof headerVariants> {
  title: React.ReactNode
  leading?: React.ReactNode
  trailing?: React.ReactNode
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ className, size, title, leading, trailing, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(headerVariants({ size }), className)}
      {...props}
    >
      {leading ? (
        <div className="flex items-center">{leading}</div>
      ) : (
        <div aria-hidden="true" className="w-6" />
      )}
      <h1 className={headerTitleVariants({ size })}>{title}</h1>
      {trailing ? (
        <div className="flex items-center">{trailing}</div>
      ) : (
        <div aria-hidden="true" className="w-6" />
      )}
    </header>
  ),
)
Header.displayName = 'Header'

/** 헤더 우측의 "더보기" 텍스트 버튼. Figma text button 컴포넌트 대응. */
const HeaderMoreButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children = '더보기', ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      'inline-flex items-center gap-1 typo-label-02 text-brand-gray-200 hover:text-foreground transition-colors',
      className,
    )}
    {...props}
  >
    {children}
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
))
HeaderMoreButton.displayName = 'HeaderMoreButton'

/** 헤더 좌측의 뒤로가기 버튼. */
const HeaderBackButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="뒤로가기"
    className={cn(
      'inline-flex h-6 w-6 items-center justify-center text-foreground',
      className,
    )}
    {...props}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
))
HeaderBackButton.displayName = 'HeaderBackButton'

export { Header, HeaderBackButton, HeaderMoreButton, headerVariants }
