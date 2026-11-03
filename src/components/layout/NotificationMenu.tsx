import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useActivity } from '../../context/activity-context'
import { cn } from '../../lib/cn'
import type { NotifyKind } from '../../types/activity'
import { Badge, Button, Icon, IconButton, Popover, Tabs } from '../ui'

const icons: Record<NotifyKind, string> = { assigned: 'assignment_ind', comment: 'chat_bubble', reminder: 'alarm', processing: 'task_alt' }

/** Chuông thông báo (FR-COL-02): giao việc, bình luận, nhắc hẹn, xử lý xong. Bấm một mục để mở nơi liên quan. */
export function NotificationMenu() {
  const { notifications, unread, markRead, markAllRead } = useActivity()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'all' | 'unread'>('all')
  const list = tab === 'unread' ? notifications.filter((n) => !n.read) : notifications

  return (
    <Popover
      label="Thông báo"
      panelClassName="w-96 p-0 max-sm:fixed max-sm:inset-x-3 max-sm:top-[68px] max-sm:mt-0 max-sm:w-auto"
      trigger={(p) => <IconButton {...p} icon="notifications" label={unread > 0 ? `Thông báo, ${unread} chưa đọc` : 'Thông báo'} variant="soft" badgeDot={unread > 0} />}
    >
      <div className="flex items-center justify-between gap-2 px-space-md pb-1 pt-space-md">
        <h2 className="font-card-title text-card-title text-text-primary">Thông báo</h2>
        <Button size="xs" variant="ghost" icon="done_all" disabled={unread === 0} onClick={markAllRead}>
          Đọc hết
        </Button>
      </div>
      <div className="px-space-sm pb-space-sm">
        <Tabs
          dense
          tone="brand"
          value={tab}
          onChange={(k) => setTab(k as 'all' | 'unread')}
          items={[
            { key: 'all', label: 'Tất cả' },
            { key: 'unread', label: 'Chưa đọc', badge: unread > 0 ? String(unread) : undefined },
          ]}
        />
      </div>
      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-space-md pb-space-lg pt-space-md text-center">
          <Icon name="notifications_off" size={28} className="text-text-secondary" />
          <p className="font-body-medium text-body-medium text-text-primary">{tab === 'unread' ? 'Bạn đã đọc hết' : 'Chưa có thông báo'}</p>
          <p className="font-caption text-caption text-text-secondary">Loại thông báo nhận được chỉnh trong Hồ sơ.</p>
        </div>
      ) : (
        <ul className="max-h-[min(24rem,60vh)] overflow-y-auto">
          {list.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                data-popover-close
                onClick={() => {
                  markRead(n.id)
                  navigate(n.href)
                }}
                className={cn('flex w-full items-start gap-space-sm px-space-md py-2.5 text-left outline-none transition-colors hover:bg-surface-variant focus-visible:bg-surface-variant focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand', !n.read && 'bg-primary-fixed/40')}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-variant text-text-secondary">
                  <Icon name={icons[n.kind]} size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start gap-2">
                    <span className={cn('flex-1 font-body-default text-body-default text-text-primary', !n.read && 'font-semibold')}>{n.title}</span>
                    {!n.read && (
                      <>
                        <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                        <span className="sr-only">Chưa đọc</span>
                      </>
                    )}
                  </span>
                  {n.body && <span className="mt-0.5 line-clamp-2 block font-caption text-caption text-text-secondary">{n.body}</span>}
                  <span className="mt-0.5 block font-caption text-caption text-text-secondary">{n.time}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center justify-between border-t border-border px-space-md py-space-sm">
        <Link to="/khong-gian/hoat-dong" data-popover-close className="font-body-medium text-body-medium text-brand outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand">
          Xem hoạt động của không gian
        </Link>
        <Badge size="xs" tone="neutral">{notifications.length}</Badge>
      </div>
    </Popover>
  )
}
