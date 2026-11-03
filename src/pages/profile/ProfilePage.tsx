import { useState, type FormEvent } from 'react'
import { PageHeader } from '../../components/layout'
import { Avatar, Button, Checkbox, Field, ThemePicker, useToast } from '../../components/ui'
import { useAuth } from '../../context/auth-context'
import { useWorkspace } from '../../context/WorkspaceContext'
import { initialsOf } from '../../lib/initials'
import type { NotificationPrefs } from '../../types/workspace'

const card = 'rounded-2xl border border-border bg-surface p-space-lg shadow-sm'

const notify: { key: keyof NotificationPrefs; label: string; hint: string }[] = [
  { key: 'assigned', label: 'Được giao việc', hint: 'Khi có người giao hoặc đổi người phụ trách một việc cho bạn.' },
  { key: 'comments', label: 'Bình luận mới', hint: 'Khi có người nhắc tên bạn hoặc bình luận vào việc bạn theo dõi.' },
  { key: 'reminders', label: 'Nhắc hẹn đến hạn', hint: 'Khi một nhắc hẹn hoặc việc sắp đến hạn.' },
  { key: 'processing', label: 'Xử lý AI hoàn tất', hint: 'Khi bản chép lời, tóm tắt hoặc nhận dạng chữ trong tài liệu xong.' },
]

/** FR-AUTH-03: xem và sửa thông tin cá nhân, chọn thông báo và giao diện. */
export default function ProfilePage() {
  const { user, prefs, setPrefs, updateProfile } = useWorkspace()
  const { email, signOut } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState(user.name)
  const [title, setTitle] = useState(user.title)
  const [error, setError] = useState<string>()
  const dirty = name !== user.name || title !== user.title

  const save = (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim()
    if (n.length < 2) {
      setError('Nhập họ tên (ít nhất 2 ký tự)')
      return
    }
    setError(undefined)
    updateProfile({ name: n, title: title.trim() })
    setName(n)
    setTitle(title.trim())
    toast({ message: 'Đã lưu hồ sơ.', tone: 'success' })
  }

  return (
    <div className="mx-auto max-w-3xl space-y-space-lg">
      <PageHeader icon="person" title="Hồ sơ" meta={{ text: email ?? user.name }} />

      <form onSubmit={save} noValidate className={card} aria-labelledby="profile-h">
        <h2 id="profile-h" className="mb-space-md font-card-title text-card-title text-text-primary">Thông tin cá nhân</h2>
        <div className="mb-space-md flex items-center gap-space-md">
          <Avatar initials={initialsOf(name)} size={9} tone="brand-muted" className="!h-14 !w-14 !text-section-title" />
          <p className="font-caption text-caption text-text-secondary">Ảnh đại diện lấy từ chữ cái đầu của họ tên.</p>
        </div>
        <div className="space-y-space-md">
          <Field label="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} error={error} maxLength={60} autoComplete="name" />
          <Field label="Chức danh" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} autoComplete="organization-title" />
          <Field label="Email" value={email ?? ''} readOnly hint="Email dùng để đăng nhập, chưa đổi được ở đây." />
        </div>
        <div className="mt-space-lg flex justify-end gap-2">
          <Button size="md" variant="outline" disabled={!dirty} onClick={() => { setName(user.name); setTitle(user.title); setError(undefined) }}>Hủy thay đổi</Button>
          <Button size="md" type="submit" disabled={!dirty}>Lưu thay đổi</Button>
        </div>
      </form>

      <section className={card} aria-labelledby="notify-h">
        <h2 id="notify-h" className="font-card-title text-card-title text-text-primary">Thông báo trong ứng dụng</h2>
        <p className="mb-space-md font-caption text-caption text-text-secondary">Thay đổi được lưu ngay.</p>
        <ul className="space-y-space-md">
          {notify.map((n) => (
            <li key={n.key}>
              <Checkbox label={n.label} checked={prefs[n.key]} onChange={(e) => setPrefs({ [n.key]: e.target.checked })} />
              <p className="ml-6 font-caption text-caption text-text-secondary">{n.hint}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={card} aria-labelledby="theme-h">
        <h2 id="theme-h" className="mb-space-md font-card-title text-card-title text-text-primary">Giao diện</h2>
        <ThemePicker />
      </section>

      <section className={card} aria-labelledby="session-h">
        <h2 id="session-h" className="mb-space-sm font-card-title text-card-title text-text-primary">Phiên đăng nhập</h2>
        <Button variant="outline" size="md" icon="logout" onClick={signOut}>Đăng xuất</Button>
      </section>
    </div>
  )
}
