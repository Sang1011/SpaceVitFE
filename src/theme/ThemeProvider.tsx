import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { THEME_COLORS, THEME_KEY, ThemeContext, type ThemeCtx, type ThemeMode } from './theme-context'

const isMode = (v: unknown): v is ThemeMode => v === 'light' || v === 'dark' || v === 'system'

function readStored(): ThemeMode {
  try {
    const v = localStorage.getItem(THEME_KEY)
    if (isMode(v)) return v
  } catch {
    /* storage unavailable */
  }
  return 'system'
}

function systemDark() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStored)
  const [sys, setSys] = useState<boolean>(systemDark)

  // Theo dõi cài đặt giao diện của hệ điều hành (chỉ có tác dụng khi mode = 'system').
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const h = (e: MediaQueryListEvent) => setSys(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  // Đồng bộ giữa các tab: đổi theme ở tab này thì tab khác đổi theo.
  useEffect(() => {
    const h = (e: StorageEvent) => {
      if (e.key === THEME_KEY || e.key === null) setModeState(isMode(e.newValue) ? e.newValue : 'system')
    }
    window.addEventListener('storage', h)
    return () => window.removeEventListener('storage', h)
  }, [])

  const resolved: 'light' | 'dark' = mode === 'system' ? (sys ? 'dark' : 'light') : mode

  // useLayoutEffect: áp class trước khi trình duyệt vẽ để không bị nháy.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[resolved])
  }, [resolved])

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m)
    try {
      localStorage.setItem(THEME_KEY, m)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo<ThemeCtx>(
    () => ({ mode, resolved, setMode, toggle: () => setMode(resolved === 'dark' ? 'light' : 'dark') }),
    [mode, resolved, setMode],
  )
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
