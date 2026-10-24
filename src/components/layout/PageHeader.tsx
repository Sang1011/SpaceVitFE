import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../ui'

export interface PageHeaderProps {
  icon?: string
  title: ReactNode
  /** Show the small chevron after the title (board selector). */
  chevron?: boolean
  /** Status line next to the title, e.g. "15 công việc đang theo dõi". */
  meta?: { text: ReactNode; dot?: 'success' | 'muted' }
  actions?: ReactNode
  /** Rendered under the title row, e.g. a <FilterBar/>. */
  children?: ReactNode
  className?: string
}

export function PageHeader({ icon, title, chevron, meta, actions, children, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-space-lg flex flex-col gap-space-md', className)}>
      <div className="flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex min-w-0 items-center gap-space-md">
          <div className="flex items-center gap-space-sm rounded-lg bg-surface px-space-md py-1.5 shadow-sm">
            {icon && <Icon name={icon} size={20} className="text-[22px] text-brand" />}
            <h1 className="font-section-title text-section-title text-text-primary">{title}</h1>
            {chevron && <Icon name="expand_more" size={18} className="cursor-pointer text-text-secondary hover:text-text-primary" />}
          </div>
          {meta && (
            <div className="flex items-center gap-space-xs font-caption text-caption text-text-secondary">
              <span className={cn('flex h-2 w-2 rounded-full', meta.dot === 'muted' ? 'bg-priority-low' : 'bg-status-success')} />
              <span>{meta.text}</span>
            </div>
          )}
        </div>
        {actions && <div className="flex items-center gap-space-sm">{actions}</div>}
      </div>
      {children}
    </header>
  )
}
