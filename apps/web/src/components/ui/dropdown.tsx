'use client'

/* eslint-disable react/prop-types */

import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const dropdownBoxVariants = cva(
  'flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-2 transition-colors typo-label-03 text-left',
  {
    variants: {
      state: {
        default:
          'bg-card border-brand-gray-75 text-brand-gray-100 hover:border-brand-violet-200',
        active: 'bg-card border-brand-violet-200 text-brand-gray-100',
        disabled:
          'bg-brand-gray-50 border-transparent text-brand-gray-75 cursor-not-allowed',
        error: 'bg-card border-destructive text-brand-gray-300',
      },
    },
    defaultVariants: { state: 'default' },
  },
)

const supportVariants = cva('typo-body-c-03 flex items-center gap-1', {
  variants: {
    state: {
      default: 'text-brand-gray-100',
      active: 'text-brand-gray-100',
      disabled: 'text-brand-gray-100',
      error: 'text-destructive',
    },
  },
  defaultVariants: { state: 'default' },
})

type DropdownState = NonNullable<
  VariantProps<typeof dropdownBoxVariants>['state']
>

export interface DropdownOption<T extends string = string> {
  label: React.ReactNode
  value: T
}

export interface DropdownProps<T extends string = string> {
  label?: React.ReactNode
  placeholder?: string
  options: DropdownOption<T>[]
  value?: T
  onValueChange?: (value: T) => void
  disabled?: boolean
  error?: boolean
  errorMessage?: React.ReactNode
  className?: string
  id?: string
}

const generateId = () => `dropdown-${Math.random().toString(36).slice(2, 10)}`

function Dropdown<T extends string = string>({
  label,
  placeholder = '선택',
  options,
  value,
  onValueChange,
  disabled = false,
  error = false,
  errorMessage,
  className,
  id: idProp,
}: DropdownProps<T>) {
  const reactId = React.useId()
  const id = idProp ?? `${reactId}-${generateId()}`
  const menuId = `${id}-menu`
  const errorId = errorMessage ? `${id}-err` : undefined

  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)

  const state: DropdownState = disabled
    ? 'disabled'
    : error
      ? 'error'
      : open
        ? 'active'
        : 'default'

  const selected = options.find((o) => o.value === value)
  const displayText = selected ? selected.label : placeholder

  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleSelect = (v: T) => {
    onValueChange?.(v)
    setOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={cn('flex w-full flex-col gap-2', className)}
    >
      {label && (
        <label htmlFor={id} className="typo-title-02 text-foreground">
          {label}
        </label>
      )}
      <div className="relative flex flex-col gap-1">
        <button
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={menuId}
          aria-invalid={error || undefined}
          aria-describedby={errorId}
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={dropdownBoxVariants({ state })}
        >
          <span className="flex-1 truncate">{displayText}</span>
          <ChevronIcon open={open} aria-hidden="true" />
        </button>
        {open && !disabled && (
          <ul
            id={menuId}
            role="listbox"
            className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-xl bg-card shadow-[0_1px_5.3px_rgba(0,0,0,0.25)]"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <li key={opt.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-4 py-1 typo-label-03 text-left transition-colors hover:bg-brand-violet-50',
                      isSelected ? 'text-primary' : 'text-brand-gray-400',
                    )}
                  >
                    {opt.label}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {error && errorMessage && (
          <span id={errorId} className={supportVariants({ state })}>
            <ErrorIcon aria-hidden="true" />
            {errorMessage}
          </span>
        )}
      </div>
    </div>
  )
}

const ChevronIcon = ({
  open,
  ...props
}: React.SVGProps<SVGSVGElement> & { open: boolean }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={cn('shrink-0 transition-transform', open && 'rotate-180')}
    {...props}
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

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

export { Dropdown, dropdownBoxVariants }
