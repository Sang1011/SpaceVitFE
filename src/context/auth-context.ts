import { createContext, useContext } from 'react'

export type AuthStatus = 'signedIn' | 'signedOut' | 'expired'

export interface AuthCtx {
  status: AuthStatus
  email: string | null
  /** True khi người dùng tự bấm đăng xuất (khác với vào thẳng khi chưa đăng nhập). */
  endedByUser: boolean
  signIn: (email: string) => void
  signOut: () => void
  /** Demo: giả lập phiên hết hạn. */
  expire: () => void
}

export const AuthContext = createContext<AuthCtx | null>(null)

export function useAuth(): AuthCtx {
  const c = useContext(AuthContext)
  if (!c) throw new Error('useAuth must be used inside AuthProvider')
  return c
}
