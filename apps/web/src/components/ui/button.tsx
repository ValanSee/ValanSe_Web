/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:cursor-not-allowed focus-visible:outline-none',
  {
    variants: {
      variant: {
        /** V300 배경 · white · CTA */
        primary:
          'bg-primary text-primary-foreground hover:bg-brand-violet-400 disabled:bg-brand-gray-75 disabled:text-primary-foreground',
        /** V50 배경 · V300 텍스트 · 선택된 옵션 */
        secondary:
          'bg-brand-violet-50 text-primary hover:bg-brand-violet-75 disabled:bg-brand-gray-50 disabled:text-brand-gray-75',
        /** border · white 배경 · V300 텍스트 · 팝업 오류·미선택 옵션 */
        outline:
          'border border-primary bg-card text-primary hover:bg-brand-violet-50 disabled:border-brand-gray-75 disabled:text-brand-gray-75',
        /** border-G75 · white · G200 · 성별 미선택 등 */
        ghost:
          'border border-brand-gray-75 bg-card text-brand-gray-200 hover:bg-brand-gray-50 disabled:text-brand-gray-75',
        /** G50 배경 · V300 텍스트 · 투표 미선택 */
        gray: 'bg-brand-gray-50 text-primary hover:bg-brand-violet-50 disabled:bg-brand-gray-50 disabled:text-brand-gray-75',
        /** R300 배경 · white 텍스트 · 삭제 등 위험 액션 */
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-brand-red-200 disabled:bg-brand-gray-75',
      },
      size: {
        xl: 'h-14 px-4 rounded-xl typo-label-01',
        l: 'h-12 px-4 rounded-xl typo-label-01',
        m: 'h-10 px-3 rounded-lg typo-label-02',
        s: 'h-9 px-3 rounded-lg typo-label-03',
        ss: 'h-7 px-2 rounded-md typo-label-03',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: { variant: 'primary', size: 'l', fullWidth: false },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, fullWidth, type = 'button', ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }
