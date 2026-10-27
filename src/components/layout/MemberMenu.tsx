import { useWorkspace } from '../../context/WorkspaceContext'
import { Avatar, AvatarStack, Button, Popover, PopoverLabel, useToast } from '../ui'

/** Cụm avatar thành viên; bấm để xem danh sách và mời thêm người (gộp nút "Mời" cũ vào đây). */
export function MemberMenu() {
  const { members, canEdit } = useWorkspace()
  const { toast } = useToast()
  return (
    <Popover
      label="Thành viên không gian"
      trigger={(p) => (
        <button
          type="button"
          {...p}
          aria-label={`Thành viên (${members.length})`}
          title="Thành viên và mời người"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <AvatarStack members={members} max={3} />
        </button>
      )}
    >
      <PopoverLabel className="pt-1">Thành viên ({members.length})</PopoverLabel>
      <ul className="max-h-60 overflow-y-auto">
        {members.map((m) => (
          <li key={m.name} className="flex items-center gap-space-sm rounded-lg px-2 py-1.5">
            <Avatar initials={m.initials} size={8} tone="neutral" />
            <span className="min-w-0 flex-1 truncate font-body-medium text-body-medium text-text-primary">{m.name}</span>
          </li>
        ))}
      </ul>
      <div className="mt-1 border-t border-border pt-space-sm">
        <Button
          variant="outline"
          icon="person_add"
          className="w-full"
          data-popover-close
          lockedReason={canEdit ? undefined : 'Bạn chỉ có quyền xem'}
          onClick={() => toast({ message: 'Mời thành viên sẽ dùng được khi có kết nối máy chủ.', tone: 'info' })}
        >
          Mời thành viên
        </Button>
      </div>
    </Popover>
  )
}
