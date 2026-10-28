import { useState } from 'react'
import { useShell } from '../../components/layout'
import { Button, Icon } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'

/** Ô hỏi một dòng. Gửi câu hỏi sang panel Trợ lý (lối vào chính của Trợ lý là nút ở thanh trên). */
export function QuickAsk() {
  const { aiStatus } = useWorkspace()
  const { askAssistant } = useShell()
  const offline = aiStatus === 'offline'
  const [value, setValue] = useState('')
  const submit = () => {
    if (!value.trim() || offline) return
    askAssistant(value.trim())
    setValue('')
  }
  return (
    <div className="flex items-center gap-2 rounded-xl border border-ai-accent/30 bg-surface pl-3.5 pr-1.5 shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-brand">
      <Icon name="auto_awesome" size={20} className="shrink-0 text-ai-accent" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        disabled={offline}
        aria-label="Hỏi Trợ lý"
        placeholder={offline ? 'Trợ lý AI đang tạm ngưng. Bạn vẫn xem được dữ liệu hiện có.' : 'Hỏi Trợ lý về tiến độ, tài liệu hoặc việc tồn đọng...'}
        className="h-11 min-w-0 flex-1 bg-transparent font-body-default text-body-default text-text-primary outline-none placeholder:text-text-secondary disabled:cursor-not-allowed"
      />
      <Button variant="ai-solid" iconRight="send" onClick={submit} lockedReason={offline ? 'Trợ lý AI đang tạm ngưng' : undefined}>
        Hỏi
      </Button>
    </div>
  )
}
