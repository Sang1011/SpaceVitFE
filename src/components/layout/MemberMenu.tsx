import { Link, useNavigate } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import { roleLabel } from '../../lib/permissions'
import { Avatar, AvatarStack, Button, Popover, PopoverLabel, } from '../ui'

/** Cụm avatar thành viên; bấm để xem danh sách và mời thêm người (gộp nút "Mời" cũ vào đây). */
export function MemberMenu() {
  const { members, lock } = useWorkspace()
  const navigate = useNavigate()
  return (
    <Popover
      label="Thành viên không gian"
      trigger={(p) => (
        <button
          type="button"
          {...p}
          title="Thành viên và mời người"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          <span className="sr-only">Thành viên ({members.length})</span>
          <span aria-hidden="true"><AvatarStack members={members} max={3} /></span>
        </button>
      )}
    >
      <PopoverLabel className="pt-1">Thành viên ({members.length})</PopoverLabel>
      <ul className="max-h-60 overflow-y-auto">
        {members.map((m) => (
          <li key={m.name} className="flex items-center gap-space-sm rounded-lg px-2 py-1.5">
            <Avatar initials={m.initials} size={8} tone="neutral" />
            <span className="min-w-0 flex-1 truncate font-body-medium text-body-medium text-text-primary">{m.name}</span>
            {m.role && <span className="font-caption text-caption text-text-secondary">{roleLabel[m.role]}</span>}
          </li>
        ))}
      </ul>
      <div className="mt-1 border-t border-border pt-space-sm">
        <Button
          variant="outline"
          icon="person_add"
          className="w-full"
          data-popover-close
          lockedReason={lock('member.manage')}
          onClick={() => navigate('/khong-gian/thanh-vien?moi=1')}
        >
          Mời thành viên
        </Button>
        <Link
          to="/khong-gian/thanh-vien"
          data-popover-close
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-2 font-body-medium text-body-medium text-brand outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand"
        >
          Quản lý thành viên
        </Link>
      </div>
    </Popover>
  )
}
