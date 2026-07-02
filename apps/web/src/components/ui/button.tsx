/* eslint-disable react/prop-types */

import * as React from 'react'
import { cn } from '@/lib/utils'

// Variant type 정의
type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-brand-violet-400',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-brand-gray-75',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-brand-red-200',
  outline: 'border border-border bg-transparent text-foreground hover:bg-secondary',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { Button }
