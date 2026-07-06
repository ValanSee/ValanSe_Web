'use client'

/* eslint-disable react/prop-types */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ModalOverlay } from './modal'

export type PopupVariant = 'confirm' | 'alert' | 'error'

export interface PopupProps {
  open: boolean
  onClose: () => void
  /**
   * confirm = 두 버튼 (secondary + primary)
   * alert   = 원 버튼 (primary)
   * error   = 원 버튼 (ghost purple)
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

const buttonBase =
  'inline-flex h-12 flex-1 items-center justify-center rounded-xl px-3 typo-label-03 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

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

  const confirmClasses =
    variant === 'error'
      ? 'bg-brand-violet-50 text-primary hover:bg-brand-violet-75'
      : 'bg-primary text-primary-foreground hover:bg-brand-violet-400'

  return (
    <ModalOverlay onClose={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby={description ? 'popup-desc' : undefined}
        className={cn(
          'flex w-full max-w-[352px] flex-col gap-6 rounded-[20px] bg-card px-5 pt-10 pb-6 shadow-lg animate-in fade-in-50 zoom-in-90',
          className,
        )}
      >
        <div className="flex flex-col gap-3">
          <h2
            id="popup-title"
            className="typo-title-02 text-center text-foreground"
          >
            {title}
          </h2>
          {description && (
            <p
              id="popup-desc"
              className="typo-body-b-01 text-center text-brand-gray-100"
            >
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {variant === 'confirm' && (
            <button
              type="button"
              onClick={handleCancel}
              className={cn(
                buttonBase,
                'bg-brand-gray-50 text-primary hover:bg-brand-gray-75',
              )}
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className={cn(buttonBase, confirmClasses)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

export { Popup }
