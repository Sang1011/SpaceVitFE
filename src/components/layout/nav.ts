export interface NavEntry {
  to: string
  icon: string
  label: string
}

/** Route names come from the `data-path` values in the Stitch sidebar. */
export const mainNav: NavEntry[] = [
  { to: '/tong-quan', icon: 'dashboard', label: 'Tổng quan' },
  { to: '/ghi-chu', icon: 'description', label: 'Ghi chú' },
  { to: '/ghi-am', icon: 'mic', label: 'Ghi âm' },
  { to: '/tai-lieu', icon: 'folder', label: 'Tài liệu' },
  { to: '/bang-cong-viec', icon: 'view_kanban', label: 'Bảng công việc' },
  { to: '/lich-nhac-nho', icon: 'calendar_today', label: 'Lịch & Nhắc nhở' },
]
export const assistantNav: NavEntry = { to: '/tro-ly-ai', icon: 'auto_awesome', label: 'Trợ lý AI' }
export const myTasksNav: NavEntry = { to: '/cong-viec-cua-toi', icon: 'check_circle', label: 'Công việc của tôi' }
