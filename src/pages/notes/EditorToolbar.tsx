import { Button, Icon, IconButton } from '../../components/ui'
import { cn } from '../../lib/cn'
import { useWorkspace } from '../../context/WorkspaceContext'

const groups = [
  [{ i: 'format_bold', t: 'Đậm (Ctrl+B)' }, { i: 'format_italic', t: 'Nghiêng (Ctrl+I)' }, { i: 'format_underlined', t: 'Gạch chân (Ctrl+U)' }],
  [{ i: 'format_h1', t: 'Tiêu đề 1' }, { i: 'format_h2', t: 'Tiêu đề 2' }, { i: 'format_list_bulleted', t: 'Danh sách đầu dòng' }, { i: 'checklist', t: 'Danh sách việc' }],
  [{ i: 'code', t: 'Mã nguồn' }, { i: 'table', t: 'Chèn bảng' }],
]

export interface EditorToolbarProps {
  savedAt: string
  foldersOpen: boolean
  onToggleFolders: () => void
  panelOpen: boolean
  onTogglePanel: () => void
  /** Số mục cần chú ý trong panel (việc đề xuất chưa duyệt). */
  panelBadge?: number
}

/** Thanh công cụ soạn thảo. Viewer không thấy nút định dạng. Chỉ có một trạng thái lưu và một nút Chia sẻ. */
export function EditorToolbar({ savedAt, foldersOpen, onToggleFolders, panelOpen, onTogglePanel, panelBadge }: EditorToolbarProps) {
  const { canEdit } = useWorkspace()
  const toggle = (on: boolean) => cn(on && 'bg-surface-variant text-text-primary')
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-2 bg-surface/90 px-4 py-2.5 shadow-sm backdrop-blur">
      <div className="flex min-w-0 items-center gap-2">
        <IconButton variant="soft" icon="folder" label={foldersOpen ? 'Ẩn cây thư mục' : 'Hiện cây thư mục'} aria-pressed={foldersOpen} onClick={onToggleFolders} className={toggle(foldersOpen)} />
        {canEdit ? (
          <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-surface-variant p-1">
            {groups.map((g, gi) => (
              <div key={gi} className="flex items-center gap-1">
                {gi > 0 && <div className="mx-1 h-4 w-px bg-border" />}
                {g.map((b) => (
                  <button key={b.i} type="button" title={b.t} aria-label={b.t} className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-text-secondary transition-colors hover:bg-surface hover:text-text-primary">
                    <Icon name={b.i} size={18} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <span className="flex items-center gap-1.5 font-caption text-caption text-text-secondary"><Icon name="lock" size={16} />Chế độ chỉ xem</span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {canEdit && (
          <span role="status" className="hidden items-center gap-1.5 whitespace-nowrap font-caption text-caption text-text-secondary md:flex">
            <Icon name="cloud_done" size={16} className="text-status-success-text" />
            Đã lưu lúc {savedAt}
          </span>
        )}
        <Button variant="outline" size="md" icon="share" className="bg-surface shadow-sm">Chia sẻ</Button>
        <IconButton variant="soft" icon="view_sidebar" label={panelOpen ? 'Ẩn panel chi tiết' : 'Mở panel chi tiết'} aria-pressed={panelOpen} badgeDot={!panelOpen && !!panelBadge} onClick={onTogglePanel} className={toggle(panelOpen)} />
      </div>
    </div>
  )
}
