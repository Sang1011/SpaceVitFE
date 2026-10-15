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

export const completedSteps: StepperStep[] = [
  { key: 'uploaded', label: 'Đã tải lên', detail: '100%', status: 'done' },
  { key: 'preprocessing', label: 'Đang chuẩn bị', detail: '12 chunks', status: 'done' },
  { key: 'transcribing', label: 'STT bóc băng', detail: 'Chính xác 98%', status: 'done' },
  { key: 'partial', label: 'Có kết quả 1 phần', detail: 'Đã đồng bộ', status: 'done' },
  { key: 'analyzing', label: 'Phân tích AI', detail: '4 actions', status: 'done' },
  { key: 'completed', label: 'Hoàn tất', detail: 'Sẵn sàng', status: 'final' },
]

export const errorSteps: StepperStep[] = [
  { key: 'uploaded', label: 'Đã tải lên', detail: '100% · 52:14', status: 'done' },
  { key: 'preprocessing', label: 'Đang chuẩn bị', detail: '12 chunks hoàn tất', status: 'done' },
  { key: 'transcribing', label: 'STT bóc băng', detail: '85% · 2 chunks lỗi', status: 'error' },
  { key: 'analyzing', label: 'Phân tích AI', detail: 'Tạm dừng / Chờ thử lại', status: 'paused' },
]

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
  { id: 's2', speaker: 'Trần Quốc Bảo', initials: 'QB', role: '', tone: 'ai', start: 12 * 60 + 34, text: 'Tôi đồng ý. Bản ghi âm này sau khi bóc băng xong sẽ sinh ra các ghost task có viền nét đứt màu tím để người dùng bấm xác nhận. Mọi nguồn gốc dữ liệu đều được đính kèm mốc thời gian cụ thể.', extracted: 1 },
  { id: 's3', speaker: 'Lê Thu Hà', initials: 'TH', role: 'QA Lead', tone: 'neutral', start: 13 * 60 + 2, text: 'Tài liệu hợp đồng cũng cần được quét OCR xong trước thứ Sáu tuần này. Em sẽ chủ động kiểm thử cơ chế bóc băng tiếng Việt với âm thanh môi trường nhiều tạp âm để đánh giá độ chính xác thực tế.' },
  { id: 's4', speaker: 'Nguyễn Minh Anh', initials: 'NA', role: 'Trưởng nhóm', tone: 'brand-muted', start: 13 * 60 + 48, text: 'Nhất trí. Nhớ gửi luôn bản hướng dẫn sử dụng cho nhóm kinh doanh để họ chuẩn bị giới thiệu trong buổi demo khách hàng ngày 22.' },
]

export interface FailedChunk { id: string; range: string; label: string; before: string }
/** `before` = id of the segment this error row is rendered before. */
export const failedChunks: FailedChunk[] = [
  { id: 'c3', range: '00:03:12 - 00:04:30', label: 'Chunk #3 lỗi mạng', before: 's1' },
  { id: 'c7', range: '00:08:45 - 00:09:55', label: 'Chunk #7 mất micro', before: 's2' },
]

export interface RecGhost {
  id: string
  title: string
  priority: Priority
  assignee?: { name: string; initials: string }
  date: string
  sourceAt: string
  checked: boolean
}

export const recGhosts: RecGhost[] = [
  { id: 'rg1', title: 'Hoàn thiện luồng xác nhận ghost task từ transcript', priority: 'high', assignee: { name: 'Trần Quốc Bảo', initials: 'QB' }, date: '18/10/2024', sourceAt: '12:34', checked: true },
  { id: 'rg2', title: 'Kiểm thử cơ chế bóc băng tiếng Việt với âm thanh nhiễu', priority: 'urgent', assignee: { name: 'Lê Thu Hà', initials: 'TH' }, date: '20/10/2024', sourceAt: '18:45', checked: true },
  { id: 'rg3', title: 'Gửi tài liệu hướng dẫn sử dụng cho nhóm kinh doanh', priority: 'medium', date: '22/10/2024', sourceAt: '13:48', checked: false },
]

export const insightTabs = [
  { key: 'summary', label: 'Tóm tắt' },
  { key: 'decisions', label: 'Quyết định' },
  { key: 'actions', label: 'Việc cần làm', badge: '✦ 4' },
  { key: 'keypoints', label: 'Điểm chính' },
]

export const summaryText = {
  summary: ['Nhóm thống nhất AI chỉ đề xuất, người dùng luôn xác nhận trước khi lưu thành task.', 'OCR hợp đồng cần xong trước thứ Sáu; bản hướng dẫn gửi nhóm kinh doanh trước demo ngày 22.'],
  decisions: ['Ghost task phải có viền nét đứt tím và cần bấm xác nhận.', 'Mọi nguồn dữ liệu đều đính kèm mốc thời gian.'],
  keypoints: ['Không tự ý ghi đè trạng thái đã chốt.', 'Kiểm thử bóc băng tiếng Việt với âm thanh nhiều tạp âm.'],
}
