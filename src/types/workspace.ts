export type SpaceRole = 'owner' | 'editor' | 'viewer'
export type AiStatus = 'online' | 'offline'

export interface Space {
  id: string
  name: string
  role: SpaceRole
}

export interface UserProfile {
  name: string
  title: string
  initials: string
}

export interface Member {
  initials: string
  name: string
  role?: SpaceRole
  id?: string
  email?: string
  /** active: đã là thành viên; invited: đã mời, chưa chấp nhận. */
  status?: 'active' | 'invited'
  /** Hoạt động gần nhất hoặc thời điểm gửi lời mời (đã định dạng). */
  lastActive?: string
}
