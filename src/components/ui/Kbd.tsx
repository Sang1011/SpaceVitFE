import { cn } from '../../lib/cn'
import { isApplePlatform } from '../../lib/useMediaQuery'

/** Phím tắt theo nền tảng: `mod` hiện ⌘ trên máy Apple và Ctrl trên máy khác. */
export function Kbd({ keys, className }: { keys: string[]; className?: string }) {
  const apple = isApplePlatform()
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {keys.map((k) => (
        <kbd
          key={k}
          className="rounded border border-border bg-surface px-1.5 py-0.5 font-label-mono text-label-mono text-[10px] leading-none text-text-secondary"
        >
          {k === 'mod' ? (apple ? '⌘' : 'Ctrl') : k}
        </kbd>
      ))}
    </span>
  )
}
