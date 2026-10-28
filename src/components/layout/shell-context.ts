import { createContext, useContext, useEffect, useSyncExternalStore } from 'react'

export interface ShellCtx {
  assistantOpen: boolean
  openAssistant: () => void
  closeAssistant: () => void
  toggleAssistant: () => void
  /** Mở panel Trợ lý và gửi sẵn một câu hỏi (ô hỏi nhanh ở Tổng quan dùng). */
  askAssistant: (question: string) => void
  /** Sidebar thu về dạng icon khi có panel gắn cạnh nội dung đang mở. */
  compact: boolean
}

export const ShellContext = createContext<ShellCtx | null>(null)

export function useShell(): ShellCtx {
  const c = useContext(ShellContext)
  if (!c) throw new Error('useShell must be used inside AppShell')
  return c
}

/* Đếm số panel gắn cạnh nội dung (trang Việc, Ghi âm...) đang mở, để AppShell thu Sidebar. */
let docks = 0
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

/** Các trang gọi `useDock(open)` khi hiển thị một panel gắn cạnh. Tự hủy khi đóng hoặc rời trang. */
export function useDock(open: boolean): void {
  useEffect(() => {
    if (!open) return
    docks += 1
    emit()
    return () => {
      docks -= 1
      emit()
    }
  }, [open])
}

export function useDockCount(): number {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => docks,
    () => 0,
  )
}
