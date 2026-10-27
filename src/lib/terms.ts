/** Thuật ngữ giao diện (quyết định D1). Mọi màn dùng chung các chuỗi này để không lẫn "việc/task/nhiệm vụ". */
import type { Priority } from '../components/ui/PriorityDot'

export const priorityLabelVi: Record<Priority, string> = {
  urgent: 'Khẩn cấp',
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
}

export const terms = {
  task: 'Việc',
  tasks: 'Việc',
  recording: 'Ghi âm',
  transcript: 'Bản chép lời',
  document: 'Tài liệu',
  note: 'Ghi chú',
  ghostTask: 'Việc đề xuất',
  suggestion: 'Gợi ý',
} as const
