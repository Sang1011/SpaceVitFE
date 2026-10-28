import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react'
import { cn } from '../../lib/cn'

/** Props cần gắn vào nút kích hoạt (spread vào <button> hoặc <IconButton>). */
export interface PopoverTriggerProps {
  ref: RefObject<HTMLButtonElement | null>
  'aria-haspopup': 'dialog'
  'aria-expanded': boolean
  'aria-controls': string | undefined
  onClick: () => void
}

export interface PopoverProps {
  /** Tên của hộp thoại, đọc bởi trình đọc màn hình. */
  label: string
  trigger: (props: PopoverTriggerProps) => ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  side?: 'top' | 'bottom'
  className?: string
  panelClassName?: string
}

/**
 * Hộp nổi không chặn nền (non-modal): đóng bằng Esc (trả focus về nút), bấm ra ngoài,
 * hoặc Tab ra khỏi hộp. Khi mở, focus chuyển vào phần tử đầu tiên dùng được
 * (ưu tiên lựa chọn đang chọn).
 */
export function Popover({ label, trigger, children, align = 'right', side = 'bottom', className, panelClassName }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const el = panel.current
    const target =
      el?.querySelector<HTMLElement>('[role="radio"][aria-checked="true"]') ??
      el?.querySelector<HTMLElement>('[data-autofocus]') ??
      el?.querySelector<HTMLElement>('button:not(:disabled), a[href]')
    target?.focus()
  }, [open])

  return (
    <div
      ref={wrap}
      className={cn('relative inline-flex', className)}
      // Tab ra ngoài thì đóng. Bấm vào vùng trống trong hộp (relatedTarget = null) thì không đóng.
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null
        if (open && next && !wrap.current?.contains(next)) setOpen(false)
      }}
    >
      {trigger({
        ref: triggerRef,
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
        onClick: () => setOpen((o) => !o),
      })}
      {open && (
        <div
          ref={panel}
          id={id}
          role="dialog"
          data-popover-panel=""
          aria-label={label}
          // Phần tử có data-popover-close: bấm vào thì đóng hộp (dùng cho các mục menu).
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('[data-popover-close]')) close()
          }}
          className={cn(
            'absolute z-50 w-72 animate-fade-in rounded-xl border border-border bg-surface p-space-sm shadow-xl',
            side === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
            align === 'right' ? 'right-0' : 'left-0',
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/** Nhãn nhỏ của một nhóm trong hộp nổi. */
export function PopoverLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('px-2 pb-1 pt-2 font-caption text-caption font-semibold uppercase tracking-wide text-text-secondary', className)}>
      {children}
    </p>
  )
}
