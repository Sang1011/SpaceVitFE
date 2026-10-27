import { useEffect, useRef } from 'react'
import { useWorkspace } from '../../context/WorkspaceContext'
import { cn } from '../../lib/cn'
import { Button, IconButton, Kbd, SearchInput } from '../ui'
import { CreateMenu } from './CreateMenu'
import { Logo } from './Logo'
import { MemberMenu } from './MemberMenu'
import { useShell } from './shell-context'
import { UserMenu } from './UserMenu'

export interface TopBarProps {
  breadcrumb: string[]
  /** Sidebar đang thu gọn (72px) nên thanh trên dịch sang trái. */
  compact?: boolean
}

export function TopBar({ breadcrumb, compact }: TopBarProps) {
  const { counts } = useWorkspace()
  const { assistantOpen, toggleAssistant } = useShell()
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
    <header className={cn('fixed right-0 top-0 z-40 flex h-16 items-center justify-between gap-space-md border-b border-border bg-surface/90 px-space-lg backdrop-blur-xl transition-[left] duration-200', compact ? 'left-[72px]' : 'left-[264px]')}>
      <div className="flex min-w-0 items-center gap-space-sm">
        <Logo />
        <div className="h-4 w-px bg-border" />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 truncate font-body-medium text-body-medium text-text-secondary">
          {breadcrumb.map((b, i) => {
            const last = i === breadcrumb.length - 1
            return (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden="true" className="text-border">/</span>}
                <span className={last ? 'font-semibold text-text-primary' : undefined}>{b}</span>
              </span>
            )
          })}
        </nav>
      </div>

      <div className="mx-space-md max-w-md flex-1">
        <SearchInput ref={search} hint={<Kbd keys={['mod', 'K']} />} placeholder="Tìm kiếm ghi chú, tài liệu, bản ghi..." />
      </div>

      <div className="flex shrink-0 items-center gap-space-sm">
        <MemberMenu />
        <IconButton icon="notifications" label="Thông báo" variant="soft" badgeDot={counts.hasUnreadNotifications} />
        <Button variant="ai" icon="auto_awesome" aria-pressed={assistantOpen} onClick={toggleAssistant}>
          Trợ lý
        </Button>
        <CreateMenu />
        <UserMenu />
      </div>
    </header>
  )
}
