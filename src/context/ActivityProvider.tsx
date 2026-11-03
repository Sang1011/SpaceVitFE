import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useToast } from '../components/ui'
import { seedActivity, seedNotifications } from '../mocks/activity'
import type { ActivityItem, CommentItem, NotificationItem, NotifyKind, ResourceRef } from '../types/activity'
import type { NotificationPrefs } from '../types/workspace'
import { ActivityContext, type ActivityCtx } from './activity-context'
import { useWorkspace } from './WorkspaceContext'

const prefKey: Record<NotifyKind, keyof NotificationPrefs> = { assigned: 'assigned', comment: 'comments', reminder: 'reminders', processing: 'processing' }
const keyOf = (spaceId: string, r: ResourceRef) => `${spaceId}:${r.kind}:${r.id}`

/**
 * Bình luận, thông báo và nhật ký hoạt động (mô phỏng, chỉ trong bộ nhớ).
 * Cờ demo: ?notify=live giả lập một thông báo đến sau vài giây, không cần tải lại trang (FR-COL-03).
 */
export function ActivityProvider({ children }: { children: ReactNode }) {
  const { space, user, prefs } = useWorkspace()
  const { toast } = useToast()
  const [comments, setComments] = useState<Record<string, CommentItem[]>>({})
  const [all, setAll] = useState<NotificationItem[]>(seedNotifications)
  const [logs, setLogs] = useState<Record<string, ActivityItem[]>>({ alpha: seedActivity })
  const spaceId = space.id

  const log = useCallback<ActivityCtx['log']>(
    (e) => {
      const item: ActivityItem = { id: `a-${Math.random().toString(36).slice(2, 8)}`, kind: e.kind, actor: user.name, initials: user.initials, text: e.text, target: e.target, group: 'Hôm nay', time: 'Vừa xong' }
      setLogs((l) => ({ ...l, [spaceId]: [item, ...(l[spaceId] ?? [])] }))
    },
    [spaceId, user.name, user.initials],
  )

  const addComment = useCallback<ActivityCtx['addComment']>(
    (r, text) => {
      const c: CommentItem = { id: `c-${Math.random().toString(36).slice(2, 8)}`, author: user.name, initials: user.initials, time: 'Vừa xong', text }
      const k = keyOf(spaceId, r)
      setComments((m) => ({ ...m, [k]: [...(m[k] ?? []), c] }))
      log({ kind: r.kind, text: `đã bình luận vào ${{ note: 'ghi chú', task: 'việc', document: 'tài liệu', recording: 'ghi âm' }[r.kind]}`, target: { label: r.title, href: r.href } })
    },
    [spaceId, user.name, user.initials, log],
  )

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('notify') !== 'live') return
    const t = window.setTimeout(() => {
      const n: NotificationItem = { id: 'live1', kind: 'assigned', title: 'Trần Minh giao cho bạn một việc', body: 'Chuẩn bị tài liệu demo cho khách hàng', time: 'Vừa xong', href: '/bang-cong-viec', read: false }
      setAll((l) => (l.some((x) => x.id === n.id) ? l : [n, ...l]))
      toast({ message: `${n.title}: ${n.body}`, tone: 'info' })
    }, 2500)
    // FR-COL-02/03: xử lý nền xong cũng đẩy thông báo, không cần tải lại trang.
    const t2 = window.setTimeout(() => {
      const n: NotificationItem = { id: 'live2', kind: 'processing', title: 'Nhận dạng chữ đã xong', body: 'Ảnh chụp hóa đơn tháng 9 · có thể tìm kiếm nội dung', time: 'Vừa xong', href: '/tai-lieu/d3', read: false }
      setAll((l) => (l.some((x) => x.id === n.id) ? l : [n, ...l]))
    }, 5000)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(t2)
    }
  }, [toast])

  const notifications = useMemo(() => all.filter((n) => prefs[prefKey[n.kind]]), [all, prefs])
  const value = useMemo<ActivityCtx>(
    () => ({
      commentsFor: (r) => comments[keyOf(spaceId, r)] ?? [],
      addComment,
      notifications,
      unread: notifications.filter((n) => !n.read).length,
      markRead: (id) => setAll((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))),
      markAllRead: () => setAll((l) => l.map((n) => ({ ...n, read: true }))),
      activity: logs[spaceId] ?? [],
      log,
    }),
    [comments, spaceId, addComment, notifications, logs, log],
  )
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}
