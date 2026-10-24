import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { mockCounts, mockMembers, mockSpace, mockUser } from '../mocks/workspace'
import type { AiStatus, Member, Space, SpaceRole, UserProfile } from '../types/workspace'

interface WorkspaceCtx {
  space: Space
  user: UserProfile
  members: Member[]
  counts: typeof mockCounts
  /** Role of the current user in the current space; drives read-only UI. */
  role: SpaceRole
  canEdit: boolean
  aiStatus: AiStatus
  setRole: (r: SpaceRole) => void
  setAiStatus: (s: AiStatus) => void
}

const Ctx = createContext<WorkspaceCtx | null>(null)

/** Mock workspace state. Replace the mocks with API data later; the shape stays. */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<SpaceRole>(mockSpace.role)
  const [aiStatus, setAiStatus] = useState<AiStatus>('online')
  const value = useMemo<WorkspaceCtx>(
    () => ({
      space: { ...mockSpace, role },
      user: mockUser,
      members: mockMembers,
      counts: mockCounts,
      role,
      canEdit: role !== 'viewer',
      aiStatus,
      setRole,
      setAiStatus,
    }),
    [role, aiStatus],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWorkspace() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return c
}
