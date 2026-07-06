/* eslint-disable react/prop-types */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

// Overlay: 모달 배경
const ModalOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }
>(({ className, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-5',
      className,
    )}
    onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose?.()
      }
    }}
    {...props}
  />
))
ModalOverlay.displayName = 'ModalOverlay'

// Header: 제목 및 닫기 버튼 포함
const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-start justify-between px-5 pt-5', className)}
    {...props}
  />
))
ModalHeader.displayName = 'ModalHeader'

// Title: 모달의 제목 텍스트 (Figma Title-02)
const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('typo-title-02 text-foreground text-center flex-1', className)}
    {...props}
  />
))
ModalTitle.displayName = 'ModalTitle'

// Description: 부제나 설명 텍스트 (Figma Body B-01)
const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'typo-body-b-01 text-brand-gray-100 text-center mt-3',
      className,
    )}
    {...props}
  />
))
ModalDescription.displayName = 'ModalDescription'

// Body: 본문 내용
const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-5 py-4 text-left', className)}
    {...props}
  />
))
ModalBody.displayName = 'ModalBody'

// Footer: 확인/취소 버튼 영역 (Figma 팝업 규격: gap 12)
const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-stretch gap-3 px-5 pb-6 [&>*]:flex-1', className)}
    {...props}
  />
))
ModalFooter.displayName = 'ModalFooter'

// CloseButton: 닫기 버튼 (X 아이콘)
const ModalCloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = 'button', ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      'text-brand-gray-100 hover:text-foreground transition-colors',
      className,
    )}
    {...props}
  >
    <X className="w-5 h-5" />
  </button>
))
ModalCloseButton.displayName = 'ModalCloseButton'

// Main Modal Container (Figma 팝업 컨테이너: radius 20, bg white, max-w 352)
const Modal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="dialog"
    aria-modal="true"
    className={cn(
      'z-50 w-full max-w-[352px] rounded-[20px] bg-card text-foreground shadow-lg animate-in fade-in-50 zoom-in-90',
      className,
    )}
    {...props}
  />
))
Modal.displayName = 'Modal'

export {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
}
