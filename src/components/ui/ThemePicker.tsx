import { useRef, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'
import { useTheme, type ThemeMode } from '../../theme/theme-context'
import { Icon } from './Icon'

const options: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Sáng', icon: 'light_mode' },
  { value: 'dark', label: 'Tối', icon: 'dark_mode' },
  { value: 'system', label: 'Theo hệ thống', icon: 'contrast' },
]

/**
 * Chọn giao diện Sáng / Tối / Theo hệ thống. Là nhóm radio đúng chuẩn:
 * chỉ lựa chọn đang chọn nằm trong thứ tự Tab; mũi tên (và Home/End) đổi lựa chọn.
 */
export function ThemePicker({ className }: { className?: string }) {
  const { mode, resolved, setMode } = useTheme()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    const i = options.findIndex((o) => o.value === mode)
    let next = -1
    if (e.key in keys) next = (i + keys[e.key] + options.length) % options.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = options.length - 1
    if (next < 0) return
    e.preventDefault()
    setMode(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div role="radiogroup" aria-label="Giao diện" onKeyDown={onKeyDown} className={cn('flex flex-col gap-0.5', className)}>
      {options.map((o, i) => {
        const selected = o.value === mode
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => setMode(o.value)}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left font-body-medium text-body-medium outline-none transition-colors',
              'focus-visible:ring-2 focus-visible:ring-brand',
              selected ? 'bg-surface-container text-text-primary' : 'text-text-primary hover:bg-surface-variant',
            )}
          >
            <Icon name={o.icon} size={20} className={selected ? 'text-brand' : 'text-text-secondary'} />
            <span className="min-w-0 flex-1">
              <span className={cn('block', selected && 'font-semibold')}>{o.label}</span>
              {o.value === 'system' && (
                <span className="block font-caption text-caption font-normal text-text-secondary">
                  Hiện đang dùng: {resolved === 'dark' ? 'Tối' : 'Sáng'}
                </span>
              )}
            </span>
            {selected && <Icon name="check" size={18} className="text-brand" />}
          </button>
        )
      })}
    </div>
  )
}
