import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { mockCounts, mockMembers, mockPrefs, mockSpaces, mockUser } from '../mocks/workspace'
import { can as roleCan, lockedReasonFor, type SpaceAction } from '../lib/permissions'
import { initialsOf } from '../lib/initials'
import type { AiStatus, Member, NotificationPrefs, Space, SpaceRole, UserProfile } from '../types/workspace'

type RosterUpdate = Member[] | ((prev: Member[]) => Member[])

interface WorkspaceCtx {
  /** Space đang mở; `role` là vai trò thật của bạn trong Space này. */
  space: Space
  /** Tất cả Space bạn là thành viên (gồm cả Space đã lưu trữ), `role` đã cập nhật theo danh sách thành viên. */
  spaces: Space[]
  user: UserProfile
  /** Thành viên đang hoạt động (không gồm lời mời chưa chấp nhận). */
  members: Member[]
  /** Toàn bộ danh sách của Space đang mở, gồm cả lời mời đang chờ. */
  roster: Member[]
  setRoster: (next: RosterUpdate) => void
  counts: typeof mockCounts
  /** Vai trò của bạn trong Space đang mở. */
  role: SpaceRole
  /** Space đang mở đã lưu trữ: mọi thao tác thay đổi bị khoá. */
  archived: boolean
  canEdit: boolean
  canManage: boolean
  canComment: boolean
  /** True when the current role may perform the action. */
  can: (action: SpaceAction) => boolean
  /** Tooltip text for a locked control; undefined when allowed. */
  lock: (action: SpaceAction) => string | undefined
  aiStatus: AiStatus
  prefs: NotificationPrefs
  setPrefs: (p: Partial<NotificationPrefs>) => void
  setRole: (r: SpaceRole) => void
  setAiStatus: (s: AiStatus) => void
  switchSpace: (id: string) => void
  /** Tạo Space mới, bạn là Owner duy nhất. Trả về id. */
  createSpace: (input: { name: string; description?: string }) => string
  updateSpace: (patch: Partial<Pick<Space, 'name' | 'description' | 'language'>>) => void
  setArchived: (archived: boolean) => void
  /** Rời Space đang mở và chuyển sang Space khác. Trả về tên Space vừa rời và id Space được chuyển tới (nếu còn). */
  leaveSpace: () => { left: string; next: string | null }
  updateProfile: (patch: Pick<UserProfile, 'name' | 'title'>) => void
}

const Ctx = createContext<WorkspaceCtx | null>(null)

const selfOf = (r: Member[], id: string) => r.find((m) => m.id === id && m.status !== 'invited')

/** Mỗi Space mẫu có danh sách thành viên riêng; vai trò của bạn khớp với `space.role`. */
function initialRosters(): Record<string, Member[]> {
  return Object.fromEntries(mockSpaces.map((s) => [s.id, mockMembers.map((m) => (m.id === mockUser.id ? { ...m, role: s.role } : m))]))
}

/** Mock workspace state. Replace the mocks with API data later; the shape stays. */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  // Role comes from the current user's membership; setRole is a demo override.
  const [override, setOverride] = useState<SpaceRole | null>(() => {
    // Demo flag: ?role=owner|editor|viewer works on every page.
    const r = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('role')
    return r === 'owner' || r === 'editor' || r === 'viewer' ? r : null
  })
  const [user, setUser] = useState<UserProfile>(mockUser)
  const [prefs, setPrefsState] = useState<NotificationPrefs>(mockPrefs)
  const [spaceList, setSpaceList] = useState<Space[]>(mockSpaces)
  const [rosters, setRosters] = useState<Record<string, Member[]>>(initialRosters)
  const [spaceId, setSpaceId] = useState('alpha')
  const [aiStatus, setAiStatus] = useState<AiStatus>('online')

  const current = spaceList.find((s) => s.id === spaceId) ?? spaceList[0]
  const roster = useMemo(() => rosters[current.id] ?? [], [rosters, current.id])
  const memberRole = selfOf(roster, user.id)?.role ?? current.role
  const role: SpaceRole = override ?? memberRole
  const archived = !!current.archived
  // Space đã lưu trữ chỉ xem được (kể cả bình luận), dù vai trò là gì.
  const allow = useCallback((a: SpaceAction) => (archived ? a === 'view' : roleCan(role, a)), [archived, role])

  const setRoster = useCallback(
    (next: RosterUpdate) => {
      const id = current.id
      setRosters((all) => ({ ...all, [id]: typeof next === 'function' ? next(all[id] ?? []) : next }))
    },
    [current.id],
  )

  const spaces = useMemo(() => spaceList.map((s) => ({ ...s, role: selfOf(rosters[s.id] ?? [], user.id)?.role ?? s.role })), [spaceList, rosters, user.id])

  const value = useMemo<WorkspaceCtx>(
    () => ({
      space: { ...current, role: memberRole },
      spaces,
      user,
      members: roster.filter((m) => m.status !== 'invited'),
      roster,
      setRoster,
      counts: mockCounts,
      role,
      archived,
      canEdit: allow('note.edit'),
      canManage: allow('member.manage'),
      canComment: allow('comment'),
      can: allow,
      lock: (a) => (allow(a) ? undefined : archived ? 'Không gian đã lưu trữ' : lockedReasonFor(role, a)),
      aiStatus,
      prefs,
      setPrefs: (p) => setPrefsState((s) => ({ ...s, ...p })),
      setRole: (r) => setOverride(r),
      setAiStatus,
      switchSpace: (id) => setSpaceId(id),
      createSpace: ({ name, description }) => {
        const id = `s${spaceList.length + 1}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'moi'}`
        const self: Member = { id: user.id, initials: user.initials, name: user.name, role: 'owner', email: mockMembers.find((m) => m.id === user.id)?.email, status: 'active', lastActive: 'Đang hoạt động' }
        setSpaceList((l) => [...l, { id, name, description: description ?? '', role: 'owner', language: 'vi', memberCount: 1 }])
        setRosters((all) => ({ ...all, [id]: [self] }))
        setSpaceId(id)
        return id
      },
      updateSpace: (patch) => setSpaceList((l) => l.map((s) => (s.id === current.id ? { ...s, ...patch } : s))),
      setArchived: (a) => setSpaceList((l) => l.map((s) => (s.id === current.id ? { ...s, archived: a } : s))),
      leaveSpace: () => {
        const left = current.name
        const rest = spaceList.filter((s) => s.id !== current.id)
        const next = rest.find((s) => !s.archived) ?? rest[0] ?? null
        setSpaceList(rest)
        setRosters((all) => {
          const { [current.id]: _gone, ...others } = all
          void _gone
          return others
        })
        if (next) setSpaceId(next.id)
        return { left, next: next?.id ?? null }
      },
      updateProfile: ({ name, title }) => {
        const initials = initialsOf(name)
        setUser((u) => ({ ...u, name, title, initials }))
        setRosters((all) => Object.fromEntries(Object.entries(all).map(([k, r]) => [k, r.map((m) => (m.id === user.id ? { ...m, name, initials } : m))])))
      },
    }),
    [current, memberRole, spaces, user, roster, setRoster, role, archived, allow, aiStatus, prefs, spaceList],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useWorkspace() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useWorkspace must be used inside WorkspaceProvider')
  return c
}
