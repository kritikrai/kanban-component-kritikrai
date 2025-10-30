import React, { PropsWithChildren } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  footer?: React.ReactNode
  labelledById?: string
  describedById?: string
}

export const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ open, title, onClose, children, footer, labelledById='modal-title', describedById='modal-description' }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        aria-describedby={describedById}
        className="relative z-10 w-full max-w-lg rounded-xl bg-white p-4 shadow-modal animate-slide-up"
      >
        <div className="flex items-start justify-between mb-2">
          <h2 id={labelledById} className="text-lg font-semibold text-neutral-900">{title}</h2>
          <Button variant="ghost" aria-label="Close modal" onClick={onClose}>✕</Button>
        </div>
        <div id={describedById} className="sr-only">Update task details below</div>
        <div className="mt-2">{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}