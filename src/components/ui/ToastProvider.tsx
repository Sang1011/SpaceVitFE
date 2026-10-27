import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'
import { ToastContext, type ToastOptions } from './toast-context'

interface Item extends ToastOptions {
  id: number
}

const toneIcon = { info: 'info', success: 'check_circle', error: 'error' } as const
const toneColor = { info: 'text-brand', success: 'text-status-success-text', error: 'text-status-error-text' } as const

/** Thông báo ngắn ở góc dưới phải. Vùng `aria-live` để trình đọc màn hình đọc nội dung mới. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const next = useRef(1)
  const timers = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    window.clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setItems((l) => l.filter((t) => t.id !== id))
  }, [])

  const arm = useCallback((id: number, ms: number) => {
    window.clearTimeout(timers.current.get(id))
    timers.current.set(id, window.setTimeout(() => dismiss(id), ms))
  }, [dismiss])

  const toast = useCallback((o: ToastOptions) => {
    const id = next.current++
    setItems((l) => [...l.slice(-3), { ...o, id }])
    arm(id, o.duration ?? 6000)
    return id
  }, [arm])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {items.map((t) => {
          const tone = t.tone ?? 'info'
          return (
            <div
              key={t.id}
              role={tone === 'error' ? 'alert' : 'status'}
              onMouseEnter={() => window.clearTimeout(timers.current.get(t.id))}
              onMouseLeave={() => arm(t.id, 3000)}
              className="pointer-events-auto flex animate-fade-in items-center gap-2.5 rounded-xl border border-border bg-surface px-space-md py-2.5 shadow-xl"
            >
              <Icon name={toneIcon[tone]} size={20} className={cn('shrink-0', toneColor[tone])} />
              <p className="min-w-0 flex-1 font-body-default text-body-default text-[13px] text-text-primary">{t.message}</p>
              {t.action && (
                <button
                  type="button"
                  onClick={() => {
                    t.action?.onClick()
                    dismiss(t.id)
                  }}
                  className="shrink-0 rounded-md px-2 py-1 font-body-medium text-body-medium text-[13px] font-semibold text-brand outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand"
                >
                  {t.action.label}
                </button>
              )}
              <button
                type="button"
                aria-label="Đóng thông báo"
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-md p-1 text-text-secondary outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
