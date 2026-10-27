import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Icon } from '../ui'

export interface NavItemProps {
  to: string
  icon: string
  label: string
  /** Right-hand slot (badge). When set the row uses justify-between. */
  trailing?: ReactNode
  /** Violet icon (Trợ lý AI). */
  aiIcon?: boolean
  /** Chỉ hiện icon (Sidebar thu gọn). Nhãn vẫn có cho trình đọc màn hình và tooltip. */
  compact?: boolean
}

const base =
  'relative flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-text-secondary hover:bg-surface-variant hover:text-text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand font-body-medium text-body-medium'

export function NavItem({ to, icon, label, trailing, aiIcon, compact }: NavItemProps) {
  return (
    <NavLink
      to={to}
      title={compact ? label : undefined}
      className={({ isActive }) =>
        cn(base, compact ? 'justify-center' : trailing && 'justify-between', isActive && 'bg-surface-variant text-brand font-semibold')
      }
    >
      <span className="flex items-center gap-space-sm">
        <Icon name={icon} size={20} className={aiIcon ? 'text-ai-accent' : undefined} />
        <span className={compact ? 'sr-only' : undefined}>{label}</span>
      </span>
      {trailing && <span className={compact ? 'absolute -right-0.5 -top-0.5 scale-75' : undefined}>{trailing}</span>}
    </NavLink>
  )
}
