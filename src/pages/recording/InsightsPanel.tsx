import { forwardRef } from 'react'
import { AiSuggestionCard, type SuggestionPatch } from '../../components/domain'
import { Button, Checkbox, Icon, Tabs } from '../../components/ui'
import { formatDuration } from '../../lib/format'
import { insightTabs, summaryText, type RecGhost, type RecStatus } from '../../mocks/recording'

export interface InsightsPanelProps {
  status: RecStatus
  tab: string
  onTabChange: (key: string) => void
  ghosts: RecGhost[]
  members: string[]
  onToggle: (id: string, v: boolean) => void
  onToggleAll: (v: boolean) => void
  onChange: (id: string, patch: SuggestionPatch) => void
  onConfirm: (ids: string[]) => void
  onDismiss: (ids: string[]) => void
  onJump: (sec: number) => void
  /** Viewer: chỉ xem. */
  readOnly?: boolean
  lockedReason?: string
}

/** Phần AI chưa có kết quả (đang xử lý hoặc lỗi hẳn). */
function Pending({ status }: { status: RecStatus }) {
  return (
    <p className="rounded-xl bg-surface p-space-lg text-center font-body-default text-body-default text-text-secondary shadow-sm">
      {status === 'failed' ? 'Chưa có tóm tắt và việc đề xuất vì xử lý không thành công.' : 'Tóm tắt và việc đề xuất sẽ có sau khi chép lời xong.'}
    </p>
  )
}

export const InsightsPanel = forwardRef<HTMLDivElement, InsightsPanelProps>(function InsightsPanel(
  { status, tab, onTabChange, ghosts, members, onToggle, onToggleAll, onChange, onConfirm, onDismiss, onJump, readOnly, lockedReason },
  ref,
) {
  const selected = ghosts.filter((g) => g.checked)
  const allChecked = ghosts.length > 0 && selected.length === ghosts.length
  const ready = status === 'completed' || status === 'partial_failed'
  const items = insightTabs.map((t) => (t.key === 'actions' && ready && ghosts.length > 0 ? { ...t, badge: String(ghosts.length) } : t))

  return (
    <div ref={ref} className="flex flex-col gap-space-md">
      <Tabs items={items} value={tab} onChange={onTabChange} />
      {!ready ? (
        <Pending status={status} />
      ) : tab === 'actions' ? (
        <div className="flex flex-col gap-space-md">
          <p className="px-1 font-caption text-caption text-text-secondary">
            AI đề xuất {ghosts.length} việc từ cuộc họp. Kiểm tra rồi tick những việc muốn tạo.
          </p>
          <div className="space-y-space-md">
            {ghosts.map((g) => (
              <AiSuggestionCard
                key={g.id}
                title={g.title}
                priority={g.priority}
                assignee={g.assignee}
                due={g.due}
                inferred={g.inferred}
                source={{ kind: 'audio', location: g.sourceAt }}
                onSourceClick={() => onJump(Number(g.sourceAt.split(':')[0]) * 60 + Number(g.sourceAt.split(':')[1]))}
                members={members}
                selected={g.checked}
                onSelectedChange={(v) => onToggle(g.id, v)}
                onChange={(p) => onChange(g.id, p)}
                readOnly={readOnly}
              />
            ))}
            {ghosts.length === 0 && (
              <p className="rounded-xl bg-surface p-space-lg text-center font-body-default text-body-default text-text-secondary shadow-sm">Không còn việc đề xuất nào cần duyệt.</p>
            )}
          </div>
          {ghosts.length > 0 && (
            <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-x-space-md gap-y-space-sm rounded-xl bg-surface p-space-md shadow-lg">
              <Checkbox
                tone="ai"
                checked={allChecked}
                disabled={readOnly}
                onChange={(e) => onToggleAll(e.target.checked)}
                label={selected.length > 0 ? `Đã chọn ${selected.length} trên ${ghosts.length}` : 'Chọn tất cả'}
              />
              <div className="flex items-center gap-space-sm">
                <Button variant="ghost" size="md" disabled={selected.length === 0} onClick={() => onDismiss(selected.map((g) => g.id))} lockedReason={lockedReason} className="hover:text-status-error-text">
                  Bỏ qua đã chọn
                </Button>
                <Button size="md" icon="add_task" disabled={selected.length === 0} onClick={() => onConfirm(selected.map((g) => g.id))} lockedReason={lockedReason}>
                  Tạo {selected.length || ''} việc
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ul className="space-y-space-sm rounded-xl bg-surface p-space-lg shadow-sm">
          {summaryText[tab as keyof typeof summaryText]?.map((l) => (
            <li key={l.text} className="flex items-start gap-2 font-body-default text-body-default text-text-primary">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              <span className="flex-1">{l.text}</span>
              <button
                type="button"
                onClick={() => onJump(l.at)}
                aria-label={`Nghe lại đoạn ${formatDuration(l.at)}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-surface-variant px-2 py-0.5 font-caption text-caption tabular-nums text-text-secondary outline-none transition-colors hover:bg-primary-container hover:text-on-primary focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Icon name="play_circle" size={13} />
                {formatDuration(l.at)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})
