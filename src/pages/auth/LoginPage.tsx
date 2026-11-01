import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { Banner, Button, Checkbox, useToast } from '../../components/ui'
import { DEMO_EMAIL } from '../../context/AuthProvider'
import { useAuth } from '../../context/auth-context'
import { isEmail, safeNext } from '../../lib/validate'
import { AuthLayout } from './AuthLayout'
import { Field } from './Field'

const link = 'font-body-medium text-body-medium text-brand underline-offset-2 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

export default function LoginPage() {
  const { status, signIn } = useAuth()
  const { toast } = useToast()
  const [params] = useSearchParams()
  const reason = (useLocation().state as { reason?: string } | null)?.reason
  const next = safeNext(params.get('next'))
  const nextQuery = params.get('next') ? `?next=${encodeURIComponent(next)}` : ''
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (status === 'signedIn' && !loading) return <Navigate to={next} replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = {
      email: !email.trim() ? 'Nhập email' : !isEmail(email) ? 'Email chưa đúng định dạng' : undefined,
      password: !password ? 'Nhập mật khẩu' : undefined,
    }
    setErrors(errs)
    setFailed(false)
    if (errs.email || errs.password) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setLoading(true)
    timer.current = window.setTimeout(() => {
      setLoading(false)
      // Cờ demo ?error=1 giả lập đăng nhập thất bại.
      if (params.get('error') === '1') {
        setFailed(true)
        return
      }
      toast({ message: 'Chào mừng bạn quay lại.', tone: 'success' })
      signIn(email.trim())
    }, 600)
  }

  const demo = () => {
    toast({ message: 'Đang dùng tài khoản demo.', tone: 'info' })
    signIn(DEMO_EMAIL)
  }

  return (
    <AuthLayout title="Đăng nhập">
      <div className="space-y-1">
        <h1 className="font-section-title text-section-title text-text-primary">Đăng nhập</h1>
        <p className="font-body-default text-body-default text-text-secondary">Vào không gian làm việc của nhóm bạn.</p>
      </div>
      {reason === 'expired' && <Banner tone="warning" icon="schedule" title="Phiên đăng nhập đã hết hạn" description="Đăng nhập lại để tiếp tục, bạn sẽ về đúng trang đang làm." />}
      {reason === 'signedOut' && <Banner tone="info" icon="logout" title="Bạn đã đăng xuất" />}
      {failed && <Banner tone="error" icon="error" title="Email hoặc mật khẩu không đúng" description="Kiểm tra lại, hoặc dùng tài khoản demo bên dưới." />}
      <form ref={form} onSubmit={submit} noValidate className="space-y-space-md">
        <Field label="Email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="ten@congty.vn" />
        <Field label="Mật khẩu" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <div className="flex items-center justify-between">
          <Checkbox label="Ghi nhớ đăng nhập" />
          <button type="button" className={link} onClick={() => toast({ message: 'Đặt lại mật khẩu sẽ dùng được khi có kết nối máy chủ.', tone: 'info' })}>
            Quên mật khẩu?
          </button>
        </div>
        <Button type="submit" size="lg" className="h-11 w-full" loading={loading}>
          Đăng nhập
        </Button>
      </form>
      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="font-caption text-caption text-text-secondary">hoặc</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button variant="outline" size="lg" icon="science" className="h-11 w-full" onClick={demo}>
        Dùng tài khoản demo
      </Button>
      <p className="text-center font-body-default text-body-default text-text-secondary">
        Chưa có tài khoản?{' '}
        <Link to={`/dang-ky${nextQuery}`} className={link}>
          Đăng ký
        </Link>
      </p>
    </AuthLayout>
  )
}
