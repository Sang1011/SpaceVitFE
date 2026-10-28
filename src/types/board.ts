import type { AvatarProps } from '../components/ui'
import type { Priority } from '../components/ui'

export type ColumnKey = 'todo' | 'doing' | 'review' | 'done'

export interface BoardLabel {
  text: string
  tone: 'primary' | 'neutral' | 'ai'
}

/** Origin shown in the card footer (recording timestamp, document, note, sprint). */
export interface CardSource {
  icon: string
  text: string
  /** Use the mono font (timestamps). */
  mono?: boolean
  /** Without the grey pill background. */
  bare?: boolean
  /** Brand-colored icon (selected card). */
  iconBrand?: boolean
}

export interface BoardAssignee {
  initials: string
  name: string
  tone: NonNullable<AvatarProps['tone']>
}

export interface BoardTask {
  id: string
  title: string
  priority?: Priority
  labels: BoardLabel[]
  source?: CardSource
  due?: { label: string; overdue?: boolean }
  /** Shows "Xong dd/mm"-style text in the footer instead of a due date. */
  doneLabel?: string
  assignee: BoardAssignee
  /** Violet left border: waiting for AI cross-check. */
  aiReview?: boolean
}

export interface BoardColumnData {
  key: ColumnKey
  title: string
  /** Visible count badge tone. */
  tone: 'neutral' | 'solid' | 'ai' | 'success'
  tasks: BoardTask[]
  /** Tasks not shown (collapsed), added to the badge count. */
  hidden?: number
}

export interface TaskChecklistItem {
  text: string
  done: boolean
}

export interface TaskComment {
  author: BoardAssignee
  authorLabel: string
  time: string
  text: string
}

export interface TaskDetail {
  title: string
  code: string
  statusLabel: string
  createdNote: string
  source?: { title: string; location: string; quote: string }
  assignee: BoardAssignee
  due: { label: string; overdue?: boolean }
  priorityLabel: string
  labels: BoardLabel[]
  description: string
  checklist: TaskChecklistItem[]
  comments: TaskComment[]
  lastActivity: string
  attachments: { name: string; size: string }[]
  history: { who: string; text: string; time: string }[]
}
