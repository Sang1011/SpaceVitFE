import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProcessingStepper } from '../../components/domain'
import { Banner, Button } from '../../components/ui'
import { useWorkspace } from '../../context/WorkspaceContext'
import { completedSteps, errorSteps, recGhosts, recordingMeta, startSec } from '../../mocks/recording'
import { AudioPlayer } from './AudioPlayer'
import { InsightsPanel } from './InsightsPanel'
import { RecordingHeader } from './RecordingHeader'
import { TranscriptPanel } from './TranscriptPanel'

/**
 * Recording detail (Stitch W6 + error variant). The error variant is state:
 * ?error=1 starts in PARTIAL_FAILED; "Thử lại" clears it. ?dev=1 (or dev mode) shows the demo bar.
 * Viewer: retry and ghost-task actions are locked.
 */
export default function RecordingPage() {
  const { canEdit } = useWorkspace()
  const [params] = useSearchParams()
  const [failed, setFailed] = useState(params.get('error') === '1')
  const [position, setPosition] = useState(startSec)
  const [ghosts, setGhosts] = useState(recGhosts)
  const insightsRef = useRef<HTMLDivElement>(null)
  const showDev = import.meta.env.DEV || params.get('dev') === '1'
  const locked = canEdit ? undefined : 'Bạn chỉ có quyền xem'
  const stable = useCallback((s: number) => setPosition(s), [])
  // Freeze playback when screenshots/demos ask for a static frame.
  const frozen = params.get('still') === '1'
  useEffect(() => { if (frozen) setPosition(startSec) }, [frozen])

  const retry = () => setFailed(false)
  const remove = (ids: string[]) => setGhosts((g) => g.filter((x) => !ids.includes(x.id)))

  return (
    <div className="space-y-space-lg">
      {showDev && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-2 font-caption text-caption text-text-secondary">
          Demo:
          <Button size="xs" variant="subtle" onClick={() => setFailed(!failed)}>{failed ? 'Chuyển sang Hoàn tất' : 'Chuyển sang Lỗi một phần'}</Button>
        </div>
      )}
      <RecordingHeader failed={failed} />
      {failed && (
        <Banner
          tone="error"
          solidIcon
          icon="error"
          badge="PARTIAL_FAILED"
          title="Lỗi bóc băng tại chunk 3 và chunk 7 (mất kết nối micro/mạng)"
          description="Các phân đoạn khác đã sẵn sàng. Bản ghi AI trích xuất được 4 việc cần làm từ các đoạn thành công."
          className="p-space-md"
          actions={
            <>
              <Button variant="destructive-outline" size="md" icon="info">Xem chi tiết lỗi</Button>
              <Button variant="destructive" size="md" icon="refresh" onClick={retry} lockedReason={locked}>Thử lại các phần lỗi</Button>
            </>
          }
        />
      )}
      <ProcessingStepper
        status={failed ? 'partial_failed' : 'completed'}
        summary={failed ? 'Lỗi một phần (85% hoàn thành)' : '100% Hoàn thành'}
        jobId={recordingMeta.jobId}
        steps={failed ? errorSteps : completedSteps}
      />
      <AudioPlayer position={frozen ? startSec : position} onPositionChange={stable} />
      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <div className="lg:col-span-7">
          <TranscriptPanel
            position={position}
            onSeek={setPosition}
            failed={failed}
            onRetry={retry}
            retryLocked={locked}
            onViewGhost={() => insightsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          />
        </div>
        <div className="lg:col-span-5">
          <InsightsPanel
            ref={insightsRef}
            ghosts={ghosts}
            onToggle={(id, v) => setGhosts((g) => g.map((x) => (x.id === id ? { ...x, checked: v } : x)))}
            onConfirm={remove}
            onDismiss={remove}
            lockedReason={locked}
          />
        </div>
      </div>
    </div>
  )
}
