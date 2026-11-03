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

export const membersNav: NavEntry = { to: '/khong-gian/thanh-vien', icon: 'group', label: 'Thành viên' }

export const settingsNav: NavEntry = { to: '/khong-gian/cai-dat', icon: 'settings', label: 'Cài đặt không gian' }
export const profileNav: NavEntry = { to: '/ho-so', icon: 'person', label: 'Hồ sơ' }

const allNav: NavEntry[] = [...mainNav, assistantNav, myTasksNav, membersNav, settingsNav, profileNav]

/** Tên trang theo đường dẫn, dùng cho breadcrumb và ngữ cảnh của Trợ lý. */
export function pageLabelFor(pathname: string): string {
  const hit = allNav.find((n) => pathname === n.to || pathname.startsWith(n.to + '/'))
  return hit?.label ?? 'Trang hiện tại'
}
