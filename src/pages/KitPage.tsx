import { useState, type ReactNode } from 'react'
import {
  Avatar, AvatarStack, Badge, Banner, Button, Checkbox, IconButton, Input, PriorityDot,
  ProgressBar, SearchInput, StatusChip, Tabs, Tooltip, type JobStatus,
} from '../components/ui'
import { useTheme } from '../theme/theme-context'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-space-sm">
      <h3 className="font-card-title text-card-title text-text-primary">{title}</h3>
      <div className="flex flex-wrap items-center gap-space-sm">{children}</div>
    </section>
  )
}

function KitContent() {
  const [tab, setTab] = useState('todo')
  const [dismissed, setDismissed] = useState(false)
  const statuses: JobStatus[] = ['completed', 'processing', 'partial_ready', 'partial_failed', 'failed']
  return (
    <div className="space-y-space-lg">
      <Section title="Button / variant (size sm)">
        <Button icon="add">Tạo mới</Button>
        <Button variant="outline" icon="person_add">Mời</Button>
        <Button variant="ghost">Hủy</Button>
        <Button variant="subtle" icon="filter_list">Bộ lọc</Button>
        <Button variant="ai" icon="auto_awesome">Trợ lý</Button>
        <Button variant="tonal" shape="pill" icon="add_task">Tạo task</Button>
        <Button variant="destructive" icon="refresh">Thử lại</Button>
        <Button variant="destructive-outline" icon="info">Chi tiết lỗi</Button>
      </Section>
      <Section title="Button / size, shape, state">
        <Button size="xs">xs h-7</Button>
        <Button size="sm">sm h-8</Button>
        <Button size="md">md h-9</Button>
        <Button size="lg">lg</Button>
        <Button size="icon" icon="play_arrow" iconFill aria-label="Phát" />
        <Button loading>Đang tải</Button>
        <Button disabled>Disabled</Button>
        <Button lockedReason="Bạn chỉ có quyền xem">Tạo công việc</Button>
        <Button variant="outline" iconRight="expand_more">Người phụ trách</Button>
      </Section>
      <Section title="IconButton">
        <IconButton icon="more_horiz" label="Thêm" />
        <IconButton icon="notifications" label="Thông báo" variant="soft" badgeDot />
        <IconButton icon="more_vert" label="Tùy chọn" variant="filled" />
        <IconButton icon="close" label="Đóng" iconSize={16} />
      </Section>
      <Section title="Badge / tone">
        <Badge>Owner</Badge>
        <Badge tone="primary">Backend</Badge>
        <Badge tone="ai" bold>✦ PRO</Badge>
        <Badge tone="ai-strong" size="xs" mono bold>✦ 4</Badge>
        <Badge tone="success">Hoàn tất</Badge>
        <Badge tone="warning">Sắp đến hạn</Badge>
        <Badge tone="error">Quá hạn</Badge>
        <Badge tone="primary-solid" shape="circle" size="sm" mono>5</Badge>
        <Badge tone="error-solid" size="xs" mono bold>PARTIAL_FAILED</Badge>
        <Badge tone="warning" mono icon="cloud_off">AI Offline</Badge>
      </Section>
      <Section title="StatusChip">
        {statuses.map((s) => <StatusChip key={s} status={s} />)}
        <StatusChip status="partial_failed" label="Lỗi một phần (2 chunks)" />
      </Section>
      <Section title="Avatar / AvatarStack">
        <Avatar initials="NA" size={9} tone="muted" presence />
        <Avatar initials="TM" size={7} tone="neutral" />
        <Avatar initials="HL" size={6} tone="ai" />
        <Avatar icon="person" size={8} tone="solid" />
        <AvatarStack members={[{ initials: 'TM' }, { initials: 'HL' }, { initials: 'ĐQ' }, { initials: 'NA' }, { initials: 'BK' }, { initials: 'QT' }]} />
      </Section>
      <Section title="PriorityDot / badge">
        {(['urgent', 'high', 'medium', 'low'] as const).map((l) => (
          <span key={l} className="flex items-center gap-2">
            <PriorityDot level={l} />
            <PriorityDot level={l} variant="badge" />
          </span>
        ))}
      </Section>
      <Section title="Checkbox">
        <Checkbox tone="ai" defaultChecked label="AI (ghost task)" />
        <Checkbox label="Brand" />
        <Checkbox defaultChecked disabled label="Disabled (viewer)" />
      </Section>
      <Section title="Input / SearchInput / Tooltip">
        <div className="w-72"><SearchInput hint="⌘K" placeholder="Tìm kiếm ghi chú, tài liệu..." /></div>
        <div className="w-56"><Input placeholder="Tiêu đề" /></div>
        <Tooltip content="Bạn chỉ có quyền xem"><Button variant="outline" disabled>Hover tôi</Button></Tooltip>
      </Section>
      <Section title="ProgressBar">
        <div className="w-full space-y-2">
          <ProgressBar value={62} />
          <ProgressBar value={85} tone="success" />
          <ProgressBar value={40} tone="error" />
        </div>
      </Section>
      <Section title="Tabs">
        <Tabs
          className="w-full"
          value={tab}
          onChange={setTab}
          items={[{ key: 'sum', label: 'Tóm tắt' }, { key: 'dec', label: 'Quyết định' }, { key: 'todo', label: 'Việc cần làm', badge: '✦ 4' }, { key: 'key', label: 'Điểm chính' }]}
        />
        <Tabs className="w-full" tone="brand" value="b" onChange={() => {}} items={[{ key: 'a', label: 'Tất cả' }, { key: 'b', label: 'Của tôi', badge: '5' }]} />
      </Section>
      <Section title="Banner">
        <div className="w-full space-y-2">
          {!dismissed && (
            <Banner
              tone="warning"
              icon="warning"
              title="Tính năng AI tạm thời không khả dụng do gián đoạn dịch vụ."
              description="Ghi chú, task và tài liệu vẫn hoạt động bình thường."
              badge="AI Offline"
              onDismiss={() => setDismissed(true)}
            />
          )}
          <Banner
            tone="error"
            solidIcon
            icon="error"
            title="Lỗi bóc băng tại chunk 3 và chunk 7"
            badge="PARTIAL_FAILED"
            description="Các phân đoạn khác đã sẵn sàng."
            actions={<><Button variant="destructive-outline" size="md" icon="info">Xem chi tiết lỗi</Button><Button variant="destructive" size="md" icon="refresh">Thử lại các phần lỗi</Button></>}
          />
          <Banner tone="ai" icon="auto_awesome" title="AI đề xuất 4 việc cần làm" badge="✦ 4" />
          <Banner tone="info" icon="info" title="Thông tin chung" />
        </div>
      </Section>
    </div>
  )
}

export default function KitPage() {
  const { toggle, resolved } = useTheme()
  return (
    <div className="min-h-screen bg-background p-8 space-y-space-lg">
      <header className="flex items-center justify-between">
        <h1 className="font-display-title text-display-title text-text-primary">UI kit (Phase 1)</h1>
        <Button variant="outline" onClick={toggle}>Theme toàn trang: {resolved}</Button>
      </header>
      <p className="font-body-default text-body-default text-text-secondary">
        Trái: light. Phải: dark (panel có class <code>dark</code>).
      </p>
      <div className="grid grid-cols-1 gap-space-lg xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-space-lg"><KitContent /></div>
        <div className="dark rounded-2xl border border-border bg-background p-space-lg"><KitContent /></div>
      </div>
    </div>
  )
}
