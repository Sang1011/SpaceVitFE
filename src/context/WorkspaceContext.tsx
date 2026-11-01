import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { mockCounts, mockMembers, mockSpace, mockUser } from '../mocks/workspace'
import { can as roleCan, lockedReasonFor, type SpaceAction } from '../lib/permissions'
import type { AiStatus, Member, Space, SpaceRole, UserProfile } from '../types/workspace'

interface WorkspaceCtx {
  space: Space
  user: UserProfile
  members: Member[]
  counts: typeof mockCounts
  /** Role of the current user in the current space; drives read-only UI. */
  role: SpaceRole
  canEdit: boolean
  canManage: boolean
  canComment: boolean
  /** True when the current role may perform the action. */
  can: (action: SpaceAction) => boolean
  /** Tooltip text for a locked control; undefined when allowed. */
  lock: (action: SpaceAction) => string | undefined
  aiStatus: AiStatus
  setRole: (r: SpaceRole) => void
  setAiStatus: (s: AiStatus) => void
}

const Ctx = createContext<WorkspaceCtx | null>(null)

/** Mock workspace state. Replace the mocks with API data later; the shape stays. */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  // Role comes from the current user's membership; setRole is a demo override.
  const [override, setRole] = useState<SpaceRole | null>(() => {
    // Demo flag: ?role=owner|editor|viewer works on every page.
    const r = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('role')
    return r === 'owner' || r === 'editor' || r === 'viewer' ? r : null
  })
  const memberRole = mockMembers.find((m) => m.initials === mockUser.initials)?.role ?? mockSpace.role
  const role: SpaceRole = override ?? memberRole
  const [aiStatus, setAiStatus] = useState<AiStatus>('online')
  const value = useMemo<WorkspaceCtx>(
    () => ({
      space: { ...mockSpace, role },
      user: mockUser,
      members: mockMembers,
      counts: mockCounts,
      role,
      canEdit: roleCan(role, 'note.edit'),
      canManage: roleCan(role, 'member.manage'),
      canComment: roleCan(role, 'comment'),
      can: (a) => roleCan(role, a),
      lock: (a) => lockedReasonFor(role, a),
      aiStatus,
      setRole: (r) => setRole(r),
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
