/* eslint-disable react/prop-types */

import * as React from 'react'
import { cn } from '@/lib/utils'

// Variant type 정의
type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-gray-300 bg-white hover:bg-gray-100 text-gray-700',
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
