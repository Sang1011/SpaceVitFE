import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { Button, Checkbox, useToast, Field } from '../../components/ui'
import { useAuth } from '../../context/auth-context'
import { isEmail, passwordError, safeNext } from '../../lib/validate'
import { AuthLayout } from './AuthLayout'

const link = 'font-body-medium text-body-medium text-brand underline-offset-2 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

type Errors = Partial<Record<'name' | 'email' | 'password' | 'confirm' | 'terms', string>>

export default function RegisterPage() {
  const { status, signIn } = useAuth()
  const { toast } = useToast()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const nextQuery = params.get('next') ? `?next=${encodeURIComponent(next)}` : ''
  const [v, setV] = useState({ name: '', email: params.get('email') ?? '', password: '', confirm: '' })
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (status === 'signedIn' && !loading) return <Navigate to={next} replace />

  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Errors = {
      name: v.name.trim().length < 2 ? 'Nhập họ tên' : undefined,
      email: !v.email.trim() ? 'Nhập email' : !isEmail(v.email) ? 'Email chưa đúng định dạng' : undefined,
      password: passwordError(v.password),
      confirm: v.confirm !== v.password ? 'Mật khẩu nhập lại chưa khớp' : undefined,
      terms: terms ? undefined : 'Bạn cần đồng ý điều khoản để tiếp tục',
    }
    setErrors(errs)
    if (Object.values(errs).some(Boolean)) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setLoading(true)
    timer.current = window.setTimeout(() => {
      setLoading(false)
      toast({ message: 'Đã tạo tài khoản.', tone: 'success' })
      signIn(v.email.trim())
    }, 700)
  }

  return (
    <AuthLayout title="Đăng ký">
      <div className="space-y-1">
        <h1 className="font-section-title text-section-title text-text-primary">Tạo tài khoản</h1>
        <p className="font-body-default text-body-default text-text-secondary">Chỉ mất một phút, sau đó bạn tạo hoặc tham gia một không gian.</p>
      </div>
      <form ref={form} onSubmit={submit} noValidate className="space-y-space-md">
        <Field label="Họ và tên" autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} />
        <Field label="Email" type="email" autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} error={errors.email} placeholder="ten@congty.vn" />
        <Field label="Mật khẩu" type="password" autoComplete="new-password" value={v.password} onChange={set('password')} error={errors.password} hint="Ít nhất 8 ký tự, gồm chữ và số." />
        <Field label="Nhập lại mật khẩu" type="password" autoComplete="new-password" value={v.confirm} onChange={set('confirm')} error={errors.confirm} />
        <div className="space-y-1.5">
          <Checkbox
            label="Tôi đồng ý với điều khoản sử dụng và chính sách riêng tư"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={errors.terms ? 'terms-err' : undefined}
          />
          {errors.terms && (
            <p id="terms-err" role="alert" className="font-caption text-caption text-status-error-text">
              {errors.terms}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" className="h-11 w-full" loading={loading}>
          Tạo tài khoản
        </Button>
      </form>
      <p className="text-center font-body-default text-body-default text-text-secondary">
        Đã có tài khoản?{' '}
        <Link to={`/dang-nhap${nextQuery}`} className={link}>
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  )
}
