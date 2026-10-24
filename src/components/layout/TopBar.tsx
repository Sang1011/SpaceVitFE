import { useEffect, useRef } from 'react'
import { useWorkspace } from '../../context/WorkspaceContext'
import { Avatar, AvatarStack, Button, IconButton, SearchInput } from '../ui'
import { Logo } from './Logo'

export interface TopBarProps {
  breadcrumb: string[]
  onOpenAssistant?: () => void
  onCreate?: () => void
  onInvite?: () => void
}

export function TopBar({ breadcrumb, onOpenAssistant, onCreate, onInvite }: TopBarProps) {
  const { members, counts, canEdit } = useWorkspace()
  const search = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        search.current?.focus()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <header className="fixed left-[264px] right-0 top-0 z-40 flex h-16 items-center justify-between gap-space-md border-b border-border bg-surface/90 px-space-lg backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-space-sm">
        <Logo />
        <div className="h-4 w-px bg-border" />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 truncate font-body-medium text-body-medium text-text-secondary">
          {breadcrumb.map((b, i) => {
            const last = i === breadcrumb.length - 1
            return (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-border">/</span>}
                <span className={last ? 'font-semibold text-text-primary' : undefined}>{b}</span>
              </span>
            )
          })}
        </nav>
      </div>

      <div className="mx-space-md max-w-md flex-1">
        <SearchInput ref={search} hint="⌘K" placeholder="Tìm kiếm ghi chú, tài liệu, bản ghi... (Ctrl + K)" />
      </div>

      <div className="flex shrink-0 items-center gap-space-sm">
        <AvatarStack members={members} max={3} className="mr-1" />
        <Button variant="outline" icon="person_add" className="gap-1 px-2.5" onClick={onInvite} lockedReason={canEdit ? undefined : 'Bạn chỉ có quyền xem'}>
          Mời
        </Button>
        <div className="mx-0.5 h-5 w-px bg-border" />
        <IconButton icon="notifications" label="Thông báo" variant="soft" badgeDot={counts.hasUnreadNotifications} />
        <Button variant="ai" icon="auto_awesome" onClick={onOpenAssistant}>
          Trợ lý
        </Button>
        <Button icon="add" className="px-3.5" onClick={onCreate} lockedReason={canEdit ? undefined : 'Bạn chỉ có quyền xem'}>
          Tạo mới
        </Button>
        <Avatar icon="person" size={8} tone="solid" />
      </div>
    </header>
  )
}
