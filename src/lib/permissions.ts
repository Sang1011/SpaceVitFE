import type { SpaceRole } from '../types/workspace'

/**
 * Single source of truth for what each Space role may do (SRS FR-SPC-03).
 * Owner = Editor + Space administration. Viewer = read and comment only.
 */
export type SpaceAction =
  | 'view'
  | 'comment'
  | 'note.edit'
  | 'note.ai'
  | 'recording.create'
  | 'document.upload'
  | 'document.ai'
  | 'task.edit'
  | 'task.confirm'
  | 'reminder.edit'
  | 'assistant.act'
  | 'member.manage'
  | 'role.change'
  | 'space.settings'

const VIEWER: SpaceAction[] = ['view', 'comment']
const EDITOR: SpaceAction[] = [
  ...VIEWER,
  'note.edit',
  'note.ai',
  'recording.create',
  'document.upload',
  'document.ai',
  'task.edit',
  'task.confirm',
  'reminder.edit',
  'assistant.act',
]
const OWNER: SpaceAction[] = [...EDITOR, 'member.manage', 'role.change', 'space.settings']

const MATRIX: Record<SpaceRole, ReadonlySet<SpaceAction>> = {
  viewer: new Set(VIEWER),
  editor: new Set(EDITOR),
  owner: new Set(OWNER),
}

const OWNER_ONLY: ReadonlySet<SpaceAction> = new Set(['member.manage', 'role.change', 'space.settings'])

export function can(role: SpaceRole, action: SpaceAction): boolean {
  return MATRIX[role].has(action)
}

/** Tooltip text for a locked control, or undefined when the action is allowed. */
export function lockedReasonFor(role: SpaceRole, action: SpaceAction): string | undefined {
  if (can(role, action)) return undefined
  return OWNER_ONLY.has(action) ? 'Chỉ Owner mới làm được' : 'Bạn chỉ có quyền xem'
}

export const roleLabel: Record<SpaceRole, string> = {
  owner: 'Owner',
  editor: 'Editor',
  viewer: 'Viewer',
}

export const roleDescription: Record<SpaceRole, string> = {
  owner: 'Toàn quyền, gồm quản lý thành viên và cài đặt Space',
  editor: 'Tạo và sửa ghi chú, ghi âm, tài liệu, việc',
  viewer: 'Chỉ xem và bình luận',
}
