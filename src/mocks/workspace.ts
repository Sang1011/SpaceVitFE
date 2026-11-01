import { myTasksTotal } from './overview'
import type { Member, Space, UserProfile } from '../types/workspace'

export const mockSpace: Space = { id: 'alpha', name: 'Dự án Alpha', role: 'owner' }

export const mockUser: UserProfile = {
  name: 'Nguyễn Minh Anh',
  title: 'Trưởng nhóm sản phẩm',
  initials: 'NA',
}

export const mockMembers: Member[] = [
  { initials: 'TM', name: 'Trần Minh', role: 'editor' },
  { initials: 'HL', name: 'Lê Thu Hà', role: 'editor' },
  { initials: 'ĐQ', name: 'Đặng Quang', role: 'editor' },
  { initials: 'NA', name: 'Nguyễn Minh Anh', role: 'owner' },
  { initials: 'QB', name: 'Trần Quốc Bảo', role: 'viewer' },
  { initials: 'BK', name: 'Bùi Khánh', role: 'viewer' },
]

export const mockCounts = { myTasks: myTasksTotal, hasUnreadNotifications: true }
