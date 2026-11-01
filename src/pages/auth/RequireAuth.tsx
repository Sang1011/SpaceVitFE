import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'

/** Chặn các màn trong Space khi chưa đăng nhập hoặc phiên hết hạn; sau khi đăng nhập quay lại đúng trang. */
export default function RequireAuth() {
  const { status, endedByUser } = useAuth()
  const loc = useLocation()
  if (status !== 'signedIn') {
    const next = encodeURIComponent(loc.pathname + loc.search)
    return <Navigate to={`/dang-nhap?next=${next}`} replace state={{ reason: status === 'expired' ? 'expired' : endedByUser ? 'signedOut' : undefined }} />
  }
  return <Outlet />
}
