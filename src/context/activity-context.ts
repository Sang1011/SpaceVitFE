import { createContext, useContext } from 'react'
import type { ActivityItem, ActivityKind, CommentItem, NotificationItem, ResourceRef } from '../types/activity'

export interface ActivityCtx {
  /** Bình luận đã thêm trong phiên này (chưa gồm dữ liệu mẫu có sẵn). */
  commentsFor: (r: ResourceRef) => CommentItem[]
  addComment: (r: ResourceRef, text: string) => void
  /** Thông báo đã lọc theo tuỳ chọn trong Hồ sơ. */
  notifications: NotificationItem[]
  unread: number
  markRead: (id: string) => void
  markAllRead: () => void
  /** Nhật ký của Space đang mở, mới nhất ở đầu. */
  activity: ActivityItem[]
  log: (e: { kind: ActivityKind; text: string; target?: { label: string; href: string } }) => void
}

export const ActivityContext = createContext<ActivityCtx | null>(null)

export function useActivity(): ActivityCtx {
  const c = useContext(ActivityContext)
  if (!c) throw new Error('useActivity must be used inside ActivityProvider')
  return c
}

/** Bình luận của một tài nguyên: dữ liệu mẫu (seed) cộng bình luận mới thêm. */
export function useComments(r: ResourceRef, seed: CommentItem[] = []): CommentItem[] {
  const { commentsFor } = useActivity()
  return [...seed, ...commentsFor(r)]
}
