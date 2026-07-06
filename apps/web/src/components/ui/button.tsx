import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-brand-violet-400',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-brand-gray-75',
        ghost_purple: 'bg-brand-violet-50 text-primary hover:bg-brand-violet-75',
        ghost_black: 'bg-transparent text-foreground hover:bg-secondary',
        outline:
          'border border-border bg-transparent text-foreground hover:bg-secondary',
        gray: 'bg-brand-gray-50 text-brand-gray-500 hover:bg-brand-gray-75',
        // TODO(P6 Modal PR): Figma 팝업 "오류" variant로 정식 대체 후 제거
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-brand-red-200',
      },
      size: {
        xl: 'h-14 px-3 rounded-xl typo-body-b-01',
        l: 'h-12 px-3 rounded-xl typo-body-b-01',
        m: 'h-10 px-3 rounded-[10px] typo-body-b-02',
        s: 'h-8 px-3 rounded-lg typo-label-01',
        ss: 'px-2 py-1 rounded gap-1 typo-body-c-03',
      },
    },
    defaultVariants: { variant: 'primary', size: 'l' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }
