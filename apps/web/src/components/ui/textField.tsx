/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const fieldWrapperVariants = cva(
  'flex w-full items-center gap-2 rounded-xl border px-4 py-3 transition-colors',
  {
    variants: {
      state: {
        default:
          'bg-card border-brand-gray-75 focus-within:border-brand-violet-200',
        disabled: 'bg-brand-gray-50 border-transparent cursor-not-allowed',
        error: 'bg-card border-destructive',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

const inputVariants = cva(
  'flex-1 bg-transparent outline-none typo-label-03 placeholder:text-brand-gray-100 disabled:cursor-not-allowed',
  {
    variants: {
      state: {
        default: 'text-foreground caret-primary',
        disabled: 'text-brand-gray-75',
        error: 'text-foreground caret-destructive',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

const supportVariants = cva('typo-body-c-03', {
  variants: {
    state: {
      default: 'text-brand-gray-100',
      disabled: 'text-brand-gray-100',
      error: 'text-destructive',
    },
  },
  defaultVariants: { state: 'default' },
})

type TextFieldState = NonNullable<
  VariantProps<typeof fieldWrapperVariants>['state']
>

export interface TextFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'onChange'
  > {
  /** 필드 상단 레이블 텍스트. 없으면 미표시. */
  label?: React.ReactNode
  /** 헬프 영역 서포트/에러 메시지 */
  supportText?: React.ReactNode
  /** true 시 error state 강제. supportText 색상도 error로 렌더. */
  error?: boolean
  /** 카운터 표시. maxLength 필요. */
  showCounter?: boolean
  /** input 우측에 렌더할 커스텀 요소 (에러 아이콘 등 override) */
  trailing?: React.ReactNode
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (value: string) => void
}

const generateId = () => `textfield-${Math.random().toString(36).slice(2, 10)}`

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
    const id = idProp ?? `${reactId}-${generateId()}`
    const supportId = supportText ? `${id}-help` : undefined

    const state: TextFieldState = disabled
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
          <div className={fieldWrapperVariants({ state })}>
            <input
              ref={ref}
              id={id}
              className={inputVariants({ state })}
              disabled={disabled}
              maxLength={maxLength}
              value={value}
              onChange={handleChange}
              aria-invalid={error || undefined}
              aria-describedby={supportId}
              {...props}
            />
            {trailing ? (
              trailing
            ) : state === 'error' ? (
              <ErrorIcon aria-hidden="true" />
            ) : null}
          </div>
          {(supportText || showCounter) && (
            <div className="flex items-center justify-end gap-2">
              {supportText && (
                <span
                  id={supportId}
                  className={cn(supportVariants({ state }), 'flex-1 text-left')}
                >
                  {supportText}
                </span>
              )}
              {showCounter && (
                <span className="typo-body-c-03 text-brand-gray-100 shrink-0">
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

const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    className="shrink-0 text-destructive"
    {...props}
  >
    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M9 5v4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="9" cy="12.5" r="0.9" fill="currentColor" />
  </svg>
)

export { TextField, fieldWrapperVariants }
