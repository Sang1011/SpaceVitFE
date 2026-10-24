import { useState, type ReactNode } from 'react'
import {
  AiContainer, AssistantComposer, BulkActionsBar, EmptyState, GhostTaskCard, OnboardingChecklist,
  ProcessingStepper, PromptChip, SourceChip, TaskListItem, defaultSteps, type StepperStep,
} from '../components/domain'
import { Button, Icon } from '../components/ui'
import { useTheme } from '../theme/ThemeProvider'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-space-sm">
      <h3 className="font-card-title text-card-title text-text-primary">{title}</h3>
      <div className="space-y-space-sm">{children}</div>
    </section>
  )
}

function withStatus(statuses: StepperStep['status'][], details: (string | undefined)[] = []): StepperStep[] {
  return defaultSteps.map((s, i) => ({ ...s, status: statuses[i], detail: details[i] }))
}

function DomainContent() {
  const [selected, setSelected] = useState([true, true, false])
  const [prompt, setPrompt] = useState('')
  const [done, setDone] = useState(false)
  const count = selected.filter(Boolean).length
  return (
    <div className="space-y-space-lg">
      <Section title="AiContainer (lg / md / sm, với và không có tiêu đề)">
        <AiContainer title="AI đề xuất 3 việc cần làm" badge="Chờ xác nhận" hint="Từ Họp sprint 12">
          <p className="font-body-default text-body-default text-text-primary">Nội dung do AI tạo ra luôn nằm trong khung tím có vạch bên trái.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <PromptChip tone="translucent" sparkle>Task nào đang quá hạn?</PromptChip>
            <PromptChip tone="translucent" sparkle>Tóm tắt cuộc họp hôm qua</PromptChip>
          </div>
        </AiContainer>
        <AiContainer size="md" title="Tổng hợp từ tri thức nội bộ">
          <p className="font-body-default text-body-default text-text-primary">Size md (khung diff / RAG).</p>
        </AiContainer>
        <AiContainer size="sm">
          <p className="font-body-default text-body-default text-text-primary">Size sm, không tiêu đề.</p>
        </AiContainer>
      </Section>

      <Section title="SourceChip">
        <div className="flex flex-wrap items-center gap-2">
          <SourceChip kind="audio" label="Họp sprint 12" location="12:34" />
          <SourceChip kind="note" label="Ghi chú kiến trúc" location="Mục 2.3" />
          <SourceChip kind="document" label="Hợp đồng.pdf" location="tr.3" />
          <SourceChip kind="audio" location="04:15" size="xs" />
          <SourceChip kind="document" label="Spec_v2.1.pdf" tone="raised" onClick={() => undefined} />
        </div>
      </Section>

      <Section title="TaskListItem (4 mức ưu tiên, quá hạn, đã xong)">
        <TaskListItem title="Hoàn thiện API đăng nhập & xác thực SSO" priority="urgent" source={{ kind: 'audio', label: 'Họp sprint 12', location: '12:34' }} due={{ label: 'Quá hạn 2 ngày', overdue: true }} assignee={{ name: 'Nguyễn Minh Anh', initials: 'NA' }} />
        <TaskListItem title="Thiết kế module tích hợp OCR" priority="high" source={{ kind: 'document', label: 'Spec_v2.1.pdf' }} due={{ label: 'Hôm nay, 17:00' }} assignee={{ name: 'Trần Quốc Bảo', initials: 'QB', tone: 'ai' }} />
        <TaskListItem title="Cập nhật tài liệu hướng dẫn" priority="medium" source={{ kind: 'note', label: 'Ghi chú Sprint 41' }} due={{ label: '18/10' }} />
        <TaskListItem title="Dọn dẹp nhánh cũ" priority="low" checked />
      </Section>

      <Section title="GhostTaskCard: compact (tổng quan)">
        <GhostTaskCard title="Gửi biên bản họp cho khách hàng trước 17:00" source={{ kind: 'audio', label: 'Họp sprint 12', location: '12:34' }} note="Người thực hiện: Lê Thu Hà" />
        <GhostTaskCard title="Gia hạn hợp đồng cloud trước 30/10" source={{ kind: 'document', label: 'Hợp đồng.pdf', location: 'tr.3' }} lockedReason="Bạn chỉ có quyền xem" />
      </Section>

      <Section title="GhostTaskCard: detailed (bản ghi) + BulkActionsBar">
        <GhostTaskCard density="detailed" title="Hoàn thiện luồng xác nhận ghost task" priority="high" assignee={{ name: 'Nguyễn Minh Anh', initials: 'NA' }} date="18/10/2024" source={{ kind: 'audio', location: '12:34' }} selected={selected[0]} onSelectedChange={(v) => setSelected([v, selected[1], selected[2]])} />
        <GhostTaskCard density="detailed" title="Kiểm thử cơ chế bóc băng" priority="urgent" assignee={{ name: 'Trần Quốc Bảo', initials: 'QB' }} date="Hạn chót: 15/10" source={{ kind: 'audio', location: '31:02' }} selected={selected[1]} onSelectedChange={(v) => setSelected([selected[0], v, selected[2]])} />
        <GhostTaskCard density="detailed" title="Gửi tài liệu cho bộ phận pháp chế" priority="low" source={{ kind: 'audio', location: '45:10' }} selected={selected[2]} onSelectedChange={(v) => setSelected([selected[0], selected[1], v])} />
        <BulkActionsBar selected={count} total={3} onDismissAll={() => setSelected([false, false, false])} onConfirmAll={() => undefined} />
      </Section>

      <Section title="ProcessingStepper: hoàn tất / đang xử lý / lỗi một phần">
        <ProcessingStepper status="completed" summary="100% Hoàn thành" jobId="job_8F3A21" steps={withStatus(['done', 'done', 'done', 'done', 'done', 'done'], ['', '', '12 chunks', '', '', ''])} />
        <ProcessingStepper title="Đang xử lý ghi âm" status="processing" summary="Đang bóc băng 7/12" jobId="job_91B7C0" steps={withStatus(['done', 'done', 'active', 'pending', 'pending', 'pending'], ['', '', '7/12 chunks'])} />
        <ProcessingStepper status="partial_failed" summary="Lỗi một phần (83% hoàn thành)" jobId="job_8F3A21" steps={withStatus(['done', 'done', 'done', 'done', 'error', 'error'], ['', '', '', '', 'chunk 3, 7'])} />
      </Section>

      <Section title="PromptChip">
        <div className="flex flex-wrap items-center gap-2">
          <PromptChip>Task nào đang quá hạn?</PromptChip>
          <PromptChip sparkle>Tóm tắt cuộc họp hôm qua</PromptChip>
        </div>
      </Section>

      <Section title="EmptyState + OnboardingChecklist">
        <EmptyState
          className="min-h-0"
          illustration={
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
              <Icon name="space_dashboard" size={28} className="text-[36px]" />
            </div>
          }
          title="Chưa có công việc hoặc bản ghi nào trong Space này"
          description="Smart Collaborative Workspace giúp bạn biến cuộc họp, ghi chú và tài liệu thành kiến thức và hành động."
          actions={
            <>
              <Button size="lg" icon="mic">Bắt đầu ghi âm</Button>
              <Button size="lg" variant="outline" icon="upload_file">Tải tài liệu OCR</Button>
            </>
          }
        >
          <OnboardingChecklist
            title="Hướng dẫn khởi tạo"
            items={[
              { label: "Tạo Space 'Dự án Alpha'", status: 'done' },
              { label: 'Ghi âm cuộc họp đầu tiên hoặc tải tài liệu', description: 'AI sẽ bóc băng và gợi ý việc cần làm.', status: done ? 'done' : 'current' },
              { label: 'Hỏi Trợ lý AI hoặc tạo công việc đầu tiên', description: 'Trợ lý trả lời kèm nguồn.', status: 'todo' },
            ]}
          />
        </EmptyState>
        <Button size="xs" variant="subtle" onClick={() => setDone(!done)}>Demo: đổi bước 2</Button>
      </Section>

      <Section title="AssistantComposer">
        <AssistantComposer
          className="static"
          prompts={['Task nào đang quá hạn?', 'Tóm tắt cuộc họp hôm qua', 'Tìm tài liệu về hợp đồng cloud']}
          value={prompt}
          onChange={setPrompt}
          onSubmit={() => setPrompt('')}
          scopeNote="Chỉ truy xuất dữ liệu trong Space Dự án Alpha mà bạn có quyền truy cập."
        />
      </Section>
    </div>
  )
}

export default function DomainPage() {
  const { toggle, resolved } = useTheme()
  return (
    <div className="min-h-screen space-y-space-lg bg-background p-8">
      <header className="flex items-center justify-between">
        <h1 className="font-display-title text-display-title text-text-primary">Domain components (Phase 3)</h1>
        <Button variant="outline" onClick={toggle}>Theme toàn trang: {resolved}</Button>
      </header>
      <p className="font-body-default text-body-default text-text-secondary">Trái: light. Phải: dark (panel có class <code>dark</code>).</p>
      <div className="grid grid-cols-1 gap-space-lg xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-space-lg"><DomainContent /></div>
        <div className="dark rounded-2xl border border-border bg-background p-space-lg"><DomainContent /></div>
      </div>
    </div>
  )
}
