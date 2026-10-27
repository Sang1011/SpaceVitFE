import { myTasksTotal } from './overview'
import type { Member, Space, UserProfile } from '../types/workspace'

export const mockSpace: Space = { id: 'alpha', name: 'Dự án Alpha', role: 'owner' }

export const mockUser: UserProfile = {
  name: 'Nguyễn Minh Anh',
  title: 'Trưởng nhóm sản phẩm',
  initials: 'NA',
}

export const mockMembers: Member[] = [
  { initials: 'TM', name: 'Trần Minh' },
  { initials: 'HL', name: 'Lê Thu Hà' },
  { initials: 'ĐQ', name: 'Đặng Quang' },
  { initials: 'NA', name: 'Nguyễn Minh Anh' },
  { initials: 'QB', name: 'Trần Quốc Bảo' },
  { initials: 'BK', name: 'Bùi Khánh' },
]

export const mockCounts = { myTasks: myTasksTotal, hasUnreadNotifications: true }
