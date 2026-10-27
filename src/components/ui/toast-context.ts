import { createContext, useContext } from 'react'

export interface ToastOptions {
  message: string
  tone?: 'info' | 'success' | 'error'
  /** Nút hành động, ví dụ Hoàn tác. */
  action?: { label: string; onClick: () => void }
  /** Mili giây trước khi tự ẩn. Mặc định 6000; toast có Hoàn tác không tự ẩn khi đang rê chuột/focus vào. */
  duration?: number
}

export interface ToastCtx {
  toast: (o: ToastOptions) => number
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastCtx | null>(null)

export function useToast(): ToastCtx {
  const c = useContext(ToastContext)
  if (!c) throw new Error('useToast must be used inside ToastProvider')
  return c
}
