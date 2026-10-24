import { Button, Icon } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'

const groups = [
  [{ i: 'format_bold', t: 'Đậm (Ctrl+B)' }, { i: 'format_italic', t: 'Nghiêng (Ctrl+I)' }, { i: 'format_underlined', t: 'Gạch chân (Ctrl+U)' }],
  [{ i: 'format_h1', t: 'Tiêu đề 1' }, { i: 'format_h2', t: 'Tiêu đề 2' }, { i: 'format_list_bulleted', t: 'Danh sách đầu dòng' }, { i: 'checklist', t: 'Danh sách việc' }],
  [{ i: 'code', t: 'Mã nguồn' }, { i: 'table', t: 'Chèn bảng' }],
]

export function EditorToolbar({ savedAt }: { savedAt: string }) {
  const { canEdit } = useWorkspace()
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-surface/90 px-8 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center gap-1 rounded-lg bg-surface-variant p-1">
        {groups.map((g, gi) => (
          <div key={gi} className="flex items-center gap-1">
            {gi > 0 && <div className="mx-1 h-4 w-px bg-border" />}
            {g.map((b) => (
              <button key={b.i} type="button" title={b.t} aria-label={b.t} disabled={!canEdit} className="flex h-7 w-7 items-center justify-center rounded text-text-secondary transition-colors hover:bg-surface hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50">
                <Icon name={b.i} size={18} />
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-surface-variant px-2.5 py-1 font-caption text-caption text-[11px] text-text-secondary">
          <span className={canEdit ? 'h-2 w-2 animate-pulse rounded-full bg-status-success' : 'h-2 w-2 rounded-full bg-priority-low'} />
          <span>{canEdit ? `Tự động lưu lúc ${savedAt}` : 'Chỉ xem (Viewer)'}</span>
        </div>
        <Button variant="outline" size="md" icon="share" className="bg-surface shadow-sm">Chia sẻ</Button>
      </div>
    </div>
  )
}
