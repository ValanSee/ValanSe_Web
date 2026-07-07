'use client'

/* eslint-disable react/prop-types */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

export type PopupVariant = 'confirm' | 'alert' | 'error'

export interface PopupProps {
  open: boolean
  onClose: () => void
  /**
   * - confirm: 취소 + 확인 (secondary + primary)
   * - alert: 확인 (primary)
   * - error: 확인 (outline)
   */
  variant?: PopupVariant
  title: React.ReactNode
  description?: React.ReactNode
  confirmLabel?: React.ReactNode
  onConfirm?: () => void
  cancelLabel?: React.ReactNode
  onCancel?: () => void
  className?: string
}

const Popup = ({
  open,
  onClose,
  variant = 'confirm',
  title,
  description,
  confirmLabel = '확인',
  onConfirm,
  cancelLabel = '취소',
  onCancel,
  className,
}: PopupProps) => {
  if (!open) return null

  const handleCancel = () => {
    onCancel?.()
    onClose()
  }
  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'flex w-full max-w-[352px] flex-col gap-6 rounded-[20px] bg-card px-5 pb-6 pt-10 shadow-lg',
          className,
        )}
      >
        <div className="flex flex-col gap-3">
          <h2 className="typo-title-02 text-center text-foreground">{title}</h2>
          {description && (
            <p className="typo-body-b-01 text-center text-brand-gray-100">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 [&>*]:flex-1">
          {variant === 'confirm' && (
            <Button
              size="l"
              variant="gray"
              onClick={handleCancel}
              fullWidth
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            size="l"
            variant={variant === 'error' ? 'outline' : 'primary'}
            onClick={handleConfirm}
            fullWidth
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { Popup }
