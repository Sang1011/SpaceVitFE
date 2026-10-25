import { useState } from 'react'
import { Icon } from '../../components/ui'
import { cn } from '../../lib/cn'
import { folders, notesList, tags } from '../../mocks/notes'

export function NotesSidebar({ activeId, onSelect, onCreate, canEdit }: { activeId: string; onSelect: (id: string) => void; onCreate: () => void; canEdit: boolean }) {
  const [open, setOpen] = useState<string>('meet')
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const match = (t: string) => !needle || t.toLowerCase().includes(needle)

  return (
    <aside className="flex w-[240px] shrink-0 flex-col justify-between overflow-hidden bg-surface shadow-sm">
      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex items-center justify-between">
          <span className="font-section-title text-section-title text-[14px] text-text-primary">Ghi chú Space</span>
          <button type="button" title={canEdit ? 'Tạo ghi chú mới' : 'Bạn chỉ có quyền xem'} aria-label="Tạo ghi chú mới" disabled={!canEdit} onClick={onCreate} className="flex h-6 w-6 items-center justify-center rounded bg-surface-variant text-text-secondary transition-colors hover:bg-surface-container hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50">
            <Icon name="post_add" size={16} />
          </button>
        </div>
        <div className="relative flex items-center">
          <Icon name="search" size={16} className="absolute left-2.5 text-text-secondary" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kiếm ghi chú..." className="h-8 w-full rounded bg-surface-variant pl-8 pr-2.5 font-body-default text-body-default text-[12px] text-text-primary transition-all placeholder:text-text-secondary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand" />
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-2">
        <div className="space-y-0.5">
          <p className="px-2 py-1 font-caption text-caption text-[10px] uppercase tracking-wider text-text-secondary">Cây thư mục</p>
          {folders.map((f) => {
            const isOpen = open === f.id
            const items = notesList.filter((n) => n.folder === f.id && match(n.title))
            return (
              <div key={f.id} className="space-y-0.5">
                <button type="button" onClick={() => setOpen(isOpen ? '' : f.id)} className={cn('flex w-full items-center justify-between rounded px-2 py-1.5 transition-colors', isOpen ? 'bg-surface-variant/60 text-text-primary' : 'text-text-secondary hover:bg-surface-variant hover:text-text-primary')}>
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Icon name={isOpen ? 'folder_open' : 'folder'} size={16} className={isOpen ? 'text-brand' : 'text-text-secondary'} />
                    <span className={cn('truncate font-body-medium text-body-medium text-[13px]', isOpen && 'font-semibold')}>{f.name}</span>
                  </span>
                  {isOpen ? <Icon name="expand_more" size={16} className="text-[14px] text-text-secondary" /> : <span className="font-label-mono text-label-mono text-[11px] opacity-70">{f.count}</span>}
                </button>
                {isOpen && (
                  <div className="space-y-0.5 pl-3 pt-0.5">
                    {items.length === 0 && <p className="px-2 py-1 font-caption text-caption text-[11px] text-text-secondary">Không có ghi chú.</p>}
                    {items.map((n) => {
                      const active = n.id === activeId
                      return (
                        <button key={n.id} type="button" onClick={() => onSelect(n.id)} aria-current={active ? 'true' : undefined} className={cn('relative w-full rounded-lg p-2 text-left transition-all', active ? 'bg-surface-container' : 'text-text-secondary hover:bg-surface-variant hover:text-text-primary')}>
                          {active && <span className="absolute bottom-1.5 left-0 top-1.5 w-1 rounded-r-full bg-primary-container" />}
                          <span className="flex items-start gap-1.5 pl-1.5">
                            <Icon name="description" size={16} className={cn('mt-0.5 shrink-0', active ? 'text-brand' : 'text-text-secondary')} />
                            <span className="min-w-0 flex-1">
                              <span className={cn('block truncate', active ? 'font-body-medium text-body-medium text-[12.5px] font-semibold leading-tight text-text-primary' : 'font-body-default text-body-default text-[12px]')}>{n.title}</span>
                              <span className={cn('block font-caption text-caption text-text-secondary', active ? 'mt-0.5 text-[11px]' : 'text-[10px]')}>{n.when}</span>
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="pt-2">
          <p className="px-2 py-1 font-caption text-caption text-[10px] uppercase tracking-wider text-text-secondary">Nhãn phân loại</p>
          <div className="mt-1 flex flex-wrap gap-1 px-1.5">
            {tags.map((t) => (
              <span key={t.label} className={cn('rounded-full px-2 py-0.5 font-caption text-caption text-[11px]', t.ai ? 'bg-ai-container text-ai-accent' : 'bg-surface-variant text-text-secondary')}>{t.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-surface-variant/40 p-3">
        <div className="flex items-center gap-2"><Icon name="cloud_done" size={18} className="text-status-success-text" /><span className="font-caption text-caption text-[11px] text-text-secondary">Đã đồng bộ cục bộ</span></div>
        <span className="font-label-mono text-label-mono text-[10px] text-text-secondary">v2.1</span>
      </div>
    </aside>
  )
}
