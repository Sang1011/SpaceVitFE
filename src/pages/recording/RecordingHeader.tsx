import { Link } from 'react-router-dom'
import { Badge, Button, Icon, IconButton } from '../../components/ui'
import { recordingMeta } from '../../mocks/recording'

export function RecordingHeader({ failed }: { failed: boolean }) {
  return (
    <header className="flex flex-col justify-between gap-space-md rounded-xl bg-surface p-space-lg shadow-sm md:flex-row md:items-center">
      <div className="space-y-space-xs">
        <div className="flex flex-wrap items-center gap-space-sm text-text-secondary">
          <Link to="/ghi-am" className="inline-flex items-center gap-1 font-caption text-caption transition-colors hover:text-text-primary">
            <Icon name="arrow_back" size={16} />
            <span>Bản ghi âm</span>
          </Link>
          <span>•</span>
          <span className="font-label-mono text-label-mono">{recordingMeta.date}</span>
        </div>
        <h1 className="font-display-title text-display-title tracking-tight text-text-primary">{recordingMeta.title}</h1>
        <div className="flex flex-wrap items-center gap-space-sm pt-1">
          <Badge size="md" mono icon="timer">{recordingMeta.duration}</Badge>
          <Badge size="md" icon="translate">{recordingMeta.language}</Badge>
          {failed ? (
            <Badge tone="error" size="md" dot>Lỗi một phần (2 chunks)</Badge>
          ) : (
            <Badge tone="success" size="md" dot>Hoàn tất</Badge>
          )}
          <Badge size="md" mono icon="tag">{recordingMeta.jobId}</Badge>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-space-sm self-start md:self-auto">
        <Button variant="subtle" size="md" icon="download" className="text-text-primary">Xuất dữ liệu</Button>
        <Button variant="subtle" size="md" icon="share" className="text-text-primary">Chia sẻ</Button>
        <IconButton variant="filled" icon="more_vert" label="Thêm tùy chọn" />
      </div>
    </header>
  )
}
