import { myTasksTotal } from './overview'
import type { Member, Space, UserProfile } from '../types/workspace'

export const mockSpace: Space = { id: 'alpha', name: 'Dự án Alpha', role: 'owner' }

export const mockUser: UserProfile = {
  name: 'Nguyễn Minh Anh',
  title: 'Trưởng nhóm sản phẩm',
  initials: 'NA',
}

export const mockMembers: Member[] = [
  { id: 'm1', initials: 'TM', name: 'Trần Minh', role: 'owner', email: 'minh.tran@congty.vn', status: 'active', lastActive: '2 giờ trước' },
  { id: 'm2', initials: 'HL', name: 'Lê Thu Hà', role: 'editor', email: 'ha.le@congty.vn', status: 'active', lastActive: 'Hôm qua' },
  { id: 'm3', initials: 'ĐQ', name: 'Đặng Quang', role: 'editor', email: 'quang.dang@congty.vn', status: 'active', lastActive: '3 ngày trước' },
  { id: 'm4', initials: 'NA', name: 'Nguyễn Minh Anh', role: 'owner', email: 'demo@recapteq.vn', status: 'active', lastActive: 'Đang hoạt động' },
  { id: 'm5', initials: 'QB', name: 'Trần Quốc Bảo', role: 'viewer', email: 'bao.tran@congty.vn', status: 'active', lastActive: 'Tuần trước' },
  { id: 'm6', initials: 'BK', name: 'Bùi Khánh', role: 'viewer', email: 'khanh.bui@congty.vn', status: 'active', lastActive: '5 giờ trước' },
  { id: 'i1', initials: 'LP', name: 'linh.pham@congty.vn', role: 'editor', email: 'linh.pham@congty.vn', status: 'invited', lastActive: 'Gửi 2 ngày trước' },
  { id: 'i2', initials: 'KD', name: 'khach@doitac.vn', role: 'viewer', email: 'khach@doitac.vn', status: 'invited', lastActive: 'Gửi hôm qua' },
]

export const mockCounts = { myTasks: myTasksTotal, hasUnreadNotifications: true }
