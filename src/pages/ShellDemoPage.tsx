import { useState } from 'react'
import { Drawer, FilterBar, PageHeader, type BoardView } from '../components/layout'
import { Badge, Button, IconButton } from '../components/ui'
import { useWorkspace } from '../context/WorkspaceContext'

/** Dev page: shows PageHeader + FilterBar + Drawer inside the shell (compare with the Stitch W8 screen). */
export default function ShellDemoPage() {
  const { canEdit, role, setRole, aiStatus, setAiStatus } = useWorkspace()
  const [view, setView] = useState<BoardView>('kanban')
  const [mine, setMine] = useState(true)
  const lock = canEdit ? undefined : 'Bạn chỉ có quyền xem'
  return (
    <>
      <PageHeader
        icon="view_kanban"
        title="Sprint 41 - Q4 Feature Delivery"
        chevron
        meta={{ text: '15 công việc đang theo dõi' }}
        actions={
          <>
            <Button variant="outline" size="md" className="bg-surface shadow-sm" icon="view_column" lockedReason={lock}>
              + Thêm cột
            </Button>
            <Button size="md" icon="add_task" lockedReason={lock}>
              + Tạo task mới
            </Button>
          </>
        }
      >
        <FilterBar mineOnly={mine} onMineOnlyChange={setMine} view={view} onViewChange={setView} />
      </PageHeader>

      <div className="flex gap-space-sm pb-space-md">
        <Button variant="subtle" size="xs" onClick={() => setRole(role === 'viewer' ? 'owner' : 'viewer')}>
          Demo: đổi quyền (đang {role})
        </Button>
        <Button variant="subtle" size="xs" onClick={() => setAiStatus(aiStatus === 'online' ? 'offline' : 'online')}>
          Demo: AI {aiStatus}
        </Button>
      </div>

      <div className="relative min-h-[620px] w-full">
        <Drawer
          header={
            <>
              <div className="flex items-center gap-2">
                <Badge tone="primary" size="md" dot>Đang thực hiện</Badge>
                <span className="font-label-mono text-label-mono text-[11px] text-text-secondary">TASK-841</span>
              </div>
              <div className="flex items-center gap-1">
                <IconButton icon="share" label="Chia sẻ liên kết" variant="soft" />
                <IconButton icon="close" label="Đóng" variant="soft" />
              </div>
            </>
          }
          footer={
            <>
              <Button variant="ghost" icon="delete" className="text-error hover:bg-error-container hover:text-error" lockedReason={lock}>Xóa task</Button>
              <div className="flex gap-space-sm">
                <Button variant="outline" size="lg">Đóng</Button>
                <Button size="lg" icon="check" lockedReason={lock}>Lưu thay đổi</Button>
              </div>
            </>
          }
        >
          <h2 className="font-display-title text-display-title text-[22px] leading-tight text-text-primary">
            Hoàn thiện luồng xác nhận ghost task từ transcript ghi âm
          </h2>
          <p className="font-caption text-caption text-text-secondary">Nội dung drawer demo (Phase 4 sẽ dựng TaskDrawer thật).</p>
        </Drawer>
      </div>
    </>
  )
}
