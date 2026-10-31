import { useEffect, useRef, useState } from 'react'
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
  /** Dưới 768px: có nút menu mở ngăn kéo, tìm kiếm thu thành nút. */
  mobile?: boolean
  onMenu?: () => void
}

export function TopBar({ breadcrumb, compact, mobile, onMenu }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
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
    <header className={cn('fixed right-0 top-0 z-40 flex h-16 items-center justify-between gap-space-md border-b border-border bg-surface/90 px-3 backdrop-blur-xl transition-[left] duration-200 sm:px-space-lg', mobile ? 'left-0' : compact ? 'left-[72px]' : 'left-[264px]')}>
      <div className="flex min-w-0 items-center gap-space-sm">
        {mobile && <IconButton icon="menu" label="Mở menu" variant="soft" aria-controls="app-sidebar" onClick={onMenu} />}
        <Logo className="hidden sm:block" />
        <div className="hidden h-4 w-px bg-border sm:block" />
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 truncate font-body-medium text-body-medium text-text-secondary">
          {breadcrumb.map((b, i) => {
            const last = i === breadcrumb.length - 1
            return (
              <span key={i} className={cn('items-center gap-1.5', last ? 'flex' : 'hidden lg:flex')}>
                {i > 0 && <span aria-hidden="true" className="hidden text-border lg:inline">/</span>}
                <span className={last ? 'font-semibold text-text-primary' : undefined}>{b}</span>
              </span>
            )
          })}
        </nav>
      </div>

      <div className={cn('mx-space-md max-w-md flex-1', mobile && (searchOpen ? 'absolute inset-x-3 top-[68px] mx-0 max-w-none rounded-xl bg-surface p-2 shadow-lg' : 'hidden'))}>
        <SearchInput ref={search} hint={mobile ? undefined : <Kbd keys={['mod', 'K']} />} placeholder="Tìm kiếm ghi chú, tài liệu, bản ghi..." />
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-space-sm">
        {mobile && (
          <IconButton
            icon={searchOpen ? 'close' : 'search'}
            label={searchOpen ? 'Đóng tìm kiếm' : 'Tìm kiếm'}
            variant="soft"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen(!searchOpen)
              if (!searchOpen) requestAnimationFrame(() => search.current?.focus())
            }}
          />
        )}
        <span className="hidden md:inline-flex"><MemberMenu /></span>
        <span className="hidden sm:inline-flex"><IconButton icon="notifications" label="Thông báo" variant="soft" badgeDot={counts.hasUnreadNotifications} /></span>
        <Button variant="ai" icon="auto_awesome" aria-pressed={assistantOpen} onClick={toggleAssistant} className="max-sm:px-2">
          <span className="max-sm:sr-only">Trợ lý</span>
        </Button>
        <CreateMenu />
        <UserMenu />
      </div>
    </header>
  )
}
