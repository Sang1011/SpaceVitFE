import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiContainer, GhostTaskCard, TaskListItem } from '../../components/domain'
import { Icon } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { myTasks, myTasksTotal, overviewGhostTasks, recentItems } from '../../mocks/overview'
import { CaptureCard, OverviewHeader } from './OverviewHeader'
import { QuickAsk } from './QuickAsk'
import { ActivityTimeline, RecentRow, SectionCard } from './Sections'

const roleLabel = { owner: 'Chủ sở hữu', editor: 'Biên tập viên', viewer: 'Chỉ xem' } as const

export default function OverviewPage() {
  const { space, role, canEdit } = useWorkspace()
  const navigate = useNavigate()
  const [ghosts, setGhosts] = useState(overviewGhostTasks)
  const [done, setDone] = useState<Record<string, boolean>>({})
  const lockedReason = canEdit ? undefined : 'Bạn chỉ có quyền xem'
  const dropGhost = (id: string) => setGhosts((g) => g.filter((x) => x.id !== id))

  return (
    <div className="space-y-space-lg">
      <OverviewHeader spaceName={space.name} roleLabel={roleLabel[role]} pending={ghosts.length + 1} />

      <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
        <CaptureCard icon="mic" tone="red" title="Tải lên & Xử lý ghi âm" description="Tự động bóc băng STT & trích xuất việc cần làm" tag="✦ AI Whisper Active" tagTone="ai" onClick={() => navigate('/ghi-am')} lockedReason={lockedReason} />
        <CaptureCard icon="document_scanner" tone="brand" title="Tải lên tài liệu OCR" description="Quét PDF, hợp đồng, biên bản họp song ngữ" tag="PDF, PNG, DOCX" tagTone="brand" onClick={() => navigate('/tai-lieu')} lockedReason={lockedReason} />
        <CaptureCard icon="edit_note" tone="green" title="Ghi chú nhanh mới" description="Mở trình soạn thảo tài liệu kèm gợi ý trực tiếp" tag="Phím tắt: N" tagTone="neutral" onClick={() => navigate('/ghi-chu')} lockedReason={lockedReason} />
      </div>

      <QuickAsk spaceName={space.name} />

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <div className="space-y-space-lg lg:col-span-7">
          <SectionCard
            icon="task_alt"
            iconTone="brand"
            title="Việc của tôi hôm nay & Quá hạn"
            subtitle="4 nhiệm vụ ưu tiên đang chờ xử lý"
            action={<button type="button" onClick={() => navigate('/cong-viec-cua-toi')} className="rounded-lg bg-surface-variant px-2.5 py-1 font-body-medium text-body-medium text-[12px] text-text-secondary hover:text-text-primary">Xem tất cả ({myTasksTotal})</button>}
          >
            {myTasks.map((t) => (
              <TaskListItem key={t.id} {...t} checked={!!done[t.id]} onCheckedChange={(v) => setDone({ ...done, [t.id]: v })} disabled={!canEdit} />
            ))}
          </SectionCard>

          <SectionCard
            icon="inventory_2"
            title="Bản ghi âm & Tài liệu gần đây"
            subtitle="Trạng thái xử lý theo thời gian thực"
            action={<a href="#" className="font-body-medium text-body-medium text-[12px] text-brand hover:underline">Quản lý kho lưu trữ</a>}
          >
            <div className="space-y-3">
              {recentItems.map((r) => <RecentRow key={r.id} item={r} />)}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-space-lg lg:col-span-5">
          <AiContainer className="space-y-space-md">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon name="auto_awesome" size={20} className="text-ai-accent" />
                <h2 className="font-card-title text-card-title text-text-primary">Gợi ý từ AI chờ bạn xác nhận ({ghosts.length + 1})</h2>
              </div>
              <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 font-caption text-caption text-[11px] font-semibold text-ai-accent shadow-xs">Cần duyệt</span>
            </div>
            <p className="font-caption text-caption text-[12px] text-text-secondary">
              Hệ thống đã nhận diện hành động từ các cuộc họp gần nhất. Hãy xác nhận để đưa vào Bảng công việc chính thức.
            </p>
            {ghosts.map((g) => (
              <GhostTaskCard key={g.id} title={g.title} source={g.source} note={g.note} onConfirm={() => dropGhost(g.id)} onDismiss={() => dropGhost(g.id)} lockedReason={lockedReason} />
            ))}
            {ghosts.length > 0 && (
              <div className="pt-1 text-center">
                <button type="button" disabled={!canEdit} onClick={() => setGhosts([])} className="inline-flex items-center gap-1 font-body-medium text-body-medium text-[12px] text-ai-accent hover:underline disabled:cursor-not-allowed disabled:opacity-60">
                  <span>✦ Xác nhận tất cả gợi ý còn lại</span>
                  <Icon name="checklist_rtl" size={16} className="text-[14px]" />
                </button>
              </div>
            )}
          </AiContainer>
          <ActivityTimeline />
        </div>
      </div>
    </div>
  )
}
