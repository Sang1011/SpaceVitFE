import { Link } from 'react-router-dom'
import { Button, Icon, IconButton, StatusChip } from '../../components/ui'
import { languages, recordingMeta, type RecLanguage, type RecStatus } from '../../mocks/recording'

export interface RecordingHeaderProps {
  status: RecStatus
  language: RecLanguage
  onLanguageChange: (l: RecLanguage) => void
  /** Viewer: không đổi được ngôn ngữ. */
  readOnly?: boolean
}

/** Tiêu đề và thông tin ghi âm gộp một khối; mã tiến trình không hiện ở đây. */
export function RecordingHeader({ status, language, onLanguageChange, readOnly }: RecordingHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-space-md rounded-xl bg-surface p-space-md shadow-sm md:flex-row md:items-center lg:px-space-lg">
      <div className="min-w-0 space-y-1">
        <Link to="/ghi-am" className="inline-flex items-center gap-1 font-caption text-caption text-text-secondary transition-colors hover:text-text-primary">
          <Icon name="arrow_back" size={16} />
          Tất cả ghi âm
        </Link>
        <h1 className="font-section-title text-section-title text-text-primary">{recordingMeta.title}</h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-caption text-caption text-text-secondary">
          <span>{recordingMeta.date}</span>
          <span aria-hidden="true">·</span>
          <span>{recordingMeta.duration}</span>
          <span aria-hidden="true">·</span>
          <label className="inline-flex items-center gap-1.5">
            <Icon name="translate" size={16} />
            <span className="sr-only">Ngôn ngữ nhận diện</span>
            <select
              value={language}
              disabled={readOnly}
              onChange={(e) => onLanguageChange(e.target.value as RecLanguage)}
              className="rounded-md bg-transparent py-0.5 pr-1 font-caption text-caption text-text-primary outline-none hover:bg-surface-variant focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed"
            >
              {languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </label>
          <StatusChip status={status} size="sm" />
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
