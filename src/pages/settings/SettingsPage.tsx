import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout'
import { Badge, Banner, Button, ConfirmDialog, Field, FieldArea, useToast } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { lockedReasonFor, roleLabel } from '../../lib/permissions'
import type { RecordingLanguage } from '../../types/workspace'

const langs: { value: RecordingLanguage; label: string; hint: string }[] = [
  { value: 'vi', label: 'Tiếng Việt', hint: 'Mặc định' },
  { value: 'en', label: 'English', hint: 'Dùng cho cuộc họp tiếng Anh' },
]

const card = 'rounded-2xl border border-border bg-surface p-space-lg shadow-sm'

/** FR-SPC-01: đổi tên, mô tả, ngôn ngữ ghi âm mặc định, lưu trữ hoặc rời Space. Chỉ Owner chỉnh được. */
export default function SettingsPage() {
  const { space, role, archived, roster, user, lock, updateSpace, setArchived, leaveSpace } = useWorkspace()
  const { toast } = useToast()
  const navigate = useNavigate()
  const isOwner = role === 'owner'
  const editLock = archived ? 'Không gian đã lưu trữ' : lockedReasonFor(role, 'space.settings')
  const readOnly = !!editLock

  const [name, setName] = useState(space.name)
  const [description, setDescription] = useState(space.description ?? '')
  const [language, setLanguage] = useState<RecordingLanguage>(space.language ?? 'vi')
  const [error, setError] = useState<string>()
  const [confirm, setConfirm] = useState<'archive' | 'leave' | null>(null)

  const dirty = name !== space.name || description !== (space.description ?? '') || language !== (space.language ?? 'vi')
  const owners = roster.filter((m) => m.status !== 'invited' && m.role === 'owner').length
  const soleOwner = isOwner && owners <= 1
  const leaveLock = soleOwner
    ? roster.filter((m) => m.status !== 'invited').length <= 1
      ? 'Bạn là thành viên duy nhất. Hãy lưu trữ không gian thay vì rời đi.'
      : 'Bạn là Owner cuối cùng. Hãy cấp quyền Owner cho người khác trước.'
    : undefined

  const save = (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim()
    if (n.length < 2) {
      setError('Tên cần ít nhất 2 ký tự')
      return
    }
    setError(undefined)
    updateSpace({ name: n, description: description.trim(), language })
    setName(n)
    toast({ message: 'Đã lưu cài đặt không gian.', tone: 'success' })
  }

  const reset = () => {
    setName(space.name)
    setDescription(space.description ?? '')
    setLanguage(space.language ?? 'vi')
    setError(undefined)
  }

  const doArchive = () => {
    setConfirm(null)
    setArchived(true)
    toast({ message: `Đã lưu trữ ${space.name}. Không gian chuyển sang chỉ xem.`, tone: 'info', action: { label: 'Hoàn tác', onClick: () => setArchived(false) } })
  }

  const doLeave = () => {
    setConfirm(null)
    const { left, next } = leaveSpace()
    toast({ message: `Bạn đã rời ${left}.`, tone: 'info' })
    navigate(next ? '/tong-quan' : `/khong-co-quyen?space=${encodeURIComponent(left)}`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-space-lg">
      <PageHeader icon="settings" title="Cài đặt không gian" meta={{ text: space.name }}>
        {archived && (
          <Banner
            tone="warning"
            icon="inventory_2"
            title="Không gian này đã lưu trữ"
            description="Mọi người chỉ xem được, không ai sửa hay thêm nội dung."
            actions={
              isOwner ? (
                <Button size="xs" variant="outline" onClick={() => { setArchived(false); toast({ message: `Đã khôi phục ${space.name}.`, tone: 'success' }) }}>
                  Khôi phục
                </Button>
              ) : undefined
            }
          />
        )}
        {!archived && readOnly && <Banner tone="info" icon="lock" title={`Bạn là ${roleLabel[role]} nên chỉ xem được cài đặt`} description="Chỉ Owner mới đổi được cài đặt không gian." />}
      </PageHeader>

      <form onSubmit={save} noValidate className={card} aria-labelledby="general-h">
        <h2 id="general-h" className="mb-space-md font-card-title text-card-title text-text-primary">Thông tin chung</h2>
        <div className="space-y-space-md">
          <Field label="Tên không gian" value={name} onChange={(e) => setName(e.target.value)} error={error} maxLength={60} disabled={readOnly} />
          <FieldArea label="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200} disabled={readOnly} />
          <fieldset className="space-y-1.5" disabled={readOnly}>
            <legend className="mb-0.5 font-body-medium text-body-medium text-text-primary">Ngôn ngữ ghi âm mặc định</legend>
            <p className="font-caption text-caption text-text-secondary">Dùng khi bắt đầu ghi âm hoặc tải âm thanh lên. Mỗi lần vẫn đổi được.</p>
            {langs.map((l) => (
              <label key={l.value} className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border p-2.5 has-[:checked]:border-brand has-[:checked]:bg-primary-fixed has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70">
                <input type="radio" name="rec-lang" value={l.value} checked={language === l.value} onChange={() => setLanguage(l.value)} className="mt-1 accent-brand" />
                <span>
                  <span className="block font-body-medium text-body-medium text-text-primary">{l.label}</span>
                  <span className="block font-caption text-caption text-text-secondary">{l.hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>
        <div className="mt-space-lg flex justify-end gap-2">
          <Button size="md" variant="outline" disabled={!dirty} onClick={reset}>Hủy thay đổi</Button>
          <Button size="md" type="submit" lockedReason={editLock} disabled={!dirty}>Lưu thay đổi</Button>
        </div>
      </form>

      <section aria-labelledby="danger-h" className="rounded-2xl border border-status-error/30 bg-surface p-space-lg shadow-sm">
        <h2 id="danger-h" className="mb-space-md font-card-title text-card-title text-status-error-text">Vùng nguy hiểm</h2>
        <ul className="divide-y divide-border">
          <li className="flex flex-wrap items-center justify-between gap-space-md py-space-sm first:pt-0">
            <div className="min-w-0 flex-1">
              <p className="font-body-medium text-body-medium text-text-primary">{archived ? 'Khôi phục không gian' : 'Lưu trữ không gian'}</p>
              <p className="font-caption text-caption text-text-secondary">
                {archived ? 'Mở lại để mọi người tiếp tục chỉnh sửa.' : 'Chuyển sang chỉ xem cho tất cả. Dữ liệu được giữ nguyên và khôi phục được bất cứ lúc nào.'}
              </p>
            </div>
            {archived ? (
              <Button variant="outline" size="md" lockedReason={isOwner ? undefined : lockedReasonFor(role, 'space.settings')} onClick={() => { setArchived(false); toast({ message: `Đã khôi phục ${space.name}.`, tone: 'success' }) }}>
                Khôi phục
              </Button>
            ) : (
              <Button variant="destructive-outline" size="md" icon="inventory_2" lockedReason={lock('space.settings')} onClick={() => setConfirm('archive')}>
                Lưu trữ
              </Button>
            )}
          </li>
          <li className="flex flex-wrap items-center justify-between gap-space-md py-space-sm last:pb-0">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-body-medium text-body-medium text-text-primary">Rời không gian {soleOwner && <Badge tone="warning" size="xs" bold>Owner cuối</Badge>}</p>
              <p className="font-caption text-caption text-text-secondary">Bạn mất quyền truy cập và chỉ vào lại được khi có người mời.</p>
            </div>
            <Button variant="destructive-outline" size="md" icon="logout" lockedReason={leaveLock} onClick={() => setConfirm('leave')}>
              Rời không gian
            </Button>
          </li>
        </ul>
      </section>

      <ConfirmDialog
        open={confirm === 'archive'}
        tone="destructive"
        title={`Lưu trữ ${space.name}?`}
        description="Mọi người chỉ xem được, không ai tạo hay sửa nội dung. Bạn khôi phục lại được trong phần cài đặt này."
        confirmLabel="Lưu trữ"
        onConfirm={doArchive}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'leave'}
        tone="destructive"
        title={`Rời ${space.name}?`}
        description={`${user.name} sẽ không còn truy cập được nội dung của không gian này. Muốn quay lại, bạn cần được mời lại.`}
        confirmLabel="Rời không gian"
        onConfirm={doLeave}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}
