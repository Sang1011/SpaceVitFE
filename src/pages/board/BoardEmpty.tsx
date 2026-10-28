import { EmptyState, OnboardingChecklist } from '../../components/domain'
import { Button, Icon } from '../../components/ui'

/** Empty board of a new Space: illustration, copy, 3-step checklist and 3 first actions. */
export function BoardEmpty() {
  return (
    <EmptyState
      illustration={
        <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-brand/10">
          <div className="absolute inset-0 animate-pulse rounded-full border-2 border-dashed border-brand/30" />
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-ai-container text-ai-accent shadow-inner">
            <Icon name="space_dashboard" size={28} className="text-[48px] text-brand" />
          </div>
          <div className="absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-recording-red shadow-md">
            <Icon name="mic" size={24} className="text-[22px]" />
          </div>
          <div className="absolute -bottom-2 -left-2 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-ai-accent shadow-md">
            <Icon name="auto_awesome" size={24} className="text-[22px]" />
          </div>
          <div className="absolute -right-3 bottom-2 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-brand shadow-md">
            <Icon name="description" size={20} />
          </div>
        </div>
      }
      title="Chưa có việc hoặc ghi âm nào trong không gian này"
      description="Smart Collaborative Workspace giúp bạn biến cuộc họp, ghi chú và tài liệu thành kiến thức và hành động. Bắt đầu với 3 bước đơn giản dưới đây:"
      actions={
        <>
          <Button size="lg" className="h-10 rounded-xl px-4 font-body-medium">
            <Icon name="mic" size={18} className="text-recording-red" />
            <span>Bắt đầu Ghi âm</span>
          </Button>
          <Button variant="outline" size="lg" className="h-10 rounded-xl bg-surface px-4 shadow-sm">
            <Icon name="upload_file" size={18} className="text-brand" />
            <span>Tải tài liệu OCR</span>
          </Button>
          <Button variant="outline" size="lg" className="h-10 rounded-xl bg-surface px-4 shadow-sm">
            <Icon name="edit_note" size={18} className="text-ai-accent" />
            <span>Tạo ghi chú mới</span>
          </Button>
        </>
      }
    >
      <OnboardingChecklist
        title="Hướng dẫn khởi đầu"
        items={[
          { label: 'Tạo Space "Dự án Alpha"', status: 'done' },
          { label: 'Ghi âm cuộc họp đầu tiên hoặc Tải tài liệu PDF/Scan', description: 'AI sẽ tự động bóc băng ghi âm & nhận diện OCR trích xuất nội dung', status: 'current' },
          { label: 'Hỏi Trợ lý AI hoặc tạo công việc đầu tiên', description: 'Duyệt việc đề xuất do AI gợi ý từ cuộc họp', status: 'todo' },
        ]}
      />
    </EmptyState>
  )
}
