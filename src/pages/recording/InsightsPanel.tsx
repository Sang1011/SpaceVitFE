import { forwardRef, useState } from 'react'
import { AiContainer, BulkActionsBar, GhostTaskCard } from '../../components/domain'
import { Icon, Tabs } from '../../components/ui'
import { insightTabs, summaryText, type RecGhost } from '../../mocks/recording'

export interface InsightsPanelProps {
  ghosts: RecGhost[]
  onToggle: (id: string, v: boolean) => void
  onConfirm: (ids: string[]) => void
  onDismiss: (ids: string[]) => void
  lockedReason?: string
}

export const InsightsPanel = forwardRef<HTMLDivElement, InsightsPanelProps>(function InsightsPanel({ ghosts, onToggle, onConfirm, onDismiss, lockedReason }, ref) {
  const [tab, setTab] = useState('actions')
  const selected = ghosts.filter((g) => g.checked)
  return (
    <div ref={ref} className="flex flex-col gap-space-md">
      <Tabs items={insightTabs} value={tab} onChange={setTab} />
      {tab === 'actions' ? (
        <div className="flex flex-col gap-space-md">
          <AiContainer size="sm" className="pl-space-lg">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-card-title text-card-title text-ai-accent">
                  <span className="text-[16px]">✦</span>
                  <span>Gợi ý từ AI: {ghosts.length + 1} công việc trích xuất được</span>
                </div>
                <p className="font-caption text-caption text-text-secondary">
                  Các mục công việc được AI tự động nhận diện từ hội thoại. Kiểm tra thông tin trước khi chuyển thành task chính thức.
                </p>
              </div>
              <button type="button" aria-label="Chọn nhiều" className="p-1 text-ai-accent hover:opacity-80">
                <Icon name="auto_awesome_motion" size={18} />
              </button>
            </div>
          </AiContainer>
          <div className="space-y-space-md">
            {ghosts.map((g) => (
              <GhostTaskCard
                key={g.id}
                density="detailed"
                title={g.title}
                priority={g.priority}
                assignee={g.assignee}
                date={g.date}
                source={{ kind: 'audio', location: g.sourceAt }}
                selected={g.checked}
                onSelectedChange={(v) => onToggle(g.id, v)}
                onConfirm={() => onConfirm([g.id])}
                onDismiss={() => onDismiss([g.id])}
                lockedReason={lockedReason}
              />
            ))}
            {ghosts.length === 0 && <p className="rounded-xl bg-surface p-space-md text-center font-body-default text-body-default text-text-secondary shadow-sm">Không còn gợi ý nào cần duyệt.</p>}
          </div>
          {ghosts.length > 0 && (
            <BulkActionsBar
              selected={selected.length}
              total={ghosts.length}
              onDismissAll={() => onDismiss(ghosts.map((g) => g.id))}
              onConfirmAll={() => onConfirm(selected.map((g) => g.id))}
              lockedReason={lockedReason}
            />
          )}
        </div>
      ) : (
        <ul className="space-y-space-sm rounded-xl bg-surface p-space-lg shadow-sm">
          {summaryText[tab as keyof typeof summaryText].map((t) => (
            <li key={t} className="flex gap-2 font-body-default text-body-default text-text-primary">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})
