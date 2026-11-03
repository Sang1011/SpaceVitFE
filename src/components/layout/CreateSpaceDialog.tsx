import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import { Button, Dialog, Field, FieldArea, useToast } from '../ui'

/** FR-SPC-01: tạo Space mới. Người tạo là Owner duy nhất. */
export function CreateSpaceDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { spaces, createSpace } = useWorkspace()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string>()
  const form = useRef<HTMLFormElement>(null)

  const close = () => {
    setName('')
    setDescription('')
    setError(undefined)
    onClose()
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim()
    const err = n.length < 2 ? 'Tên cần ít nhất 2 ký tự' : spaces.some((s) => s.name.toLowerCase() === n.toLowerCase()) ? 'Bạn đã có một không gian trùng tên' : undefined
    setError(err)
    if (err) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    createSpace({ name: n, description: description.trim() })
    toast({ message: `Đã tạo ${n}. Bạn là Owner, hãy mời thêm người.`, tone: 'success' })
    close()
    navigate('/tong-quan')
  }

  return (
    <Dialog open={open} title="Tạo không gian mới" description="Mỗi không gian có ghi chú, tài liệu, bảng việc và thành viên riêng." onClose={close}>
      <form ref={form} onSubmit={submit} noValidate className="space-y-space-md">
        <Field label="Tên không gian" value={name} onChange={(e) => setName(e.target.value)} error={error} maxLength={60} placeholder="Ví dụ: Dự án Beta" autoComplete="off" />
        <FieldArea label="Mô tả (không bắt buộc)" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200} />
        <div className="flex justify-end gap-2">
          <Button size="md" variant="outline" onClick={close}>Hủy</Button>
          <Button size="md" type="submit" icon="add">Tạo không gian</Button>
        </div>
      </form>
    </Dialog>
  )
}
