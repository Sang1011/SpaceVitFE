import { PageHeader } from '../components/layout'
import { Icon } from '../components/ui'

export default function PlaceholderPage({ title, icon }: { title: string; icon: string }) {
  return (
    <>
      <PageHeader icon={icon} title={title} />
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-space-sm rounded-2xl border border-border bg-surface text-center shadow-sm">
        <Icon name="construction" size={28} className="text-text-secondary" />
        <p className="font-card-title text-card-title text-text-primary">Màn hình này chưa được dựng</p>
        <p className="font-caption text-caption text-text-secondary">Sẽ làm ở Phase 4 (hoặc khi có thiết kế Stitch).</p>
      </div>
    </>
  )
}
