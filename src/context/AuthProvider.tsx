import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthCtx, type AuthStatus } from './auth-context'

export const DEMO_EMAIL = 'demo@recapteq.vn'

/**
 * Phiên đăng nhập giả lập, chỉ giữ trong bộ nhớ (không lưu mật khẩu hay token).
 * Cờ demo: ?auth=out bắt đầu ở trạng thái chưa đăng nhập, ?auth=expired là phiên hết hạn.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(() => {
    const a = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('auth')
    return a === 'out' ? 'signedOut' : a === 'expired' ? 'expired' : 'signedIn'
  })
  const [endedByUser, setEnded] = useState(false)
  const [email, setEmail] = useState<string | null>(DEMO_EMAIL)
  const value = useMemo<AuthCtx>(
    () => ({
      status,
      email,
      endedByUser,
      signIn: (e) => {
        setEmail(e)
        setEnded(false)
        setStatus('signedIn')
      },
      signOut: () => {
        setEmail(null)
        setEnded(true)
        setStatus('signedOut')
      },
      expire: () => setStatus('expired'),
    }),
    [status, email, endedByUser],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
