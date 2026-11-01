import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout'
import { Avatar, Badge, Banner, Button, ConfirmDialog, Icon, SearchInput, Tabs, useToast } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { roleDescription, roleLabel } from '../../lib/permissions'
import type { Member, SpaceRole } from '../../types/workspace'
import { InviteDialog } from './InviteDialog'
import { RoleMenu } from './RoleMenu'

type Filter = 'all' | 'active' | 'invited'
type Pending = { kind: 'remove'; m: Member } | { kind: 'promote'; m: Member } | { kind: 'demoteSelf'; m: Member; to: SpaceRole }

const order: Record<SpaceRole, number> = { owner: 0, editor: 1, viewer: 2 }
const rowGrid = 'md:grid md:grid-cols-[minmax(0,2fr)_150px_minmax(0,1.2fr)_auto] md:items-center md:gap-space-md'

/** FR-SPC-02/03: danh sách thành viên và lời mời. Mọi vai trò xem được; chỉ Owner mời, gỡ, đổi vai trò. */
export default function MembersPage() {
  const { roster, setRoster, role, user, space, canManage, lock } = useWorkspace()
  const { toast } = useToast()
  const [params] = useSearchParams()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [inviteOpen, setInviteOpen] = useState(() => params.get('moi') === '1' && canManage)
  const [pending, setPending] = useState<Pending | null>(null)

  const isSelf = (m: Member) => m.status !== 'invited' && m.initials === user.initials
  const roleOf = (m: Member): SpaceRole => (isSelf(m) ? role : m.role ?? 'viewer')
  const active = roster.filter((m) => m.status !== 'invited')
  const invited = roster.filter((m) => m.status === 'invited')
  const owners = active.filter((m) => m.role === 'owner').length

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return roster
      .filter((m) => (filter === 'all' ? true : filter === 'active' ? m.status !== 'invited' : m.status === 'invited'))
      .filter((m) => !q || m.name.toLowerCase().includes(q) || (m.email ?? '').toLowerCase().includes(q))
      .sort((a, b) => Number(a.status === 'invited') - Number(b.status === 'invited') || order[a.role ?? 'viewer'] - order[b.role ?? 'viewer'])
  }, [roster, filter, query])

  const setRole = (m: Member, to: SpaceRole) => {
    const from = m.role ?? 'viewer'
    setRoster((l) => l.map((x) => (x.id === m.id ? { ...x, role: to } : x)))
    toast({
      message: `Đã đổi vai trò của ${m.name} thành ${roleLabel[to]}.`,
      tone: 'success',
      action: { label: 'Hoàn tác', onClick: () => setRoster((l) => l.map((x) => (x.id === m.id ? { ...x, role: from } : x))) },
    })
  }

  const pick = (m: Member, to: SpaceRole) => {
    if (to === 'owner') setPending({ kind: 'promote', m })
    else if (isSelf(m)) setPending({ kind: 'demoteSelf', m, to })
    else setRole(m, to)
  }

  const removeRow = (m: Member, message: string) => {
    const idx = roster.findIndex((x) => x.id === m.id)
    setRoster((l) => l.filter((x) => x.id !== m.id))
    toast({
      message,
      tone: 'info',
      action: {
        label: 'Hoàn tác',
        onClick: () =>
          setRoster((l) => {
            const c = [...l]
            c.splice(Math.min(idx, c.length), 0, m)
            return c
          }),
      },
    })
  }

  const resend = (m: Member) => {
    setRoster((l) => l.map((x) => (x.id === m.id ? { ...x, lastActive: 'Vừa gửi' } : x)))
    toast({ message: `Đã gửi lại lời mời tới ${m.email}.`, tone: 'success' })
  }

  const invite = (emails: string[], to: SpaceRole) => {
    const stamp = String(roster.length) + emails.join('')
    setRoster((l) => [
      ...l,
      ...emails.map((e, i) => ({ id: `i-${stamp}-${i}`, initials: e.slice(0, 2).toUpperCase(), name: e, email: e, role: to, status: 'invited' as const, lastActive: 'Vừa gửi' })),
    ])
    setFilter('all')
    toast({ message: emails.length === 1 ? `Đã mời ${emails[0]} với vai trò ${roleLabel[to]}.` : `Đã mời ${emails.length} người với vai trò ${roleLabel[to]}.`, tone: 'success' })
  }

  const confirm = () => {
    const p = pending
    setPending(null)
    if (!p) return
    if (p.kind === 'remove') removeRow(p.m, `Đã gỡ ${p.m.name} khỏi ${space.name}.`)
    else if (p.kind === 'promote') setRole(p.m, 'owner')
    else setRole(p.m, p.to)
  }

  const counts = { all: roster.length, active: active.length, invited: invited.length }
  const existing = roster.map((m) => (m.email ?? '').toLowerCase())

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        icon="group"
        title="Thành viên"
        meta={{ text: `${active.length} thành viên${invited.length ? ` · ${invited.length} đang chờ` : ''}` }}
        actions={
          <Button size="md" icon="person_add" lockedReason={lock('member.manage')} onClick={() => setInviteOpen(true)}>
            Mời thành viên
          </Button>
        }
      >
        {!canManage && (
          <Banner tone="info" icon="lock" title={`Bạn là ${roleLabel[role]} nên chỉ xem được danh sách`} description="Chỉ Owner mới mời, gỡ thành viên hoặc đổi vai trò." />
        )}
      </PageHeader>

      <div className="mb-space-md flex flex-wrap items-center gap-space-sm">
        <div className="w-full sm:w-72">
          <SearchInput compact aria-label="Tìm thành viên" placeholder="Tìm theo tên hoặc email" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Tabs
          tone="brand"
          dense
          className="w-full sm:w-auto"
          value={filter}
          onChange={(k) => setFilter(k as Filter)}
          items={[
            { key: 'all', label: 'Tất cả', badge: String(counts.all) },
            { key: 'active', label: 'Hoạt động', badge: String(counts.active) },
            { key: 'invited', label: 'Đang chờ', badge: String(counts.invited) },
          ]}
        />
      </div>

      <section aria-label="Danh sách thành viên" className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div aria-hidden="true" className={`hidden border-b border-border bg-surface-variant px-space-md py-2 font-caption text-caption font-semibold uppercase tracking-wide text-text-secondary ${rowGrid}`}>
          <span>Thành viên</span>
          <span>Vai trò</span>
          <span>Trạng thái</span>
          <span className="w-48" />
        </div>
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-space-sm px-space-md py-space-xl text-center">
            <Icon name="person_search" size={28} className="text-text-secondary" />
            <p className="font-body-medium text-body-medium text-text-primary">{query ? `Không có ai khớp "${query}"` : 'Chưa có ai trong mục này'}</p>
            {(query || filter !== 'all') && (
              <Button variant="outline" size="sm" onClick={() => { setQuery(''); setFilter('all') }}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((m) => {
              const self = isSelf(m)
              const r = roleOf(m)
              const isInvite = m.status === 'invited'
              const lastOwner = !isInvite && m.role === 'owner' && owners <= 1
              const removeLock = self ? 'Bạn không thể tự gỡ mình' : lastOwner ? 'Không thể gỡ Owner cuối cùng' : undefined
              return (
                <li key={m.id} className={`flex flex-col gap-space-sm px-space-md py-space-sm ${rowGrid}`}>
                  <div className="flex min-w-0 items-center gap-space-sm">
                    {isInvite ? <Avatar icon="mail" size={9} tone="neutral" /> : <Avatar initials={m.initials} size={9} tone="neutral" />}
                    <div className="min-w-0">
                      <p className="truncate font-body-medium text-body-medium text-text-primary">
                        {m.name}
                        {self && <span className="font-body-default text-text-secondary"> (Bạn)</span>}
                      </p>
                      {!isInvite && <p className="truncate font-caption text-caption text-text-secondary">{m.email}</p>}
                    </div>
                  </div>
                  <div>
                    {canManage ? (
                      <RoleMenu
                        name={m.name}
                        value={r}
                        onPick={(to) => pick(m, to)}
                        blocked={lastOwner ? { editor: 'Space cần ít nhất một Owner', viewer: 'Space cần ít nhất một Owner' } : undefined}
                      />
                    ) : (
                      <Badge tone="neutral" size="sm" bold>{roleLabel[r]}</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 font-caption text-caption text-text-secondary">
                    {isInvite ? <Badge tone="warning" size="xs" bold>Đang chờ</Badge> : null}
                    <span>{m.lastActive}</span>
                  </div>
                  {canManage && (
                    <div className="flex flex-wrap gap-2 md:w-48 md:flex-nowrap md:justify-end">
                      {isInvite ? (
                        <>
                          <Button size="xs" variant="outline" icon="send" onClick={() => resend(m)} aria-label={`Gửi lại lời mời tới ${m.email}`}>Gửi lại</Button>
                          <Button size="xs" variant="ghost" icon="close" onClick={() => removeRow(m, `Đã thu hồi lời mời của ${m.email}.`)} aria-label={`Thu hồi lời mời của ${m.email}`}>Thu hồi</Button>
                        </>
                      ) : (
                        <Button size="xs" variant="destructive-outline" icon="person_remove" lockedReason={removeLock} onClick={() => setPending({ kind: 'remove', m })} aria-label={`Gỡ ${m.name}`}>Gỡ</Button>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="roles-h" className="mt-space-lg rounded-2xl border border-border bg-surface p-space-md">
        <h2 id="roles-h" className="mb-space-sm font-card-title text-card-title text-text-primary">Các vai trò</h2>
        <dl className="grid gap-space-sm sm:grid-cols-3">
          {(['owner', 'editor', 'viewer'] as SpaceRole[]).map((r) => (
            <div key={r}>
              <dt className="font-body-medium text-body-medium text-text-primary">{roleLabel[r]}</dt>
              <dd className="font-caption text-caption text-text-secondary">{roleDescription[r]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <InviteDialog open={inviteOpen} existing={existing} onClose={() => setInviteOpen(false)} onInvite={invite} />
      <ConfirmDialog
        open={pending !== null}
        tone={pending?.kind === 'promote' ? 'default' : 'destructive'}
        title={
          pending?.kind === 'remove'
            ? `Gỡ ${pending.m.name} khỏi ${space.name}?`
            : pending?.kind === 'promote'
              ? `Cho ${pending.m.name} quyền Owner?`
              : 'Bạn sẽ mất quyền quản trị'
        }
        description={
          pending?.kind === 'remove'
            ? 'Họ mất quyền truy cập ngay. Ghi chú, việc và tài liệu họ đã tạo vẫn ở lại Space.'
            : pending?.kind === 'promote'
              ? 'Owner có thể mời, gỡ thành viên, đổi vai trò và đổi cài đặt Space.'
              : pending?.kind === 'demoteSelf'
                ? `Bạn sẽ thành ${roleLabel[pending.to]} và không tự quay lại Owner được. Owner còn lại sẽ quản lý Space.`
                : undefined
        }
        confirmLabel={pending?.kind === 'remove' ? 'Gỡ thành viên' : pending?.kind === 'promote' ? 'Cấp quyền Owner' : 'Đổi vai trò'}
        onConfirm={confirm}
        onCancel={() => setPending(null)}
      />
    </div>
  )
}
