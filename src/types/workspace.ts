export type SpaceRole = 'owner' | 'editor' | 'viewer'
export type AiStatus = 'online' | 'offline'

export type RecordingLanguage = 'vi' | 'en'

export interface Space {
  id: string
  name: string
  /** Vai trò của người dùng hiện tại trong Space này. */
  role: SpaceRole
  description?: string
  /** Space đã lưu trữ: chỉ xem. */
  archived?: boolean
  /** Ngôn ngữ ghi âm mặc định (FR-AUD-02). */
  language?: RecordingLanguage
  memberCount?: number
}

export interface NotificationPrefs {
  assigned: boolean
  comments: boolean
  reminders: boolean
  processing: boolean
}

export interface UserProfile {
  /** Khoá ổn định để nhận ra chính mình trong danh sách thành viên. */
  id: string
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
