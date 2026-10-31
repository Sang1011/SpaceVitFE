import type { Priority } from '../components/ui'

export interface Citation { id: string; kind: 'audio' | 'note' | 'document'; label: string; location: string }

export interface TaskRow {
  id: string
  title: string
  priority: Priority
  assignee: { name: string; initials: string }
  due: { label: string; icon: string; overdue?: boolean }
  source: { kind: 'audio' | 'document'; label: string }
}

export type ReminderChannel = 'app' | 'email'
export const reminderChannels: { key: ReminderChannel; label: string }[] = [
  { key: 'app', label: 'Thông báo trong ứng dụng' },
  { key: 'email', label: 'Email' },
]

export interface ReminderProposal { content: string; when: string; space: string; channel: ReminderChannel }

/** Một ý trong câu trả lời, `cites` là số thứ tự nguồn (bắt đầu từ 1) hiện ngay sau câu. */
export interface AnswerPoint { bold: string; rest: string; cites: number[] }

export type ChatMessage =
  | { id: string; role: 'user'; text: string; time: string }
  | { id: string; role: 'ai'; kind: 'rag'; time: string; lead: string; points: AnswerPoint[]; citations: Citation[] }
  | { id: string; role: 'ai'; kind: 'data'; time: string; intro: { count: number; text: string }; rows: TaskRow[]; note: string }
  | { id: string; role: 'ai'; kind: 'action'; time: string; intro: string; proposal: ReminderProposal; state: 'pending' | 'confirmed' | 'cancelled' }
  | { id: string; role: 'ai'; kind: 'error'; time: string; text: string; retryText: string }

export const initialMessages: ChatMessage[] = [
  { id: 'm1', role: 'user', text: 'Quyết định cuối cùng về việc lưu trữ và cơ chế xử lý lỗi chép lời là gì?', time: '14:22' },
  {
    id: 'm2', role: 'ai', kind: 'rag', time: '14:22', lead: 'Theo các cuộc họp gần đây, nhóm đã thống nhất:',
    points: [
      { bold: 'Chép lời theo từng đoạn 30 giây', rest: ' và cho xem kết quả một phần ngay khi có.', cites: [1] },
      { bold: 'Khi lỗi mạng hoặc lỗi AI', rest: ', hệ thống chỉ thử lại các đoạn lỗi thay vì chạy lại từ đầu.', cites: [1, 2] },
    ],
    citations: [
      { id: 'c1', kind: 'audio', label: 'Họp sprint planning tuần 41', location: '12:34' },
      { id: 'c2', kind: 'note', label: 'Biên bản họp kiến trúc hệ thống Q4', location: 'Mục 2.3' },
    ],
  },
  { id: 'm3', role: 'user', text: 'Liệt kê các việc đang Khẩn cấp hoặc quá hạn trong sprint này?', time: '14:25' },
  {
    id: 'm4', role: 'ai', kind: 'data', time: '14:25', intro: { count: 2, text: 'cần xử lý sớm trong Sprint 41:' },
    rows: [
      { id: 'r1', title: 'Hoàn thiện API đăng nhập và OAuth2', priority: 'urgent', assignee: { name: 'Nguyễn Minh Anh', initials: 'NA' }, due: { label: 'Hôm qua · quá hạn', icon: 'event_busy', overdue: true }, source: { kind: 'document', label: 'Hợp đồng, tr.4' } },
      { id: 'r2', title: 'Kiểm thử chép lời tiếng Việt với âm thanh nhiễu', priority: 'high', assignee: { name: 'Lê Thu Hà', initials: 'HL' }, due: { label: 'Hôm nay 23:59', icon: 'schedule' }, source: { kind: 'audio', label: 'Họp sprint, 18:45' } },
    ],
    note: 'Số liệu lấy trực tiếp từ Bảng công việc',
  },
  { id: 'm5', role: 'user', text: 'Nhắc tôi gửi báo cáo tiến độ sprint cho ban giám đốc lúc 5 giờ chiều mai', time: '14:28' },
  {
    id: 'm6', role: 'ai', kind: 'action', time: '14:28', intro: 'Mình đã soạn một nhắc nhở. Kiểm tra rồi xác nhận để thêm vào lịch:',
    proposal: { content: 'Gửi báo cáo tiến độ sprint cho ban giám đốc', when: '17:00 · ngày mai (16/10)', space: 'Dự án Alpha', channel: 'app' }, state: 'pending',
  },
]

export interface Conversation { id: string; title: string; when: string; messages: ChatMessage[] }

export const initialConversations: Conversation[] = [
  { id: 'cv1', title: 'Quyết định kiến trúc và nhắc nhở', when: 'Hôm nay', messages: initialMessages },
  { id: 'cv2', title: 'Tóm tắt họp khách hàng Q4', when: 'Hôm qua', messages: [
    { id: 'o1', role: 'user', text: 'Tóm tắt họp khách hàng Q4', time: '09:10' },
    { id: 'o2', role: 'ai', kind: 'rag', time: '09:10', lead: 'Cuộc họp chốt hai điểm chính:', points: [
      { bold: 'Gia hạn hợp đồng thêm 12 tháng', rest: ' nếu hoàn tất OCR trước thứ Sáu.', cites: [1] },
    ], citations: [{ id: 'oc1', kind: 'audio', label: 'Họp khách hàng Q4', location: '08:12' }] },
  ] },
  { id: 'cv3', title: 'Tìm tài liệu hợp đồng', when: '3 ngày trước', messages: [] },
]

/** Câu hỏi gợi ý theo trang đang xem (dùng ở panel và trang Trợ lý). */
export const promptsByPage: Record<string, string[]> = {
  'Tổng quan': ['Việc nào đang quá hạn và ai phụ trách?', 'Có gì cần tôi duyệt hôm nay?'],
  'Ghi chú': ['Tóm tắt ghi chú này', 'Rút ra các việc cần làm'],
  'Ghi âm': ['Tóm tắt cuộc họp này', 'Liệt kê quyết định đã chốt'],
  'Bảng công việc': ['Việc nào chưa có người phụ trách?', 'Tóm tắt tiến độ sprint'],
  'Tài liệu': ['Tìm điều khoản bảo mật', 'Tóm tắt tài liệu mới nhất'],
}
export const fallbackPrompts = ['Việc nào đang quá hạn?', 'Tóm tắt cuộc họp hôm qua', 'Tìm tài liệu hợp đồng đám mây']
