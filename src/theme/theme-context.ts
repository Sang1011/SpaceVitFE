import { createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeCtx {
  /** Lựa chọn của người dùng (có thể là "theo hệ thống"). */
  mode: ThemeMode
  /** Chế độ đang áp dụng thật sự. */
  resolved: 'light' | 'dark'
  setMode: (m: ThemeMode) => void
  toggle: () => void
}

export const ThemeContext = createContext<ThemeCtx | null>(null)

/** Khóa localStorage. index.html có script chống nháy dùng cùng khóa này. */
export const THEME_KEY = 'scw-theme'

/** Màu thanh trình duyệt (meta theme-color). Khớp với `background` trong tokens.css. */
export const THEME_COLORS = { light: '#F6F7FB', dark: '#0E1017' } as const

export function useTheme() {
  const c = useContext(ThemeContext)
  if (!c) throw new Error('useTheme must be used inside ThemeProvider')
  return c
}
