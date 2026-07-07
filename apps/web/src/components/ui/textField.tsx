/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority'
import { Icon } from '@iconify/react'
import * as React from 'react'
import { cn } from '@/lib/utils'

const fieldVariants = cva(
  'flex w-full items-center gap-2 rounded-xl border px-4 py-3 transition-colors',
  {
    variants: {
      state: {
        default:
          'bg-card border-brand-gray-75 focus-within:border-primary',
        disabled: 'bg-brand-gray-50 border-transparent cursor-not-allowed',
        error: 'bg-card border-destructive',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

const inputCn =
  'flex-1 bg-transparent outline-none typo-label-02 placeholder:text-brand-gray-100 disabled:cursor-not-allowed disabled:text-brand-gray-75'

const supportCn = cva('typo-body-c-02', {
  variants: {
    state: {
      default: 'text-brand-gray-100',
      disabled: 'text-brand-gray-100',
      error: 'text-destructive',
    },
  },
  defaultVariants: { state: 'default' },
})

type FieldState = NonNullable<VariantProps<typeof fieldVariants>['state']>

export interface TextFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'onChange'
  > {
  /** 상단 레이블 */
  label?: React.ReactNode
  /** 하단 서포트/에러 텍스트 */
  supportText?: React.ReactNode
  /** true 시 error state */
  error?: boolean
  /** 카운터 표시 (maxLength 필요) */
  showCounter?: boolean
  /** 우측 커스텀 슬롯 */
  trailing?: React.ReactNode
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (value: string) => void
}

const genId = () => Math.random().toString(36).slice(2, 10)

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      label,
      supportText,
      error = false,
      showCounter = false,
      maxLength,
      trailing,
      disabled,
      value,
      onChange,
      onValueChange,
      id: idProp,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId()
    const id = idProp ?? `${reactId}-${genId()}`
    const supportId = supportText ? `${id}-help` : undefined

    const state: FieldState = disabled
      ? 'disabled'
      : error
        ? 'error'
        : 'default'

    const charCount = typeof value === 'string' ? value.length : 0

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onValueChange?.(e.target.value)
    }

    return (
      <div className={cn('flex w-full flex-col gap-2', className)}>
        {label && (
          <label htmlFor={id} className="typo-title-02 text-foreground">
            {label}
          </label>
        )}
        <div className="flex flex-col gap-1">
          <div className={fieldVariants({ state })}>
            <input
              ref={ref}
              id={id}
              className={inputCn}
              disabled={disabled}
              maxLength={maxLength}
              value={value}
              onChange={handleChange}
              aria-invalid={error || undefined}
              aria-describedby={supportId}
              {...props}
            />
            {trailing ??
              (state === 'error' ? (
                <Icon
                  icon="material-symbols:error-outline-rounded"
                  className="text-destructive"
                  width={20}
                  aria-hidden
                />
              ) : null)}
          </div>
          {(supportText || showCounter) && (
            <div className="flex items-center justify-end gap-2">
              {supportText && (
                <span
                  id={supportId}
                  className={cn(supportCn({ state }), 'flex-1 text-left')}
                >
                  {supportText}
                </span>
              )}
              {showCounter && (
                <span className="typo-body-c-02 text-brand-gray-100">
                  ({charCount}/{maxLength ?? '∞'})
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  },
)
TextField.displayName = 'TextField'

export { TextField, fieldVariants }
