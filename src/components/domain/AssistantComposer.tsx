import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { useWorkspace } from '../../context/WorkspaceContext'
import { Button, Icon, IconButton } from '../ui'
import { PromptChip } from './PromptChip'

export interface AssistantComposerProps {
  prompts?: string[]
  value: string
  onChange: (v: string) => void
  onSubmit: (v: string) => void
  placeholder?: string
  /** Footer note about the data scope. */
  scopeNote?: ReactNode
  className?: string
}

/** Sticky chat dock of the assistant page: suggestion chips + textarea + attach/voice + send. */
export function AssistantComposer({ prompts = [], value, onChange, onSubmit, placeholder, scopeNote, className }: AssistantComposerProps) {
  const { aiStatus, space } = useWorkspace()
  const offline = aiStatus === 'offline'
  return (
    <div className={cn('sticky bottom-0 z-30 space-y-2 bg-background pb-4 pt-2', className)}>
      <div className="space-y-3 rounded-2xl bg-surface p-4 shadow-xl">
        {prompts.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-text-primary">
            <span className="flex shrink-0 items-center gap-1 font-caption text-caption text-text-secondary">
              <Icon name="tips_and_updates" size={16} className="text-[15px]" />
              Gợi ý:
            </span>
            {prompts.map((p) => (
              <PromptChip key={p} onPick={() => onChange(p)}>
                {p}
              </PromptChip>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2 rounded-xl bg-surface-variant p-2.5 transition-all focus-within:bg-surface focus-within:ring-2 focus-within:ring-brand">
          <textarea
            rows={2}
            value={value}
            disabled={offline}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
                e.preventDefault()
                onSubmit(value)
              }
            }}
            placeholder={offline ? 'Trợ lý AI tạm thời không khả dụng' : placeholder ?? `Hỏi bất kỳ điều gì về ghi chú, cuộc họp hoặc tài liệu trong Space ${space.name}...`}
            className="w-full resize-none border-0 bg-transparent px-2 font-body-default text-body-default text-text-primary placeholder:text-text-secondary focus:outline-none disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-text-secondary">
              <IconButton icon="attach_file" label="Đính kèm tài liệu phân tích" variant="soft" iconSize={20} className="h-8 w-8 p-0" />
              <IconButton icon="mic" label="Hỏi bằng giọng nói" variant="soft" iconSize={20} className="h-8 w-8 p-0 hover:text-recording-red" />
              <div className="mx-1 h-4 w-px bg-border" />
              <div className="flex items-center gap-1 rounded-md bg-ai-container px-2 py-0.5 font-caption text-caption text-ai-accent">
                <span>✦</span>
                <span className="text-[11px] font-medium">RAG + Live Sync</span>
              </div>
            </div>
            <Button size="md" iconRight="send" className="font-semibold" disabled={offline || !value.trim()} onClick={() => onSubmit(value)}>
              Gửi yêu cầu
            </Button>
          </div>
        </div>
      </div>
      {scopeNote && (
        <div className="flex items-center justify-between px-1 font-caption text-caption text-text-secondary">
          <div className="flex items-center gap-1 text-[11px]">
            <Icon name="verified_user" size={16} className="text-[14px] text-status-success" />
            <span>{scopeNote}</span>
          </div>
          <span className="hidden font-label-mono text-[10px] text-text-secondary sm:inline">Nhấn Enter để gửi, Shift + Enter để xuống dòng</span>
        </div>
      )}
    </div>
  )
}
