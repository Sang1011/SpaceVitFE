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
}
