import { Link, useSearchParams } from 'react-router-dom'
import { Button, Icon, useToast } from '../../components/ui'
import { useAuth } from '../../context/auth-context'
import { AuthLayout } from './AuthLayout'

/** FR-SPC-04: người dùng không phải thành viên (hoặc đã bị gỡ) mở một Space. */
export default function NoAccessPage() {
  const [params] = useSearchParams()
  const space = params.get('space') ?? 'không gian này'
  const { signOut } = useAuth()
  const { toast } = useToast()
  return (
    <AuthLayout title="Không có quyền truy cập">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-variant text-text-secondary">
        <Icon name="lock" size={28} />
      </div>
      <div className="space-y-1">
        <h1 className="font-section-title text-section-title text-text-primary">Bạn không có quyền vào {space}</h1>
        <p className="font-body-default text-body-default text-text-secondary">
          Bạn chưa là thành viên, hoặc đã bị gỡ khỏi không gian này. Hãy nhờ Owner mời lại bạn.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="lg" icon="key" onClick={() => toast({ message: 'Đã gửi yêu cầu truy cập tới Owner.', tone: 'success' })}>
          Xin quyền truy cập
        </Button>
        <Link to="/tong-quan" className="inline-flex h-11 items-center rounded-lg border border-border px-4 font-body-medium text-body-medium text-[13px] text-text-primary outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand">
          Về không gian của tôi
        </Link>
        <Button size="lg" variant="ghost" icon="logout" onClick={signOut}>Đăng xuất</Button>
      </div>
    </AuthLayout>
  )
}
