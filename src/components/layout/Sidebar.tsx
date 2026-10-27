import { useWorkspace } from '../../context/WorkspaceContext'
import type { SpaceRole } from '../../types/workspace'
import { Avatar, Badge, IconButton, Icon, Popover, PopoverLabel, ThemePicker } from '../ui'
import { assistantNav, mainNav, myTasksNav } from './nav'
import { NavItem } from './NavItem'

const roleLabel: Record<SpaceRole, string> = { owner: 'Owner', editor: 'Editor', viewer: 'Viewer' }

export function SpaceSwitcher() {
  const { space } = useWorkspace()
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

export function UserCard() {
  const { user } = useWorkspace()
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
        <Popover
          label="Cài đặt giao diện"
          side="top"
          panelClassName="w-60"
          trigger={(p) => <IconButton {...p} icon="settings" label="Cài đặt" />}
        >
          <PopoverLabel className="pt-1">Giao diện</PopoverLabel>
          <ThemePicker />
        </Popover>
      </div>
    </div>
  )
}

export function Sidebar() {
  const { counts } = useWorkspace()
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-[264px] flex-col justify-between border-r border-border bg-surface">
      <div className="flex min-h-0 flex-1 flex-col">
        <SpaceSwitcher />
        <nav className="flex-1 space-y-1 overflow-y-auto px-space-sm py-space-md">
          {mainNav.map((n) => (
            <NavItem key={n.to} {...n} />
          ))}
          <NavItem
            {...assistantNav}
            aiIcon
            trailing={
              <Badge tone="ai" bold>
                ✦ PRO
              </Badge>
            }
          />
          <div className="pb-space-xs pt-space-sm">
            <div className="my-space-xs h-px bg-border" />
          </div>
          <NavItem
            {...myTasksNav}
            trailing={
              <Badge tone="primary-solid" shape="circle" mono bold>
                {counts.myTasks}
              </Badge>
            }
          />
        </nav>
      </div>
      <UserCard />
    </aside>
  )
}
