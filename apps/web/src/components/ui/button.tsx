/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { Icon } from '@iconify/react'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[colors,transform] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:active:scale-100',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-brand-violet-400 disabled:bg-brand-gray-75 disabled:text-primary-foreground',
        secondary:
          'bg-brand-violet-50 text-primary hover:bg-brand-violet-75 disabled:bg-brand-gray-50 disabled:text-brand-gray-75',
        outline:
          'border border-primary bg-card text-primary hover:bg-brand-violet-50 disabled:border-brand-gray-75 disabled:text-brand-gray-75',
        ghost:
          'border border-brand-gray-75 bg-card text-brand-gray-200 hover:bg-brand-gray-50 disabled:text-brand-gray-75',
        gray: 'bg-brand-gray-50 text-primary hover:bg-brand-violet-50 disabled:bg-brand-gray-50 disabled:text-brand-gray-75',
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

const SPINNER_SIZE: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, number> = {
  xl: 20,
  l: 20,
  m: 18,
  s: 16,
  ss: 14,
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      type = 'button',
      loading = false,
      disabled,
      leadingIcon,
      trailingIcon,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    const spinnerSize = SPINNER_SIZE[size ?? 'l']
    const spinner = (
      <Icon
        icon="line-md:loading-twotone-loop"
        width={spinnerSize}
        aria-hidden
      />
    )
    const wrapped =
      children != null && children !== '' ? <span>{children}</span> : null

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        disabled={asChild ? undefined : disabled || loading}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {loading ? spinner : leadingIcon}
        {wrapped}
        {!loading && trailingIcon}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
