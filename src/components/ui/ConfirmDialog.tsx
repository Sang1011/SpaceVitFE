import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from './Button'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** destructive: nút xác nhận màu đỏ (xóa, ghi đè). */
  tone?: 'default' | 'destructive'
  onConfirm: () => void
  onCancel: () => void
}

/** Hộp xác nhận cho hành động thay đổi dữ liệu. Focus mở ở nút Hủy để tránh bấm nhầm; Esc để hủy; Tab xoay vòng trong hộp. */
export function ConfirmDialog({ open, title, description, confirmLabel = 'Xác nhận', cancelLabel = 'Hủy', tone = 'default', onConfirm, onCancel }: ConfirmDialogProps) {
  const titleId = useId()
  const descId = useId()
  const box = useRef<HTMLDivElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    cancel.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCancel()
      } else if (e.key === 'Tab') {
        const f = box.current?.querySelectorAll<HTMLElement>('button:not(:disabled)')
        if (!f || f.length === 0) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      prev?.focus()
    }
  }, [open, onCancel])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-space-md">
      <div className="absolute inset-0 bg-text-primary/50" onClick={onCancel} aria-hidden="true" />
      <div
        ref={box}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="relative w-full max-w-md animate-fade-in space-y-space-sm rounded-2xl border border-border bg-surface p-space-lg shadow-xl"
      >
        <h2 id={titleId} className="font-card-title text-card-title text-text-primary">{title}</h2>
        {description && <p id={descId} className="font-body-default text-body-default text-text-secondary">{description}</p>}
        <div className="flex justify-end gap-2 pt-space-sm">
          <button
            ref={cancel}
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 items-center rounded-lg border border-border px-3.5 font-body-medium text-body-medium text-[13px] text-text-primary outline-none transition-colors hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand"
          >
            {cancelLabel}
          </button>
          <Button size="md" variant={tone === 'destructive' ? 'destructive' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
