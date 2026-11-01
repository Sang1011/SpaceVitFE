import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { IconButton } from './IconButton'

export interface DialogProps {
  open: boolean
  title: string
  description?: ReactNode
  onClose: () => void
  /** Nội dung (thường là một form). */
  children: ReactNode
  className?: string
}

const FOCUSABLE = 'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]'

/**
 * Hộp thoại có nội dung tuỳ ý (form). Khác ConfirmDialog: focus mở vào ô đầu tiên (hoặc phần tử có data-autofocus),
 * Esc đóng, Tab xoay vòng trong hộp, trả focus về nút đã mở.
 */
export function Dialog({ open, title, description, onClose, children, className }: DialogProps) {
  const titleId = useId()
  const descId = useId()
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const el = box.current
    const first = el?.querySelector<HTMLElement>('[data-autofocus]') ?? el?.querySelector<HTMLElement>('input:not(:disabled), textarea:not(:disabled)') ?? el?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      } else if (e.key === 'Tab') {
        const f = box.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (!f || f.length === 0) return
        const a = f[0]
        const z = f[f.length - 1]
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          z.focus()
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      prev?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-space-md">
      <div className="absolute inset-0 bg-text-primary/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={cn('relative max-h-[90vh] w-full max-w-lg animate-fade-in space-y-space-md overflow-y-auto rounded-2xl border border-border bg-surface p-space-lg shadow-xl', className)}
      >
        <div className="flex items-start justify-between gap-space-sm">
          <div className="space-y-1">
            <h2 id={titleId} className="font-section-title text-section-title text-text-primary">{title}</h2>
            {description && <p id={descId} className="font-body-default text-body-default text-text-secondary">{description}</p>}
          </div>
          <IconButton icon="close" label="Đóng" variant="soft" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  )
}
