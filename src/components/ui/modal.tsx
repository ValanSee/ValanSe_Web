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
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center',
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
    className={cn(
      'flex items-start justify-between p-6 border-border',
      className,
    )}
    {...props}
  />
))
ModalHeader.displayName = 'ModalHeader'

// Title: 모달의 제목 텍스트
const ModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold text-foreground text-left', className)}
    {...props}
  />
))
ModalTitle.displayName = 'ModalTitle'

// Description: 부제나 설명 텍스트
const ModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground mt-1', className)}
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
    className={cn('p-6 space-y-4 text-left', className)}
    {...props}
  />
))
ModalBody.displayName = 'ModalBody'

// Footer: 확인/취소 버튼 영역
const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-end gap-3 p-6 pt-0', className)}
    {...props}
  />
))
ModalFooter.displayName = 'ModalFooter'

// CloseButton: 닫기 버튼 (X 아이콘)
const ModalCloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'text-muted-foreground hover:text-foreground transition-colors',
      className,
    )}
    {...props}
  >
    <X className="w-4 h-4" />
  </button>
))
ModalCloseButton.displayName = 'ModalCloseButton'

// Main Modal Container
const Modal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'z-50 w-full max-w-md rounded-xl bg-background text-foreground shadow-lg animate-in fade-in-50 zoom-in-90',
      className,
    )}
    {...props}
  />
))
Modal.displayName = 'Modal'

// Example Composition
// <ModalOverlay>
//   <Modal>
//     <ModalHeader>
//       <ModalTitle>삭제하시겠습니까?</ModalTitle>
//       <ModalCloseButton onClick={closeModal} />
//     </ModalHeader>
//     <ModalBody>
//       <ModalDescription>
//         이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?
//       </ModalDescription>
//     </ModalBody>
//     <ModalFooter>
//       <Button variant="secondary" onClick={closeModal}>취소</Button>
//       <Button variant="destructive" onClick={confirmDelete}>삭제</Button>
//     </ModalFooter>
//   </Modal>
// </ModalOverlay>

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
