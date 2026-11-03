import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useActivity, useComments } from '../../context/activity-context'
import { useWorkspace } from '../../context/WorkspaceContext'
import { cn } from '../../lib/cn'
import type { CommentItem, ResourceRef } from '../../types/activity'
import { Avatar, Button } from '../ui'

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Làm nổi các @Tên thành viên trong nội dung bình luận. */
export function MentionText({ text, names }: { text: string; names: string[] }) {
  const parts = useMemo<ReactNode[]>(() => {
    if (names.length === 0) return [text]
    const re = new RegExp(`(@(?:${[...names].sort((a, b) => b.length - a.length).map(esc).join('|')}))`, 'g')
    return text.split(re).map((p, i) =>
      i % 2 === 1 ? (
        <span key={i} className="rounded bg-primary-fixed px-0.5 font-semibold text-brand">
          {p}
        </span>
      ) : (
        p
      ),
    )
  }, [text, names])
  return <>{parts}</>
}

export interface CommentThreadProps {
  resource: ResourceRef
  /** Bình luận mẫu có sẵn của tài nguyên. */
  seed?: CommentItem[]
  /** Tiêu đề ẩn cho trình đọc màn hình. */
  label?: string
  className?: string
}

/**
 * Khung bình luận dùng chung cho ghi chú, việc, tài liệu, ghi âm (FR-COL-01).
 * Mọi thành viên bình luận được, kể cả Viewer; Space đã lưu trữ thì khoá. Gõ @ để nhắc tên.
 */
export function CommentThread({ resource, seed, label = 'Bình luận', className }: CommentThreadProps) {
  const { canComment, archived, members } = useWorkspace()
  const { addComment } = useActivity()
  const comments = useComments(resource, seed)
  const names = useMemo(() => members.map((m) => m.name), [members])
  const [text, setText] = useState('')
  const [caret, setCaret] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [active, setActive] = useState(0)
  const [sent, setSent] = useState('')
  const area = useRef<HTMLTextAreaElement>(null)
  const listId = useId()

  const query = /(?:^|\s)@([^@\n]{0,30})$/.exec(text.slice(0, caret))
  const matches = useMemo(() => {
    if (!query) return []
    const q = fold(query[1].trim())
    return members.filter((m) => fold(m.name).includes(q)).slice(0, 5)
  }, [query, members])
  const open = !dismissed && matches.length > 0
  const idx = Math.min(active, Math.max(matches.length - 1, 0))

  const track = (el: HTMLTextAreaElement) => {
    setText(el.value)
    setCaret(el.selectionStart)
    setDismissed(false)
    setActive(0)
  }

  const choose = (name: string) => {
    if (!query) return
    const start = caret - query[1].length - 1
    const next = text.slice(0, start) + '@' + name + ' ' + text.slice(caret)
    const pos = start + name.length + 2
    setText(next)
    setCaret(pos)
    requestAnimationFrame(() => {
      area.current?.focus()
      area.current?.setSelectionRange(pos, pos)
    })
  }

  const submit = () => {
    const t = text.trim()
    if (!t || !canComment) return
    addComment(resource, t)
    setText('')
    setCaret(0)
    setSent('Đã gửi bình luận')
    window.setTimeout(() => setSent(''), 2000)
  }

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((idx + (e.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length)
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        choose(matches[idx].name)
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        e.nativeEvent.stopImmediatePropagation()
        setDismissed(true)
        return
      }
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className={cn('space-y-space-md', className)}>
      {comments.length === 0 ? (
        <p className="rounded-xl bg-surface-variant/60 p-space-md text-center font-body-default text-body-default text-text-secondary">Chưa có bình luận. Hãy là người đầu tiên.</p>
      ) : (
        <ul aria-label={label} className="space-y-space-md">
          {comments.map((c) => (
            <li key={c.id} className="flex items-start gap-space-sm">
              <Avatar initials={c.initials} size={7} tone="neutral" />
              <div className="min-w-0 flex-1 rounded-xl bg-surface-variant/60 p-2.5">
                <p className="font-caption text-caption text-text-secondary">
                  <span className="font-semibold text-text-primary">{c.author}</span> · {c.time}
                </p>
                <p className="mt-0.5 whitespace-pre-wrap break-words font-body-default text-body-default text-text-primary">
                  <MentionText text={c.text} names={names} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-border bg-surface focus-within:ring-2 focus-within:ring-brand">
          <textarea
            ref={area}
            rows={2}
            value={text}
            disabled={!canComment}
            onChange={(e) => track(e.target)}
            onKeyDown={onKey}
            onKeyUp={(e) => setCaret(e.currentTarget.selectionStart)}
            onClick={(e) => setCaret(e.currentTarget.selectionStart)}
            aria-controls={open ? listId : undefined}
            aria-activedescendant={open ? `${listId}-${idx}` : undefined}
            aria-autocomplete="list"
            aria-label="Viết bình luận"
            placeholder={canComment ? 'Viết bình luận, gõ @ để nhắc tên...' : archived ? 'Không gian đã lưu trữ' : 'Bạn không có quyền bình luận'}
            className="w-full resize-none bg-transparent p-2.5 font-body-default text-body-default text-text-primary placeholder:text-text-secondary focus:outline-none disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-between gap-2 border-t border-border/40 bg-surface-variant/50 px-2.5 py-1.5">
            <span className="hidden font-caption text-caption text-text-secondary sm:inline">Ctrl + Enter để gửi</span>
            <Button size="xs" className="ml-auto" disabled={!canComment || !text.trim()} onClick={submit}>
              Gửi
            </Button>
          </div>
        </div>
        {open && (
          <ul id={listId} role="listbox" aria-label="Thành viên" className="absolute bottom-full left-0 z-20 mb-1 max-h-48 w-64 max-w-full overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-xl">
            {matches.map((m, i) => (
              <li
                key={m.id ?? m.name}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === idx}
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(m.name)
                }}
                className={cn('flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 font-body-default text-body-default text-text-primary', i === idx && 'bg-primary-fixed')}
              >
                <Avatar initials={m.initials} size={6} tone="neutral" />
                <span className="truncate">{m.name}</span>
              </li>
            ))}
          </ul>
        )}
        <p role="status" className="sr-only">{open ? `${matches.length} gợi ý thành viên, dùng mũi tên lên xuống rồi Enter để chọn` : sent}</p>
      </div>
    </div>
  )
}
