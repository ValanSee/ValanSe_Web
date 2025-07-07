'use client'

import { createPortal } from 'react-dom'

const Modal = ({
  children,
  zIndex,
}: {
  children: React.ReactNode
  zIndex: number
}) => {
  return createPortal(
    <div className={`flex flex-col fixed inset-0 z-${zIndex}`}>{children}</div>,
    document.getElementById('modal-root')!,
  )
}

export default Modal
