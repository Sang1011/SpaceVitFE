export type ResourceKind = 'note' | 'task' | 'document' | 'recording'

/** Tài nguyên được bình luận (FR-COL-01). `href` dùng để mở lại từ thông báo hoặc nhật ký. */
export interface ResourceRef {
  kind: ResourceKind
  id: string
  title: string
  href: string
}

export interface CommentItem {
  id: string
  author: string
  initials: string
  time: string
  text: string
}

/** Loại thông báo (FR-COL-02), khớp với tuỳ chọn trong Hồ sơ. */
export type NotifyKind = 'assigned' | 'comment' | 'reminder' | 'processing'

export interface NotificationItem {
  id: string
  kind: NotifyKind
  title: string
  body?: string
  time: string
  href: string
  read: boolean
}

export type ActivityKind = 'task' | 'note' | 'document' | 'recording' | 'member' | 'space'

export type ActivityGroup = 'Hôm nay' | 'Hôm qua' | 'Trước đó'

/** Một mục trong nhật ký hoạt động (FR-COL-04). */
export interface ActivityItem {
  id: string
  kind: ActivityKind
  actor: string
  initials: string
  /** Hành động, ví dụ "đã đổi vai trò của Bùi Khánh thành Editor". */
  text: string
  target?: { label: string; href: string }
  group: ActivityGroup
  time: string
}
