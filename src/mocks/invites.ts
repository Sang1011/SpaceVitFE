import type { SpaceRole } from '../types/workspace'

export type InviteState = 'valid' | 'expired' | 'revoked'

export interface Invite {
  state: InviteState
  space: string
  inviter: string
  role: SpaceRole
  /** Email được mời. */
  email: string
  members: number
  /** Còn hiệu lực đến (đã định dạng). */
  until: string
}

/** Mã lời mời mẫu. Mã lạ được coi là không tìm thấy. */
export const invites: Record<string, Invite> = {
  demo: { state: 'valid', space: 'Dự án Alpha', inviter: 'Trần Minh', role: 'editor', email: 'demo@recapteq.vn', members: 6, until: '04/11' },
  'xem-thoi': { state: 'valid', space: 'Kế hoạch Q4', inviter: 'Lê Thu Hà', role: 'viewer', email: 'demo@recapteq.vn', members: 4, until: '06/11' },
  'khac-email': { state: 'valid', space: 'Dự án Beta', inviter: 'Đặng Quang', role: 'editor', email: 'linh.pham@congty.vn', members: 3, until: '05/11' },
  'het-han': { state: 'expired', space: 'Dự án Alpha', inviter: 'Trần Minh', role: 'editor', email: 'demo@recapteq.vn', members: 6, until: '20/10' },
  'da-thu-hoi': { state: 'revoked', space: 'Dự án Alpha', inviter: 'Trần Minh', role: 'editor', email: 'demo@recapteq.vn', members: 6, until: '04/11' },
}
