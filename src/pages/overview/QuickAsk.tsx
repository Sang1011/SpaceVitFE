import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiContainer, PromptChip } from '../../components/domain'
import { Button, Icon } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { quickPrompts } from '../../mocks/overview'

export function QuickAsk({ spaceName }: { spaceName: string }) {
  const { aiStatus } = useWorkspace()
  const offline = aiStatus === 'offline'
  const [value, setValue] = useState('')
  const navigate = useNavigate()
  const submit = () => {
    if (!value.trim() || offline) return
    navigate(`/tro-ly-ai?q=${encodeURIComponent(value.trim())}`)
  }
  return (
    <AiContainer title={`✦ Hỏi Trợ lý không gian ${spaceName}`} badge="RAG CSDL nội bộ" hint="Phạm vi: Toàn bộ ghi chú, tài liệu PDF và 14 bản ghi họp">
      <div className="relative flex items-center rounded-xl bg-surface shadow-sm transition-shadow focus-within:shadow-md">
        <Icon name="psychology" size={24} className="ml-3.5 text-[22px] text-ai-accent" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          disabled={offline}
          placeholder={offline ? 'Trợ lý AI đang tạm ngưng. Bạn vẫn xem được dữ liệu hiện có.' : 'Hỏi bất kỳ điều gì về tiến độ, tài liệu họp hoặc việc tồn đọng...'}
          className="h-12 w-full bg-transparent pl-3 pr-32 font-body-default text-body-default text-text-primary placeholder:text-text-secondary focus:outline-none disabled:cursor-not-allowed"
        />
        <Button variant="ai-solid" iconRight="send" className="absolute right-1.5 h-9 px-4" onClick={submit} lockedReason={offline ? 'Trợ lý AI đang tạm ngưng' : undefined}>
          Hỏi ngay
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-caption text-caption text-text-secondary">Gợi ý câu hỏi:</span>
        {quickPrompts.map((p) => (
          <PromptChip key={p} tone="translucent" sparkle onPick={() => setValue(p)}>
            {p}
          </PromptChip>
        ))}
      </div>
    </AiContainer>
  )
}
