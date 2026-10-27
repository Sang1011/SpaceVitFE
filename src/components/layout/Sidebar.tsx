import { cn } from '../../lib/cn'
import { useWorkspace } from '../../context/WorkspaceContext'
import type { SpaceRole } from '../../types/workspace'
import { Avatar, Badge, IconButton, Icon, Popover, PopoverLabel, ThemePicker } from '../ui'
import { assistantNav, mainNav, myTasksNav } from './nav'
import { NavItem } from './NavItem'

const roleLabel: Record<SpaceRole, string> = { owner: 'Owner', editor: 'Editor', viewer: 'Viewer' }

export function SpaceSwitcher({ compact }: { compact?: boolean }) {
  const { space } = useWorkspace()
  if (compact) {
    return (
      <div className="flex h-16 items-center justify-center border-b border-border" title={space.name}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon name="folder_supervised" size={20} />
        </div>
        <span className="sr-only">{space.name}</span>
      </div>
    )
  }
  return (
    <div className="flex h-16 items-center justify-between border-b border-border px-space-md">
      <div className="flex min-w-0 flex-1 items-center gap-space-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Icon name="folder_supervised" size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-space-xs">
            <span className="block truncate font-card-title text-card-title text-text-primary">{space.name}</span>
            <Badge size="xs">{roleLabel[space.role]}</Badge>
          </div>
        </div>
        <IconButton icon="unfold_more" iconSize={18} label="Đổi không gian" />
      </div>
    </div>
  )
}

export function UserCard({ compact }: { compact?: boolean }) {
  const { user } = useWorkspace()
  const settings = (
    <Popover
      label="Cài đặt giao diện"
      side="top"
      align={compact ? 'left' : 'right'}
      panelClassName="w-60"
      trigger={(p) => <IconButton {...p} icon="settings" label="Cài đặt" />}
    >
      <PopoverLabel className="pt-1">Giao diện</PopoverLabel>
      <ThemePicker />
    </Popover>
  )
  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1 border-t border-border p-space-sm" title={user.name}>
        <Avatar initials={user.initials} size={9} tone="brand-muted" presence />
        {settings}
      </div>
    )
  }
  return (
    <div className="border-t border-border p-space-sm">
      <div className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-surface-variant">
        <div className="flex min-w-0 items-center gap-space-sm">
          <Avatar initials={user.initials} size={9} tone="brand-muted" presence />
          <div className="min-w-0">
            <p className="truncate font-card-title text-card-title text-[13px] leading-tight text-text-primary">{user.name}</p>
            <p className="truncate font-caption text-caption text-[11px] text-text-secondary">{user.title}</p>
          </div>
        </div>
        {settings}
      </div>
    </div>
  )
}

export function Sidebar({ compact }: { compact?: boolean }) {
  const { counts } = useWorkspace()
  return (
    <aside className={cn('fixed left-0 top-0 z-50 flex h-full flex-col justify-between border-r border-border bg-surface transition-[width] duration-200', compact ? 'w-[72px]' : 'w-[264px]')}>
      <div className="flex min-h-0 flex-1 flex-col">
        <SpaceSwitcher compact={compact} />
        <nav aria-label="Điều hướng chính" className="flex-1 space-y-1 overflow-y-auto px-space-sm py-space-md">
          {mainNav.map((n) => (
            <NavItem key={n.to} {...n} compact={compact} />
          ))}
          <NavItem {...assistantNav} aiIcon compact={compact} />
          <div className="pb-space-xs pt-space-sm">
            <div className="my-space-xs h-px bg-border" />
          </div>
          <NavItem
            {...myTasksNav}
            compact={compact}
            trailing={
              <Badge tone="primary-solid" shape="circle" mono bold>
                {counts.myTasks}
              </Badge>
            }
          />
        </nav>
      </div>
      <UserCard compact={compact} />
    </aside>
  )
}
