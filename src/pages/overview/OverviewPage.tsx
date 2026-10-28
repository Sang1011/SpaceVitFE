import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiContainer, GhostTaskCard, TaskListItem } from '../../components/domain'
import { Button, Icon, useToast } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { myTasks, myTasksTotal, overviewGhostTasks, recentItems } from '../../mocks/overview'
import { OverviewHeader } from './OverviewHeader'
import { QuickAsk } from './QuickAsk'
import { ActivityTimeline, RecentRow, SectionCard } from './Sections'

/** Số việc hiện ở khối "Việc của tôi"; tổng số việc đang mở là `myTasksTotal`. */
const MY_TASKS_SHOWN = 5
/** Số việc đề xuất hiện sẵn; phần còn lại nằm sau "Xem thêm". */
const GHOSTS_SHOWN = 2

type Ghost = (typeof overviewGhostTasks)[number]

export default function OverviewPage() {
  const { space, user, canEdit } = useWorkspace()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [ghosts, setGhosts] = useState<Ghost[]>(overviewGhostTasks)
  const [showAllGhosts, setShowAllGhosts] = useState(false)
  const [done, setDone] = useState<Record<string, boolean>>({})
  const lockedReason = canEdit ? undefined : 'Bạn chỉ có quyền xem'

  // Chỉ việc giao cho mình (OV-1).
  const mine = myTasks.filter((t) => t.assignee.initials === user.initials).slice(0, MY_TASKS_SHOWN)
  const shownGhosts = showAllGhosts ? ghosts : ghosts.slice(0, GHOSTS_SHOWN)
  const hiddenGhosts = ghosts.length - shownGhosts.length
  // Đang chạy trước, rồi 2 mục xong mới nhất.
  const processing = [...recentItems.filter((r) => r.kind === 'processing'), ...recentItems.filter((r) => r.kind === 'done').slice(0, 2)]

  const restoreGhost = (g: Ghost, index: number) => setGhosts((cur) => [...cur.slice(0, index), g, ...cur.slice(index)])
  const resolveGhost = (g: Ghost, message: string) => {
    const index = ghosts.findIndex((x) => x.id === g.id)
    setGhosts((cur) => cur.filter((x) => x.id !== g.id))
    toast({ message, action: { label: 'Hoàn tác', onClick: () => restoreGhost(g, index) } })
  }

  return (
    <div className="space-y-space-lg">
      <OverviewHeader spaceName={space.name} />
      <QuickAsk />

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <div className="space-y-space-lg lg:col-span-7">
          <SectionCard
            icon="task_alt"
            iconTone="brand"
            title="Việc của tôi"
            subtitle={`${mine.length} việc gấp nhất trong ${myTasksTotal} việc đang mở`}
            action={
              <Button variant="subtle" size="xs" onClick={() => navigate('/cong-viec-cua-toi')}>
                Xem tất cả ({myTasksTotal})
              </Button>
            }
          >
            <div className="space-y-2">
              {mine.map((t) => (
                <TaskListItem key={t.id} {...t} density="compact" checked={!!done[t.id]} onCheckedChange={(v) => setDone({ ...done, [t.id]: v })} disabled={!canEdit} />
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-5">
          <AiContainer className="space-y-space-md">
            <div className="flex items-center gap-2">
              <Icon name="auto_awesome" size={20} className="text-ai-accent" />
              <h2 className="font-section-title text-section-title text-text-primary">Việc đề xuất chờ bạn duyệt ({ghosts.length})</h2>
            </div>
            <p className="font-caption text-caption text-text-secondary">AI đề xuất từ các cuộc họp gần đây. Chỉ thành việc chính thức khi bạn bấm Tạo việc.</p>
            {ghosts.length === 0 && <p className="rounded-xl bg-surface/80 p-3 font-body-default text-body-default text-text-secondary">Không có gợi ý nào cần duyệt.</p>}
            {shownGhosts.map((g) => (
              <GhostTaskCard
                key={g.id}
                title={g.title}
                source={g.source}
                note={g.note}
                onConfirm={() => resolveGhost(g, 'Đã tạo 1 việc từ gợi ý')}
                onDismiss={() => resolveGhost(g, 'Đã bỏ qua 1 gợi ý')}
                lockedReason={lockedReason}
              />
            ))}
            {hiddenGhosts > 0 && (
              <button
                type="button"
                onClick={() => setShowAllGhosts(true)}
                className="w-full rounded-lg py-1.5 text-center font-body-medium text-body-medium text-[13px] text-ai-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand"
              >
                Xem thêm {hiddenGhosts} gợi ý
              </button>
            )}
          </AiContainer>
        </div>
      </div>

      <SectionCard
        icon="sync"
        title="Đang xử lý"
        subtitle="Ghi âm và tài liệu gần đây"
        action={
          <Button variant="subtle" size="xs" onClick={() => navigate('/ghi-am')}>
            Xem tất cả
          </Button>
        }
      >
        <div className="space-y-2">
          {processing.map((r) => (
            <RecentRow key={r.id} item={r} />
          ))}
        </div>
      </SectionCard>

      <ActivityTimeline />
    </div>
  )
}
