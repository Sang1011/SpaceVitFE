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

export interface ReminderProposal { content: string; when: string; space: string }

export type ChatMessage =
  | { id: string; role: 'user'; text: string; time: string }
  | { id: string; role: 'ai'; kind: 'rag'; time: string; lead: string; points: { bold: string; rest: string }[]; citations: Citation[]; verified: number }
  | { id: string; role: 'ai'; kind: 'data'; time: string; intro: { count: number; text: string }; rows: TaskRow[]; note: string }
  | { id: string; role: 'ai'; kind: 'action'; time: string; intro: string; proposal: ReminderProposal; state: 'pending' | 'confirmed' | 'cancelled' }

export const initialMessages: ChatMessage[] = [
  { id: 'm1', role: 'user', text: 'Quyết định cuối cùng về việc lưu trữ và cơ chế xử lý lỗi bóc băng STT là gì?', time: '14:22' },
  {
    id: 'm2', role: 'ai', kind: 'rag', time: '14:22', lead: 'Dựa trên các cuộc họp gần đây, nhóm đã thống nhất:',
    points: [
      { bold: 'Hệ thống sẽ bóc băng STT theo từng phân đoạn (chunking 30s)', rest: ' và cho phép người dùng xem kết quả một phần ngay lập tức.' },
      { bold: 'Khi gặp sự cố mạng hoặc lỗi AI', rest: ', hệ thống không chạy lại từ đầu mà kích hoạt cơ chế chỉ thử lại các phần lỗi (retry failed chunks).' },
    ],
    citations: [
      { id: 'c1', kind: 'audio', label: 'Họp sprint planning tuần 41', location: '12:34' },
      { id: 'c2', kind: 'note', label: 'Ghi chú kiến trúc hệ thống Q4', location: 'Mục 2.3' },
    ],
    verified: 2,
  },
  { id: 'm3', role: 'user', text: 'Liệt kê các task đang có độ ưu tiên Khẩn cấp và Quá hạn trong sprint này?', time: '14:25' },
  {
    id: 'm4', role: 'ai', kind: 'data', time: '14:25:04', intro: { count: 2, text: 'cần can thiệp khẩn cấp trong Sprint 41:' },
    rows: [
      { id: 'r1', title: 'Hoàn thiện API đăng nhập & OAuth2', priority: 'urgent', assignee: { name: 'Nguyễn Minh Anh', initials: 'NA' }, due: { label: 'Hôm qua (Quá hạn)', icon: 'alarm', overdue: true }, source: { kind: 'document', label: 'Hợp đồng tr.4' } },
      { id: 'r2', title: 'Kiểm thử bóc băng tiếng Việt môi trường ồn', priority: 'high', assignee: { name: 'Lê Thu Hà', initials: 'LH' }, due: { label: 'Hôm nay (23:59)', icon: 'schedule' }, source: { kind: 'audio', label: 'Họp sprint · 18:45' } },
    ],
    note: 'Đồng bộ 2 chiều với Kanban Board',
  },
  { id: 'm5', role: 'user', text: 'Nhắc tôi gửi báo cáo tiến độ sprint cho ban giám đốc lúc 5 giờ chiều mai', time: '14:28' },
  {
    id: 'm6', role: 'ai', kind: 'action', time: '14:28', intro: 'Tôi đã phân tích lệnh và tạo bản nháp nhắc nhở. Vui lòng kiểm tra và xác nhận để ghi vào lịch:',
    proposal: { content: 'Gửi báo cáo tiến độ sprint cho ban giám đốc', when: '17:00 · Ngày mai (16/10)', space: 'Dự án Alpha' }, state: 'pending',
  },
]

export const assistantPrompts = ['Task nào đang quá hạn?', 'Tóm tắt cuộc họp hôm qua', 'Tìm tài liệu hợp đồng đám mây']
