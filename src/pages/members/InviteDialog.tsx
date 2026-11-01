import { useRef, useState, type FormEvent } from 'react'
import { Button, Dialog } from '../../components/ui'
import { isEmail } from '../../lib/validate'
import { roleDescription, roleLabel } from '../../lib/permissions'
import type { SpaceRole } from '../../types/workspace'
import { Field } from '../auth/Field'

const roles: SpaceRole[] = ['editor', 'viewer', 'owner']

/** Mời một hoặc nhiều người (cách nhau bằng dấu phẩy hoặc xuống dòng) với cùng một vai trò. */
export function InviteDialog({ open, existing, onClose, onInvite }: { open: boolean; existing: string[]; onClose: () => void; onInvite: (emails: string[], role: SpaceRole) => void }) {
  const [text, setText] = useState('')
  const [role, setRole] = useState<SpaceRole>('editor')
  const [error, setError] = useState<string>()
  const form = useRef<HTMLFormElement>(null)

  const close = () => {
    setText('')
    setRole('editor')
    setError(undefined)
    onClose()
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const list = Array.from(new Set(text.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean)))
    const bad = list.find((x) => !isEmail(x))
    const dup = list.find((x) => existing.includes(x))
    const err = list.length === 0 ? 'Nhập ít nhất một email' : bad ? `"${bad}" chưa đúng định dạng email` : dup ? `${dup} đã là thành viên hoặc đã được mời` : undefined
    setError(err)
    if (err) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    onInvite(list, role)
    close()
  }

  return (
    <Dialog open={open} title="Mời thành viên" description="Họ nhận email lời mời và cần đăng nhập hoặc tạo tài khoản để tham gia." onClose={close}>
      <form ref={form} onSubmit={submit} noValidate className="space-y-space-md">
        <Field label="Email" value={text} onChange={(e) => setText(e.target.value)} error={error} hint="Nhập nhiều email, cách nhau bằng dấu phẩy." placeholder="ten@congty.vn, ten2@congty.vn" autoComplete="off" inputMode="email" />
        <fieldset className="space-y-1.5">
          <legend className="mb-1.5 font-body-medium text-body-medium text-text-primary">Vai trò</legend>
          {roles.map((r) => (
            <label key={r} className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border p-2.5 has-[:checked]:border-brand has-[:checked]:bg-primary-fixed">
              <input type="radio" name="invite-role" value={r} checked={role === r} onChange={() => setRole(r)} className="mt-1 accent-brand" />
              <span>
                <span className="block font-body-medium text-body-medium text-text-primary">{roleLabel[r]}</span>
                <span className="block font-caption text-caption text-text-secondary">{roleDescription[r]}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="flex justify-end gap-2">
          <Button size="md" variant="outline" onClick={close}>Hủy</Button>
          <Button size="md" type="submit" icon="send">Gửi lời mời</Button>
        </div>
      </form>
    </Dialog>
  )
}
