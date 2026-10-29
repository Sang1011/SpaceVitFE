import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import type { SuggestionPatch } from '../../components/domain'
import { Banner, Button, useToast } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { recGhosts, recStatuses, recordingList, startSec, type RecGhost, type RecLanguage, type RecStatus } from '../../mocks/recording'
import { AudioPlayer } from './AudioPlayer'
import { InsightsPanel } from './InsightsPanel'
import { ProcessingSummary } from './ProcessingSummary'
import { RecordingHeader } from './RecordingHeader'
import { TranscriptPanel } from './TranscriptPanel'

const validStates = recStatuses.map((s) => s.key)

function initialStatus(state: string | null, error: string | null, id: string | undefined): RecStatus {
  if (state && (validStates as string[]).includes(state)) return state as RecStatus
  if (error === '1') return 'partial_failed'
  return recordingList.find((r) => r.id === id)?.status ?? 'completed'
}

/**
 * Chi tiết ghi âm. Trạng thái xử lý: completed, processing, partial_ready, partial_failed, failed
 * (?state=... hoặc ?error=1 để mở sẵn). Viewer: thử lại, đổi ngôn ngữ và duyệt việc đề xuất bị khóa.
 */
export default function RecordingPage() {
  const { canEdit, members, setRole } = useWorkspace()
  const { toast } = useToast()
  const { id } = useParams()
  const [params] = useSearchParams()
  const [rawStatus, setStatus] = useState<RecStatus>(() => initialStatus(params.get('state'), params.get('error'), id))
  const [progress, setProgress] = useState(62)
  const [language, setLanguage] = useState<RecLanguage>('Tiếng Việt')
  const [position, setPosition] = useState(startSec)
  const [ghosts, setGhosts] = useState<RecGhost[]>(recGhosts)
  const [speakers, setSpeakers] = useState<Record<string, string>>({})
  const [tab, setTab] = useState(() => (recGhosts.length > 0 ? 'actions' : 'summary'))
  const [jump, setJump] = useState<{ sec: number; n: number } | null>(null)
  const insightsRef = useRef<HTMLDivElement>(null)
  const showDev = import.meta.env.DEV || params.get('dev') === '1'
  const locked = canEdit ? undefined : 'Bạn chỉ có quyền xem'
  const stable = useCallback((s: number) => setPosition(s), [])
  const frozen = params.get('still') === '1'

  useEffect(() => {
    if (params.get('role') === 'viewer') setRole('viewer')
  }, [params, setRole])

  // Giả lập xử lý: tiến độ tăng dần rồi chuyển sang hoàn tất (cập nhật trong callback của timer).
  useEffect(() => {
    if (rawStatus !== 'processing') return
    const t = setInterval(() => {
      setProgress((p) => Math.min(100, p + 8))
    }, 1200)
    return () => clearInterval(t)
  }, [rawStatus])
  const status: RecStatus = rawStatus === 'processing' && progress >= 100 ? 'completed' : rawStatus

  const changeStatus = (s: RecStatus) => {
    setProgress(s === 'processing' ? 20 : 100)
    setStatus(s)
  }
  const changeLanguage = (l: RecLanguage) => {
    if (l === language) return
    setLanguage(l)
    setProgress(10)
    setStatus('processing')
    toast({ message: `Đang chép lời lại bằng ${l}. Kết quả cũ sẽ được thay thế khi xong.` })
  }
  const retry = () => {
    toast({ message: 'Đang thử lại các đoạn lỗi.' })
    changeStatus('processing')
  }
  const retryAll = () => {
    toast({ message: 'Đang xử lý lại ghi âm.' })
    changeStatus('processing')
  }

  const jumpTo = (sec: number) => {
    setPosition(sec)
    setJump((j) => ({ sec, n: (j?.n ?? 0) + 1 }))
  }
  const showSuggestions = () => {
    setTab('actions')
    insightsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const patch = (idv: string, p: SuggestionPatch) =>
    setGhosts((g) =>
      g.map((x) =>
        x.id === idv
          ? { ...x, ...p, inferred: { assignee: p.assignee !== undefined ? false : x.inferred.assignee, due: p.due !== undefined ? false : x.inferred.due } }
          : x,
      ),
    )
  const toggle = (idv: string, v: boolean) => setGhosts((g) => g.map((x) => (x.id === idv ? { ...x, checked: v } : x)))
  const toggleAll = (v: boolean) => setGhosts((g) => g.map((x) => ({ ...x, checked: v })))

  const removeWithUndo = (ids: string[], verb: string) => {
    const before = ghosts
    setGhosts((g) => g.filter((x) => !ids.includes(x.id)))
    toast({
      message: `Đã ${verb} ${ids.length} việc đề xuất`,
      tone: 'success',
      action: { label: 'Hoàn tác', onClick: () => setGhosts((cur) => before.filter((b) => cur.some((c) => c.id === b.id) || ids.includes(b.id)).map((b) => cur.find((c) => c.id === b.id) ?? { ...b, checked: false })) },
    })
  }

  const memberNames = members.map((m) => m.name)
  const hasBanner = status === 'partial_failed' || status === 'failed'

  return (
    <div className="space-y-space-md">
      {showDev && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border p-2 font-caption text-caption text-text-secondary">
          Demo trạng thái:
          {recStatuses.map((s) => (
            <Button key={s.key} size="xs" variant={status === s.key ? 'primary' : 'subtle'} onClick={() => changeStatus(s.key)}>
              {s.label}
            </Button>
          ))}
        </div>
      )}
      <RecordingHeader status={status} language={language} onLanguageChange={changeLanguage} readOnly={!canEdit} />
      {status === 'partial_failed' && (
        <Banner
          tone="error"
          solidIcon
          icon="error"
          title="Không chép được đoạn 3 và đoạn 7 (lỗi mạng, mất micro)"
          description="Các đoạn khác đã sẵn sàng. AI đã đề xuất 3 việc từ các đoạn chép thành công."
          className="p-space-md"
          actions={<Button variant="destructive" size="md" icon="refresh" onClick={retry} lockedReason={locked}>Thử lại các đoạn lỗi</Button>}
        />
      )}
      {status === 'failed' && (
        <Banner
          tone="error"
          solidIcon
          icon="error"
          title="Không xử lý được ghi âm này"
          description="Có thể tệp bị hỏng hoặc mạng bị gián đoạn. Thử lại, nếu vẫn lỗi hãy tải lên lại tệp."
          className="p-space-md"
          actions={<Button variant="destructive" size="md" icon="refresh" onClick={retryAll} lockedReason={locked}>Thử lại</Button>}
        />
      )}
      <ProcessingSummary status={status} progress={progress} />
      {!hasBanner || status === 'partial_failed' ? <AudioPlayer frozen={frozen} position={frozen ? startSec : position} onPositionChange={stable} /> : null}
      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <div className="lg:col-span-7">
          <TranscriptPanel
            status={status}
            position={position}
            onSeek={setPosition}
            jump={jump}
            speakers={speakers}
            onRename={(ini, name) => {
              setSpeakers((s) => ({ ...s, [ini]: name }))
              toast({ message: `Đã đổi tên người nói thành "${name}" ở mọi đoạn.` })
            }}
            onRetry={retry}
            retryLocked={locked}
            readOnly={!canEdit}
            onViewSuggestions={showSuggestions}
          />
        </div>
        <div className="lg:col-span-5">
          <InsightsPanel
            ref={insightsRef}
            status={status}
            tab={tab}
            onTabChange={setTab}
            ghosts={ghosts}
            members={memberNames}
            onToggle={toggle}
            onToggleAll={toggleAll}
            onChange={patch}
            onConfirm={(ids) => removeWithUndo(ids, 'tạo')}
            onDismiss={(ids) => removeWithUndo(ids, 'bỏ qua')}
            onJump={jumpTo}
            readOnly={!canEdit}
            lockedReason={locked}
          />
        </div>
      </div>
    </div>
  )
}
