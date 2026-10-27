import { useWorkspace } from '../../context/WorkspaceContext'
import { Avatar, Icon, Popover, PopoverLabel, ThemePicker } from '../ui'

const soon = 'flex w-full cursor-not-allowed items-center gap-2.5 rounded-lg px-2 py-2 text-left font-body-medium text-body-medium text-text-secondary opacity-70'

/** Menu tài khoản ở góc phải thanh trên: thông tin người dùng, chọn giao diện sáng/tối. */
export function UserMenu() {
  const { user } = useWorkspace()
  return (
    <Popover
      label="Tài khoản và giao diện"
      trigger={(p) => (
        <button
          type="button"
          {...p}
          aria-label="Tài khoản và giao diện"
          title="Tài khoản và giao diện"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <Avatar icon="person" size={8} tone="solid" />
        </button>
      )}
    >
      <div className="flex items-center gap-space-sm px-2 py-2">
        <Avatar initials={user.initials} size={9} tone="brand-muted" />
        <div className="min-w-0">
          <p className="truncate font-card-title text-card-title text-[14px] leading-tight text-text-primary">{user.name}</p>
          <p className="truncate font-caption text-caption text-text-secondary">{user.title}</p>
        </div>
      </div>
      <div className="my-1 h-px bg-border" />
      <PopoverLabel className="pt-1">Giao diện</PopoverLabel>
      <ThemePicker />
      <div className="my-1 h-px bg-border" />
      <button type="button" disabled className={soon}>
        <Icon name="person" size={20} />
        <span className="flex-1">Hồ sơ</span>
        <span className="font-caption text-caption">Sắp có</span>
      </button>
      <button type="button" disabled className={soon}>
        <Icon name="logout" size={20} />
        <span className="flex-1">Đăng xuất</span>
        <span className="font-caption text-caption">Sắp có</span>
      </button>
    </Popover>
  )
}
