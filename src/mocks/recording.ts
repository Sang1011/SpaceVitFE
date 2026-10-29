import type { StepperStep } from '../components/domain'
import type { Priority } from '../components/ui'

export const recordingMeta = {
  title: 'Họp sprint planning tuần 41 - Đội ngũ kỹ thuật & sản phẩm',
  date: '14/10/2024 · 09:30',
  duration: '52:14',
  durationSec: 52 * 60 + 14,
  language: 'Tiếng Việt',
  jobId: 'job_8F3A21',
}

export const startSec = 12 * 60 + 34

export const fmt = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export type RecStatus = 'completed' | 'processing' | 'partial_ready' | 'partial_failed' | 'failed'

export const recStatuses: { key: RecStatus; label: string }[] = [
  { key: 'completed', label: 'Hoàn tất' },
  { key: 'processing', label: 'Đang xử lý' },
  { key: 'partial_ready', label: 'Có kết quả một phần' },
  { key: 'partial_failed', label: 'Lỗi một phần' },
  { key: 'failed', label: 'Lỗi' },
]

export const completedSteps: StepperStep[] = [
  { key: 'uploaded', label: 'Đã tải lên', detail: '100%', status: 'done' },
  { key: 'preprocessing', label: 'Đã chuẩn bị', detail: '12 đoạn', status: 'done' },
  { key: 'transcribing', label: 'Chép lời', detail: 'Độ tin cậy trung bình', status: 'done' },
  { key: 'partial', label: 'Kết quả đầu tiên', detail: 'Đã đồng bộ', status: 'done' },
  { key: 'analyzing', label: 'Phân tích AI', detail: '3 việc đề xuất', status: 'done' },
  { key: 'completed', label: 'Hoàn tất', detail: 'Sẵn sàng', status: 'final' },
]

export const errorSteps: StepperStep[] = [
  { key: 'uploaded', label: 'Đã tải lên', detail: '100% · 52:14', status: 'done' },
  { key: 'preprocessing', label: 'Đã chuẩn bị', detail: '12 đoạn', status: 'done' },
  { key: 'transcribing', label: 'Chép lời', detail: '85% · 2 đoạn lỗi', status: 'error' },
  { key: 'analyzing', label: 'Phân tích AI', detail: 'Tạm dừng, chờ thử lại', status: 'paused' },
]

/** Các bước theo trạng thái xử lý (SRS §6.3). `progress` là phần trăm bước chép lời khi đang chạy. */
export function stepsFor(status: RecStatus, progress = 0): StepperStep[] {
  switch (status) {
    case 'completed':
      return completedSteps
    case 'partial_failed':
      return errorSteps
    case 'processing':
      return [
        { key: 'uploaded', label: 'Đã tải lên', detail: '100%', status: 'done' },
        { key: 'preprocessing', label: 'Đã chuẩn bị', detail: '12 đoạn', status: 'done' },
        { key: 'transcribing', label: 'Chép lời', detail: `${Math.round(progress)}%`, status: 'active' },
        { key: 'analyzing', label: 'Phân tích AI', detail: 'Chờ', status: 'pending' },
        { key: 'completed', label: 'Hoàn tất', status: 'pending' },
      ]
    case 'partial_ready':
      return [
        { key: 'uploaded', label: 'Đã tải lên', detail: '100%', status: 'done' },
        { key: 'preprocessing', label: 'Đã chuẩn bị', detail: '12 đoạn', status: 'done' },
        { key: 'transcribing', label: 'Chép lời', detail: '60% · đang tiếp tục', status: 'active' },
        { key: 'partial', label: 'Kết quả một phần', detail: 'Đã có thể xem', status: 'done' },
        { key: 'analyzing', label: 'Phân tích AI', detail: 'Chờ', status: 'pending' },
        { key: 'completed', label: 'Hoàn tất', status: 'pending' },
      ]
    case 'failed':
      return [
        { key: 'uploaded', label: 'Đã tải lên', detail: '100%', status: 'done' },
        { key: 'preprocessing', label: 'Đã chuẩn bị', detail: '12 đoạn', status: 'done' },
        { key: 'transcribing', label: 'Chép lời', detail: 'Không thành công', status: 'error' },
        { key: 'analyzing', label: 'Phân tích AI', detail: 'Chưa chạy', status: 'paused' },
      ]
  }
}

export interface Segment {
  id: string
  speaker: string
  initials: string
  role: string
  tone: 'brand-muted' | 'ai' | 'neutral'
  start: number
  text: string
  extracted?: number
}

export const segments: Segment[] = [
  { id: 's1', speaker: 'Nguyễn Minh Anh', initials: 'NA', role: 'Trưởng nhóm', tone: 'brand-muted', start: 12 * 60 + 15, text: 'Về phần tích hợp AI, chúng ta cần đảm bảo người dùng luôn kiểm tra lại kết quả trước khi hệ thống tự động lưu vào task. Không được tự ý ghi đè trạng thái đã chốt.' },
  { id: 's2', speaker: 'Trần Quốc Bảo', initials: 'QB', role: '', tone: 'ai', start: 12 * 60 + 34, text: 'Tôi đồng ý. Bản ghi âm này sau khi bóc băng xong sẽ sinh ra các việc đề xuất có viền nét đứt màu tím để người dùng bấm xác nhận. Mọi nguồn gốc dữ liệu đều được đính kèm mốc thời gian cụ thể.', extracted: 1 },
  { id: 's3', speaker: 'Lê Thu Hà', initials: 'TH', role: 'QA Lead', tone: 'neutral', start: 13 * 60 + 2, text: 'Tài liệu hợp đồng cũng cần được quét OCR xong trước thứ Sáu tuần này. Em sẽ chủ động kiểm thử cơ chế bóc băng tiếng Việt với âm thanh môi trường nhiều tạp âm để đánh giá độ chính xác thực tế.', extracted: 1 },
  { id: 's4', speaker: 'Nguyễn Minh Anh', initials: 'NA', role: 'Trưởng nhóm', tone: 'brand-muted', start: 13 * 60 + 48, text: 'Nhất trí. Nhớ gửi luôn bản hướng dẫn sử dụng cho nhóm kinh doanh để họ chuẩn bị giới thiệu trong buổi demo khách hàng ngày 22.', extracted: 1 },
]

export interface FailedChunk { id: string; range: string; label: string; before: string }
/** `before` = id of the segment this error row is rendered before. */
export const failedChunks: FailedChunk[] = [
  { id: 'c3', range: '03:12 - 04:30', label: 'Đoạn 3: lỗi mạng', before: 's1' },
  { id: 'c7', range: '08:45 - 09:55', label: 'Đoạn 7: mất micro', before: 's2' },
]

export interface RecGhost {
  id: string
  title: string
  priority: Priority
  /** Tên người phụ trách, rỗng nếu chưa gán. */
  assignee: string
  /** Hạn dạng yyyy-MM-dd, rỗng nếu chưa có. */
  due: string
  sourceAt: string
  /** Người/hạn do AI suy ra từ lời thoại; mất cờ này khi người dùng tự sửa. */
  inferred: { assignee: boolean; due: boolean }
  checked: boolean
}

export const recGhosts: RecGhost[] = [
  { id: 'rg1', title: 'Hoàn thiện luồng duyệt việc đề xuất từ bản chép lời', priority: 'high', assignee: 'Trần Quốc Bảo', due: '2024-10-18', sourceAt: '12:34', inferred: { assignee: true, due: false }, checked: false },
  { id: 'rg2', title: 'Kiểm thử cơ chế chép lời tiếng Việt với âm thanh nhiễu', priority: 'urgent', assignee: 'Lê Thu Hà', due: '2024-10-20', sourceAt: '13:02', inferred: { assignee: true, due: true }, checked: false },
  { id: 'rg3', title: 'Gửi tài liệu hướng dẫn sử dụng cho nhóm kinh doanh', priority: 'medium', assignee: '', due: '2024-10-22', sourceAt: '13:48', inferred: { assignee: false, due: true }, checked: false },
]

export const insightTabs = [
  { key: 'summary', label: 'Tóm tắt' },
  { key: 'decisions', label: 'Quyết định' },
  { key: 'actions', label: 'Việc đề xuất' },
  { key: 'keypoints', label: 'Điểm chính' },
]

/** `at` là mốc giây trong ghi âm để nhảy tới đoạn gốc. */
export interface InsightLine {
  text: string
  at: number
}

export const summaryText: Record<'summary' | 'decisions' | 'keypoints', InsightLine[]> = {
  summary: [
    { text: 'Nhóm thống nhất AI chỉ đề xuất, người dùng luôn xác nhận trước khi lưu thành việc.', at: 12 * 60 + 15 },
    { text: 'OCR hợp đồng cần xong trước thứ Sáu; bản hướng dẫn gửi nhóm kinh doanh trước demo ngày 22.', at: 13 * 60 + 2 },
  ],
  decisions: [
    { text: 'Việc đề xuất phải có viền nét đứt tím và cần bấm xác nhận.', at: 12 * 60 + 34 },
    { text: 'Mọi nguồn dữ liệu đều đính kèm mốc thời gian.', at: 12 * 60 + 34 },
  ],
  keypoints: [
    { text: 'Không tự ý ghi đè trạng thái đã chốt.', at: 12 * 60 + 15 },
    { text: 'Kiểm thử chép lời tiếng Việt với âm thanh nhiều tạp âm.', at: 13 * 60 + 2 },
  ],
}

export interface RecordingListItem {
  id: string
  title: string
  date: string
  duration: string
  status: RecStatus
  suggested: number
  progress?: number
}

export const recordingList: RecordingListItem[] = [
  { id: 'demo', title: 'Họp sprint planning tuần 41', date: '14/10/2024 · 09:30', duration: '52:14', status: 'completed', suggested: 3 },
  { id: 'r2', title: 'Phỏng vấn người dùng #04', date: '14/10/2024 · 15:10', duration: '38:20', status: 'processing', suggested: 0, progress: 62 },
  { id: 'r3', title: 'Họp khách hàng Q4', date: '12/10/2024 · 10:00', duration: '31:02', status: 'partial_failed', suggested: 4 },
  { id: 'r4', title: 'Ghi chú giọng nói về kiến trúc', date: '11/10/2024 · 17:45', duration: '07:48', status: 'completed', suggested: 1 },
]

export const languages = ['Tiếng Việt', 'English'] as const
export type RecLanguage = (typeof languages)[number]

/** Đoạn thoại đang phát tại `position` (giây). */
export function segmentAt(position: number): Segment {
  return [...segments].reverse().find((s) => s.start <= position) ?? segments[0]
}
