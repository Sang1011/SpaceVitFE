import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { IconButton } from './IconButton'

export const SIDE_PANEL_MIN = 400
export const SIDE_PANEL_MAX = 480
const clamp = (n: number) => Math.min(SIDE_PANEL_MAX, Math.max(SIDE_PANEL_MIN, n))

export interface SidePanelProps {
  open: boolean
  onClose: () => void
  /** Tên panel, đọc bởi trình đọc màn hình. */
  title: string
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
  defaultWidth?: number
  className?: string
}

/**
 * Panel chi tiết dùng chung (D4). Từ 1100px: nằm trong luồng bố cục, đẩy nội dung bên cạnh
 * (cha cần `flex`), rộng 400–480px, kéo thanh bên trái hoặc dùng phím mũi tên để đổi.
 * Dưới 1100px: thành hộp thoại nổi có nền mờ, Esc để đóng.
 */
export function SidePanel({ open, onClose, title, header, footer, children, defaultWidth = 440, className }: SidePanelProps) {
  const docked = useMediaQuery('(min-width: 1100px)')
  const [width, setWidth] = useState(clamp(defaultWidth))
  const drag = useRef<{ x: number; w: number } | null>(null)
  const panel = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open && !docked) panel.current?.focus()
  }, [open, docked])

  const onDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, w: width }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [width])
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current) setWidth(clamp(drag.current.w + (drag.current.x - e.clientX)))
  }
  const onUp = () => {
    drag.current = null
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') setWidth((w) => clamp(w + 16))
    else if (e.key === 'ArrowRight') setWidth((w) => clamp(w - 16))
    else if (e.key === 'Home') setWidth(SIDE_PANEL_MIN)
    else if (e.key === 'End') setWidth(SIDE_PANEL_MAX)
    else return
    e.preventDefault()
  }

  if (!open) return null

  const body = (
    <aside
      ref={panel}
      tabIndex={-1}
      role={docked ? 'complementary' : 'dialog'}
      aria-modal={docked ? undefined : true}
      aria-label={title}
      style={docked ? { width } : undefined}
      className={cn(
        'relative flex shrink-0 flex-col overflow-hidden bg-surface outline-none',
        docked ? 'h-full rounded-2xl border border-border shadow-sm' : 'h-full w-full max-w-[520px] shadow-xl',
        className,
      )}
    >
      {docked && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Đổi độ rộng panel"
          aria-valuemin={SIDE_PANEL_MIN}
          aria-valuemax={SIDE_PANEL_MAX}
          aria-valuenow={width}
          tabIndex={0}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onKeyDown={onKeyDown}
          className="absolute inset-y-0 left-0 z-10 w-1.5 cursor-col-resize touch-none outline-none transition-colors hover:bg-brand/40 focus-visible:bg-brand"
        />
      )}
      <div className="flex shrink-0 items-center justify-between gap-space-sm border-b border-border p-space-md">
        <div className="min-w-0 flex-1">{header ?? <h2 className="truncate font-card-title text-card-title text-text-primary">{title}</h2>}</div>
        <IconButton icon="close" label="Đóng panel" onClick={onClose} />
      </div>
      <div className="flex-1 space-y-space-lg overflow-y-auto p-space-lg">{children}</div>
      {footer && <div className="flex shrink-0 items-center justify-between gap-space-sm border-t border-border p-space-md">{footer}</div>}
    </aside>
  )

  if (docked) return body
  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-text-primary/40" onClick={onClose} aria-hidden="true" />
      <div className="relative flex h-full w-full justify-end">{body}</div>
    </div>
  )
}
