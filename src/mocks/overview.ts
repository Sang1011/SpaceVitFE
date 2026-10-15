import type { Priority } from '../components/ui'

export const overviewStats = [
  { value: 18, label: 'Nhiệm vụ', tone: 'default' as const },
  { value: 3, label: 'Chờ duyệt ✦', tone: 'ai' as const },
  { value: 14, label: 'Bản ghi/OCR', tone: 'default' as const },
]

export const quickPrompts = [
  'Task nào đang quá hạn và ai phụ trách?',
  'Tóm tắt cuộc họp Sprint planning hôm qua',
  'Trích xuất điều khoản bảo mật hợp đồng Q4',
]

type Source = { kind: 'audio' | 'note' | 'document'; label: string; location?: string }
type Tone = 'container' | 'ai' | 'brand-muted' | 'neutral'

export interface MyTask {
  id: string
  title: string
  priority: Priority
  source: Source
  due: { label: string; overdue?: boolean }
  assignee: { name: string; initials: string; tone: Tone }
}

export const myTasks: MyTask[] = [
  { id: 'o1', title: 'Hoàn thiện API đăng nhập & xác thực SSO', priority: 'urgent', source: { kind: 'audio', label: 'Họp sprint 12', location: '12:34' }, due: { label: 'Quá hạn (Hôm qua 18:00)', overdue: true }, assignee: { name: 'Nguyễn Minh Anh', initials: 'NA', tone: 'container' } },
  { id: 'o2', title: 'Review thiết kế Onboarding và luồng kích hoạt', priority: 'high', source: { kind: 'document', label: 'Spec_v2.1.pdf', location: 'tr.8' }, due: { label: 'Hôm nay 15:30' }, assignee: { name: 'Trần Quốc Bảo', initials: 'QB', tone: 'ai' } },
  { id: 'o3', title: 'Gửi báo cáo tiến độ tuần 41 cho ban giám đốc', priority: 'medium', source: { kind: 'note', label: 'Ghi chú Sprint 41' }, due: { label: 'Hôm nay 18:00' }, assignee: { name: 'Lê Thu Hà', initials: 'TH', tone: 'neutral' } },
  { id: 'o4', title: 'Cập nhật sơ đồ kiến trúc vi dịch vụ & webhook', priority: 'low', source: { kind: 'document', label: 'Cloud_infra.pdf' }, due: { label: 'Ngày mai 12:00' }, assignee: { name: 'Nguyễn Minh Anh', initials: 'NA', tone: 'container' } },
]

export const overviewGhostTasks = [
  { id: 'g1', title: 'Gửi biên bản họp cho khách hàng trước 17:00', source: { kind: 'audio' as const, label: 'Bản ghi sprint', location: '48:10' }, note: 'Người thực hiện: Lê Thu Hà' },
  { id: 'g2', title: 'Đối soát điều khoản SLA 99.9% với bên cung ứng Cloud', source: { kind: 'document' as const, label: 'Hợp đồng Q4', location: 'Mục 4.2' }, note: 'Hạn chót: 15/10' },
]

export type RecentItem =
  | { id: string; kind: 'done'; icon: string; iconTone: 'success' | 'brand'; title: string; badge: string; meta: string[]; metaStrong?: number; ai?: boolean; action: { icon: string; label: string } }
  | { id: string; kind: 'processing'; title: string; jobId: string; eta: string; stage: string; detail: string; percent: number; queue: string }

export const recentItems: RecentItem[] = [
  { id: 'r1', kind: 'done', icon: 'graphic_eq', iconTone: 'success', title: 'Họp sprint planning tuần 41', badge: 'Hoàn tất', meta: ['56:14', '12 task đã tạo'], metaStrong: 1, ai: true, action: { icon: 'play_arrow', label: 'Nghe lại' } },
  { id: 'r2', kind: 'processing', title: 'Phỏng vấn người dùng #04', jobId: 'job_8F3A21', eta: 'Ước tính ~2 phút còn lại', stage: 'Đang chuyển giọng nói thành văn bản', detail: 'Tiến trình xử lý: Đoạn chunk 5/8', percent: 62, queue: 'Hàng đợi: STT Whisper v3-turbo' },
  { id: 'r3', kind: 'done', icon: 'picture_as_pdf', iconTone: 'brand', title: 'Hợp đồng dịch vụ đám mây Q4.pdf', badge: 'OCR Hoàn tất', meta: ['14 trang', '3 bảng tính biểu giá trích xuất', '1.8 MB'], action: { icon: 'visibility', label: 'Mở tài liệu' } },
]

export const activities = [
  { id: 'a1', dot: 'bg-status-success', who: 'Trần Quốc Bảo', text: 'đã hoàn thành nhiệm vụ', link: '#TK-89: Cập nhật icon hệ thống', time: '12 phút trước' },
  { id: 'a2', dot: 'bg-recording-red', who: 'Lê Thu Hà', text: 'đã tải lên bản ghi âm', strong: '"Phỏng vấn người dùng #04"', time: '28 phút trước' },
  { id: 'a3', dot: 'bg-ai-accent', who: 'Trợ lý AI', ai: true, text: 'đã tự động trích xuất 5 việc cần làm từ bản ghi Sprint', time: '45 phút trước · job_8F3A20' },
  { id: 'a4', dot: 'bg-brand', who: 'Nguyễn Minh Anh', text: 'đã gán nhãn', label: 'Sprint 41', after: 'cho 8 tài liệu', time: '2 giờ trước' },
]
