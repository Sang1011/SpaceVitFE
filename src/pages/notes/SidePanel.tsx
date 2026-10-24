import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Avatar, Badge, Icon, PriorityDot } from '../../components/ui'
import { sidePanel as d } from '../../mocks/notes'

function Block({ title, count, children }: { title: string; count?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-caption text-caption text-[10px] uppercase tracking-wider text-text-secondary">{title}</p>
        {count}
      </div>
      {children}
    </div>
  )
}

export function SidePanel({ noteTitle }: { noteTitle: string }) {
  const navigate = useNavigate()
  return (
    <aside className="flex w-[260px] shrink-0 flex-col justify-between overflow-y-auto bg-surface shadow-sm">
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-section-title text-section-title text-[14px] text-text-primary"><Icon name="link" size={18} className="text-brand" /><span>Liên kết &amp; Nguồn</span></span>
          <button type="button" title="Tùy chọn" aria-label="Tùy chọn" className="rounded p-1 text-text-secondary hover:text-text-primary"><Icon name="more_horiz" size={16} /></button>
        </div>

        <Block title="Nguồn gốc ghi âm">
          <div className="group cursor-pointer rounded-xl bg-surface-variant p-3 transition-all hover:bg-surface-container">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 font-caption text-caption text-[11px] font-medium text-text-primary"><Icon name="mic" size={13} className="text-recording-red" />{d.origin.chip}</span>
              <span className="font-label-mono text-label-mono text-[11px] text-text-secondary">{d.origin.time}</span>
            </div>
            <p className="mt-2 line-clamp-1 font-card-title text-card-title text-[13px] text-text-primary transition-colors group-hover:text-brand">{d.origin.title}</p>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-full bg-surface px-2 py-1 font-label-mono text-[11px] text-text-primary shadow-xs"><span className="text-[10px] text-recording-red">●</span>{d.origin.cite}</span>
              <Icon name="arrow_forward" size={16} className="text-text-secondary transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </Block>

        <Block title="Tài liệu liên quan (Backlinks)" count={<span className="font-label-mono text-label-mono text-[11px] text-text-secondary">{d.backlinks.length}</span>}>
          <div className="space-y-1.5">
            {d.backlinks.map((b) => (
              <div key={b.id} className="group cursor-pointer rounded-lg bg-surface-variant/70 p-2.5 transition-colors hover:bg-surface-variant">
                <div className="flex items-start gap-2">
                  <Icon name="description" size={16} className="mt-0.5 text-text-secondary group-hover:text-brand" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-body-medium text-body-medium text-[12px] font-medium text-text-primary">{b.title}</p>
                    <p className="font-caption text-caption text-[10px] text-text-secondary">{b.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Task đã gắn kết" count={<Badge tone="primary" shape="circle" size="xs" mono className="h-4 w-4">1</Badge>}>
          <div className="flex flex-col gap-1.5 rounded-lg bg-surface-variant/50 p-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 rounded-full bg-priority-high/10 px-2 py-0.5 font-caption text-caption text-[10px] font-semibold text-priority-high"><PriorityDot level="high" size="sm" /> High</span>
              <span className="font-label-mono text-label-mono text-[10px] text-text-secondary">{d.task.code}</span>
            </div>
            <p className="line-clamp-2 font-body-medium text-body-medium text-[12px] font-medium text-text-primary">{d.task.title}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="font-caption text-caption text-[11px] text-text-secondary">{d.task.due}</span>
              <Avatar initials={d.task.assignee} size={5} tone="ai" />
            </div>
          </div>
        </Block>

        <Block title="Tệp đính kèm">
          {d.files.map((f) => (
            <div key={f.id} className="flex cursor-pointer items-center justify-between rounded-lg bg-surface-variant/40 p-2 transition-colors hover:bg-surface-variant">
              <div className="flex min-w-0 items-center gap-2"><Icon name="attachment" size={16} className="text-text-secondary" /><span className="truncate font-body-default text-body-default text-[12px] text-text-primary">{f.name}</span></div>
              <span className="shrink-0 font-label-mono text-label-mono text-[10px] text-text-secondary">{f.size}</span>
            </div>
          ))}
        </Block>
      </div>
      <div className="bg-ai-container/60 p-3">
        <button type="button" onClick={() => navigate(`/tro-ly-ai?q=${encodeURIComponent(`Tóm tắt ghi chú "${noteTitle}"`)}`)} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-surface px-3 py-2 font-body-medium text-body-medium text-[12px] font-semibold text-ai-accent shadow-xs transition-colors hover:bg-surface-bright">
          <span>✦</span> Hỏi Trợ lý về ghi chú này
        </button>
      </div>
    </aside>
  )
}
