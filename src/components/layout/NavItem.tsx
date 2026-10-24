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
}

const base =
  'flex items-center gap-space-sm px-space-sm py-2 rounded-lg text-text-secondary hover:bg-surface-variant hover:text-text-primary transition-colors font-body-medium text-body-medium'

export function NavItem({ to, icon, label, trailing, aiIcon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(base, trailing && 'justify-between', isActive && 'bg-surface-variant text-brand font-semibold')
      }
    >
      <span className="flex items-center gap-space-sm">
        <Icon name={icon} size={20} className={aiIcon ? 'text-ai-accent' : undefined} />
        <span>{label}</span>
      </span>
      {trailing}
    </NavLink>
  )
}
