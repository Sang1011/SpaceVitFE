import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useWorkspace } from '../../context/WorkspaceContext'
import type { Space, SpaceRole } from '../../types/workspace'
import { Avatar, Badge, Button, IconButton, Icon, Popover, PopoverLabel, ThemePicker } from '../ui'
import { CreateSpaceDialog } from './CreateSpaceDialog'
import { assistantNav, mainNav, myTasksNav } from './nav'
import { NavItem } from './NavItem'

const roleLabel: Record<SpaceRole, string> = { owner: 'Owner', editor: 'Editor', viewer: 'Viewer' }

export function SpaceSwitcher({ compact }: { compact?: boolean }) {
  const { space, spaces, switchSpace } = useWorkspace()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const live = spaces.filter((s) => !s.archived)
  const old = spaces.filter((s) => s.archived)
  const pick = (id: string) => {
    if (id === space.id) return
    switchSpace(id)
    navigate('/tong-quan')
  }
  const item = (s: Space) => (
    <button
      key={s.id}
      type="button"
      role="radio"
      aria-checked={s.id === space.id}
      data-popover-close=""
      onClick={() => pick(s.id)}
      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left outline-none transition-colors hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand"
    >
      <Icon name={s.id === space.id ? 'radio_button_checked' : 'radio_button_unchecked'} size={20} className={s.id === space.id ? 'text-brand' : 'text-text-secondary'} />
      <span className="min-w-0 flex-1 truncate font-body-medium text-body-medium text-text-primary">{s.name}</span>
      <Badge size="xs">{roleLabel[s.role]}</Badge>
    </button>
  )
  const tile = (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
      <Icon name={space.archived ? 'inventory_2' : 'folder_supervised'} size={20} />
    </div>
  )
  return (
    <div className={cn('flex h-16 items-center border-b border-border', compact ? 'justify-center' : 'px-space-md')}>
      <Popover
        label="Đổi không gian"
        align="left"
        className={compact ? undefined : 'min-w-0 flex-1'}
        panelClassName="w-72"
        trigger={(p) => (
          <button
            type="button"
            {...p}
            title={space.name}
            className={cn(
              'flex items-center gap-space-sm rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
              compact ? '' : 'min-w-0 flex-1',
            )}
          >
            {tile}
            {compact ? (
              <span className="sr-only">Không gian {space.name}. Đổi không gian</span>
            ) : (
              <>
                <span className="flex min-w-0 flex-1 items-center gap-space-xs">
                  <span className="block truncate font-card-title text-card-title text-text-primary">{space.name}</span>
                  <Badge size="xs">{space.archived ? 'Lưu trữ' : roleLabel[space.role]}</Badge>
                </span>
                <Icon name="unfold_more" size={18} className="shrink-0 text-text-secondary" />
              </>
            )}
          </button>
        )}
      >
        <PopoverLabel className="pt-1">Không gian của bạn</PopoverLabel>
        <div role="radiogroup" aria-label="Chọn không gian" className="space-y-0.5">{live.map(item)}</div>
        {old.length > 0 && (
          <>
            <PopoverLabel>Đã lưu trữ</PopoverLabel>
            <div role="radiogroup" aria-label="Không gian đã lưu trữ" className="space-y-0.5">{old.map(item)}</div>
          </>
        )}
        <div className="mt-1 space-y-0.5 border-t border-border pt-space-sm">
          <Button variant="outline" icon="add" className="w-full" data-popover-close onClick={() => setCreating(true)}>
            Tạo không gian mới
          </Button>
          <Link
            to="/khong-gian/cai-dat"
            data-popover-close
            className="flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-body-medium text-body-medium text-brand outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand"
          >
            Cài đặt không gian
          </Link>
        </div>
      </Popover>
      <CreateSpaceDialog open={creating} onClose={() => setCreating(false)} />
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

export interface SidebarProps {
  compact?: boolean
  /** Dưới 768px: Sidebar là ngăn kéo trượt từ trái, mở bằng nút menu ở thanh trên. */
  mobile?: boolean
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ compact, mobile, open, onClose }: SidebarProps) {
  const { counts } = useWorkspace()
  const hidden = mobile && !open

  useEffect(() => {
    if (!mobile || !open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobile, open, onClose])

  return (
    <>
      {mobile && open && <div aria-hidden="true" onClick={onClose} className="fixed inset-0 z-[55] bg-black/40" />}
      <aside
        id="app-sidebar"
        aria-label="Thanh bên"
        inert={hidden}
        onClick={(e) => {
          if (mobile && (e.target as HTMLElement).closest('a')) onClose?.()
        }}
        className={cn(
          'fixed left-0 top-0 z-[60] flex h-full flex-col justify-between border-r border-border bg-surface transition-[width,transform] duration-200',
          compact ? 'w-[72px]' : 'w-[264px]',
          mobile && (open ? 'translate-x-0 shadow-xl' : '-translate-x-full'),
        )}
      >
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
    </>
  )
}
