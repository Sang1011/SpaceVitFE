import type { Priority } from '../components/ui'

export type DueBucket = 'overdue' | 'today' | 'upcoming' | 'none' | 'done'
export type MyTaskTab = 'assigned' | 'created' | 'watching'

type Source = { kind: 'audio' | 'note' | 'document'; label: string; location?: string }

export interface TaskEntry {
  id: string
  title: string
  priority: Priority
  source?: Source
  dueLabel?: string
  bucket: DueBucket
  /** Chữ viết tắt người được giao. */
  assignee: { name: string; initials: string }
  /** Chữ viết tắt người tạo. */
  createdBy: string
  watching?: boolean
}

const NA = { name: 'Nguyễn Minh Anh', initials: 'NA' }
const QB = { name: 'Trần Quốc Bảo', initials: 'QB' }
const HL = { name: 'Lê Thu Hà', initials: 'HL' }

/** Toàn bộ việc. Là nguồn duy nhất cho trang Công việc của tôi, badge ở Sidebar và khối ở Tổng quan. */
export const allTasks: TaskEntry[] = [
  { id: 'o1', title: 'Hoàn thiện API đăng nhập & xác thực SSO', priority: 'urgent', source: { kind: 'audio', label: 'Họp sprint 12', location: '12:34' }, dueLabel: 'Hôm qua 18:00', bucket: 'overdue', assignee: NA, createdBy: 'QB' },
  { id: 'a2', title: 'Cập nhật bảng phân quyền theo vai trò', priority: 'high', source: { kind: 'document', label: 'Spec_v2.1.pdf', location: 'tr.12' }, dueLabel: '2 ngày trước', bucket: 'overdue', assignee: NA, createdBy: 'HL' },
  { id: 'o2', title: 'Review thiết kế Onboarding và luồng kích hoạt', priority: 'high', source: { kind: 'document', label: 'Spec_v2.1.pdf', location: 'tr.8' }, dueLabel: 'Hôm nay 15:30', bucket: 'today', assignee: NA, createdBy: 'HL' },
  { id: 'o3', title: 'Gửi báo cáo tiến độ tuần 41 cho ban giám đốc', priority: 'medium', source: { kind: 'note', label: 'Ghi chú Sprint 41' }, dueLabel: 'Hôm nay 18:00', bucket: 'today', assignee: NA, createdBy: 'NA' },
  { id: 'a3', title: 'Trả lời góp ý của khách hàng về bản demo', priority: 'medium', dueLabel: 'Hôm nay 17:00', bucket: 'today', assignee: NA, createdBy: 'QB' },
  { id: 'o4', title: 'Cập nhật sơ đồ kiến trúc vi dịch vụ & webhook', priority: 'low', source: { kind: 'document', label: 'Cloud_infra.pdf' }, dueLabel: 'Ngày mai 12:00', bucket: 'upcoming', assignee: NA, createdBy: 'NA' },
  { id: 'o5', title: 'Chuẩn bị tài liệu demo cho khách hàng', priority: 'medium', source: { kind: 'note', label: 'Ghi chú Sprint 41' }, dueLabel: 'Thứ Sáu 17:00', bucket: 'upcoming', assignee: NA, createdBy: 'NA' },
  { id: 'a4', title: 'Đối soát điều khoản SLA với bên cung ứng Cloud', priority: 'high', source: { kind: 'document', label: 'Hợp đồng Q4', location: 'Mục 4.2' }, dueLabel: '22/10', bucket: 'upcoming', assignee: NA, createdBy: 'HL' },
  { id: 'a5', title: 'Lên lịch phỏng vấn người dùng đợt 5', priority: 'low', dueLabel: '25/10', bucket: 'upcoming', assignee: NA, createdBy: 'NA' },
  { id: 'a6', title: 'Gom phản hồi về luồng duyệt việc đề xuất', priority: 'medium', source: { kind: 'audio', label: 'Họp sprint 12', location: '41:20' }, bucket: 'none', assignee: NA, createdBy: 'QB' },
  { id: 'a7', title: 'Viết hướng dẫn sử dụng cho nhóm kinh doanh', priority: 'low', bucket: 'none', assignee: NA, createdBy: 'NA' },
  { id: 'a8', title: 'Dọn các nhãn trùng trong Bảng công việc', priority: 'low', bucket: 'none', assignee: NA, createdBy: 'NA' },
  // Đã xong gần đây (không tính vào số việc đang mở).
  { id: 'd1', title: 'Sửa lỗi tải lên tệp âm thanh lớn', priority: 'high', dueLabel: 'Xong hôm qua', bucket: 'done', assignee: NA, createdBy: 'QB' },
  { id: 'd2', title: 'Viết biên bản họp kiến trúc Q3', priority: 'medium', dueLabel: 'Xong 12/10', bucket: 'done', assignee: NA, createdBy: 'NA' },
  // Việc của người khác.
  { id: 'o6', title: 'Viết kiểm thử tích hợp cho cổng thanh toán', priority: 'high', source: { kind: 'audio', label: 'Họp sprint 12', location: '31:05' }, dueLabel: 'Hôm nay 17:00', bucket: 'today', assignee: QB, createdBy: 'NA' },
  { id: 'c2', title: 'Soạn kế hoạch kiểm thử hồi quy', priority: 'medium', dueLabel: 'Thứ Tư', bucket: 'upcoming', assignee: HL, createdBy: 'NA' },
  { id: 'c3', title: 'Thiết kế lại màn hình lỗi chép lời', priority: 'low', bucket: 'none', assignee: QB, createdBy: 'NA' },
  { id: 'w1', title: 'Chuyển dữ liệu khách hàng sang kho mới', priority: 'urgent', dueLabel: 'Ngày mai 09:00', bucket: 'upcoming', assignee: QB, createdBy: 'HL', watching: true },
  { id: 'w2', title: 'Rà soát chính sách lưu trữ ghi âm', priority: 'medium', bucket: 'none', assignee: HL, createdBy: 'QB', watching: true },
]

export const ME = 'NA'

export const isOpen = (t: TaskEntry) => t.bucket !== 'done'
export const tasksFor = (tab: MyTaskTab): TaskEntry[] =>
  allTasks.filter((t) => (tab === 'assigned' ? t.assignee.initials === ME : tab === 'created' ? t.createdBy === ME && t.assignee.initials !== ME : t.watching))

/** Số việc đang mở giao cho tôi. */
export const myOpenCount = allTasks.filter((t) => t.assignee.initials === ME && isOpen(t)).length

export const bucketMeta: { key: DueBucket; label: string }[] = [
  { key: 'overdue', label: 'Quá hạn' },
  { key: 'today', label: 'Hôm nay' },
  { key: 'upcoming', label: 'Sắp tới' },
  { key: 'none', label: 'Không có hạn' },
  { key: 'done', label: 'Hoàn thành gần đây' },
]
