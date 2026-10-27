import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import { Button, Icon, Popover } from '../ui'

const items = [
  { icon: 'edit_note', label: 'Ghi chú mới', to: '/ghi-chu' },
  { icon: 'mic', label: 'Tải lên ghi âm', to: '/ghi-am' },
  { icon: 'upload_file', label: 'Tải lên tài liệu', to: '/tai-lieu' },
  { icon: 'add_task', label: 'Thêm việc', to: '/bang-cong-viec' },
]

/** Nút "Tạo mới" mở danh sách những thứ có thể tạo, thay cho nút chưa nối hành động. */
export function CreateMenu() {
  const { canEdit } = useWorkspace()
  const navigate = useNavigate()
  return (
    <Popover
      label="Tạo mới"
      panelClassName="w-56"
      trigger={(p) => (
        <Button {...p} icon="add" className="px-3.5" iconRight="expand_more" lockedReason={canEdit ? undefined : 'Bạn chỉ có quyền xem'}>
          Tạo mới
        </Button>
      )}
    >
      <ul>
        {items.map((it) => (
          <li key={it.to}>
            <button
              type="button"
              data-popover-close
              onClick={() => navigate(it.to)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left font-body-medium text-body-medium text-text-primary outline-none transition-colors hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Icon name={it.icon} size={20} className="text-text-secondary" />
              {it.label}
            </button>
          </li>
        ))}
      </ul>
    </Popover>
  )
}
