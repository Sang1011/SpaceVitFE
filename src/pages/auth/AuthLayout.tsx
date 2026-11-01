import { useEffect, type ReactNode } from 'react'
import { Logo } from '../../components/layout/Logo'
import { Icon } from '../../components/ui'

const points = [
  { icon: 'mic', text: 'Ghi âm cuộc họp và nhận bản chép lời cùng tóm tắt' },
  { icon: 'checklist', text: 'Duyệt việc đề xuất rồi mới tạo việc trên bảng' },
  { icon: 'forum', text: 'Hỏi Trợ lý và mở đúng nguồn được trích dẫn' },
]

/** Khung chung cho các màn chưa vào Space: đăng nhập, đăng ký, lời mời, không có quyền. */
export function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    document.title = `${title} · Smart Workspace`
  }, [title])
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-[420px] shrink-0 flex-col justify-between bg-primary-container p-space-xl text-on-primary lg:flex">
        <div className="flex items-center gap-3">
          <Logo className="h-9 w-9 ring-1 ring-on-primary/30" />
          <span className="font-card-title text-card-title">Smart Workspace</span>
        </div>
        <div className="space-y-space-lg">
          <p className="font-display-title text-display-title">Ghi lại, hiểu rõ và làm tiếp cùng cả nhóm.</p>
          <ul className="space-y-space-md">
            {points.map((p) => (
              <li key={p.icon} className="flex items-start gap-3 font-body-default text-body-default">
                <Icon name={p.icon} size={20} className="mt-0.5 shrink-0" />
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="font-caption text-caption">Nội dung AI luôn cần bạn xác nhận trước khi thành dữ liệu.</p>
      </aside>
      <main className="flex flex-1 items-center justify-center px-4 py-space-xl">
        <div className="w-full max-w-md space-y-space-lg">
          <div className="flex items-center gap-3 lg:hidden">
            <Logo className="h-9 w-9" />
            <span className="font-card-title text-card-title text-text-primary">Smart Workspace</span>
          </div>
          <div className="space-y-space-md rounded-2xl border border-border bg-surface p-space-lg shadow-sm">{children}</div>
        </div>
      </main>
    </div>
  )
}
