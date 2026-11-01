import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar, Badge, Banner, Button, ConfirmDialog, Icon, useToast } from '../../components/ui'
import { useAuth } from '../../context/auth-context'
import { roleDescription, roleLabel } from '../../lib/permissions'
import { invites } from '../../mocks/invites'
import { AuthLayout } from './AuthLayout'

const link = 'font-body-medium text-body-medium text-brand underline-offset-2 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

function Problem({ icon, title, description, children }: { icon: string; title: string; description: string; children?: React.ReactNode }) {
  return (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-variant text-text-secondary">
        <Icon name={icon} size={28} />
      </div>
      <div className="space-y-1">
        <h1 className="font-section-title text-section-title text-text-primary">{title}</h1>
        <p className="font-body-default text-body-default text-text-secondary">{description}</p>
      </div>
      {children}
    </>
  )
}

/** Guest nhận lời mời: xem Space và vai trò được cấp, đăng nhập hoặc đăng ký, rồi chấp nhận hoặc từ chối. */
export default function InvitePage() {
  const { token = '' } = useParams()
  const invite = invites[token]
  const { status, email, signOut } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [declining, setDeclining] = useState(false)
  const here = `/loi-moi/${token}`
  const next = encodeURIComponent(here)
  const signedIn = status === 'signedIn'
  const home = signedIn ? '/tong-quan' : '/dang-nhap'

  if (!invite) {
    return (
      <AuthLayout title="Lời mời">
        <Problem icon="link_off" title="Không tìm thấy lời mời" description="Liên kết có thể bị sai hoặc đã bị xoá. Hãy nhờ người mời gửi lại.">
          <Link to={home} className={link}>{signedIn ? 'Về không gian của tôi' : 'Đến trang đăng nhập'}</Link>
        </Problem>
      </AuthLayout>
    )
  }

  if (invite.state !== 'valid') {
    const expired = invite.state === 'expired'
    return (
      <AuthLayout title="Lời mời">
        <Problem
          icon={expired ? 'schedule' : 'block'}
          title={expired ? 'Lời mời đã hết hạn' : 'Lời mời đã bị thu hồi'}
          description={expired ? `Lời mời vào ${invite.space} hết hạn từ ${invite.until}.` : `${invite.inviter} đã thu hồi lời mời vào ${invite.space}.`}
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="lg" icon="mail" onClick={() => toast({ message: `Đã gửi yêu cầu mời lại tới ${invite.inviter}.`, tone: 'success' })}>
              Xin lời mời mới
            </Button>
            <Link to={home} className={`${link} inline-flex items-center px-2`}>{signedIn ? 'Về không gian của tôi' : 'Đến trang đăng nhập'}</Link>
          </div>
        </Problem>
      </AuthLayout>
    )
  }

  const mismatch = signedIn && email !== null && email.toLowerCase() !== invite.email.toLowerCase()

  const accept = () => {
    toast({ message: `Bạn đã tham gia ${invite.space} với vai trò ${roleLabel[invite.role]}.`, tone: 'success' })
    navigate('/tong-quan')
  }
  const decline = () => {
    setDeclining(false)
    toast({ message: 'Đã từ chối lời mời.', tone: 'info' })
    navigate(home)
  }

  return (
    <AuthLayout title="Lời mời">
      <div className="space-y-1">
        <h1 className="font-section-title text-section-title text-text-primary">Bạn được mời vào {invite.space}</h1>
        <p className="font-body-default text-body-default text-text-secondary">Lời mời gửi tới {invite.email}, còn hiệu lực đến {invite.until}.</p>
      </div>
      <div className="space-y-space-sm rounded-xl border border-border bg-surface-variant p-space-md">
        <div className="flex items-center gap-space-sm">
          <Avatar initials={invite.inviter.split(' ').slice(-2).map((w) => w[0]).join('')} size={9} tone="neutral" />
          <p className="font-body-default text-body-default text-text-primary">
            <span className="font-body-medium text-body-medium">{invite.inviter}</span> mời bạn tham gia cùng {invite.members - 1} người khác
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="neutral" size="xs" bold>{roleLabel[invite.role]}</Badge>
          <span className="font-caption text-caption text-text-secondary">{roleDescription[invite.role]}</span>
        </div>
      </div>
      {mismatch && (
        <Banner
          tone="warning"
          icon="person_alert"
          title={`Bạn đang đăng nhập bằng ${email}`}
          description={`Lời mời này dành cho ${invite.email}.`}
          actions={<Button size="xs" variant="outline" onClick={signOut}>Đổi tài khoản</Button>}
        />
      )}
      {signedIn ? (
        <div className="flex flex-wrap gap-2">
          <Button size="lg" className="h-11 flex-1" icon="group_add" onClick={accept} lockedReason={mismatch ? 'Đăng nhập đúng tài khoản được mời' : undefined}>
            Tham gia {invite.space}
          </Button>
          <Button size="lg" variant="outline" className="h-11" onClick={() => setDeclining(true)}>Từ chối</Button>
        </div>
      ) : (
        <div className="space-y-space-sm">
          <Link to={`/dang-nhap?next=${next}`} className="block">
            <span className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary-container font-body-medium text-body-medium text-[13px] text-on-primary shadow-sm hover:bg-primary">Đăng nhập để tham gia</span>
          </Link>
          <p className="text-center font-body-default text-body-default text-text-secondary">
            Chưa có tài khoản?{' '}
            <Link to={`/dang-ky?next=${next}&email=${encodeURIComponent(invite.email)}`} className={link}>Tạo tài khoản</Link>
          </p>
        </div>
      )}
      <ConfirmDialog
        open={declining}
        title="Từ chối lời mời?"
        description={`Bạn sẽ không vào ${invite.space}. ${invite.inviter} có thể mời lại bạn sau.`}
        confirmLabel="Từ chối"
        tone="destructive"
        onConfirm={decline}
        onCancel={() => setDeclining(false)}
      />
    </AuthLayout>
  )
}
