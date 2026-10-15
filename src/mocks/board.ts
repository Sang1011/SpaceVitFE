import type { BoardColumnData, BoardTask, TaskDetail } from '../types/board'

const NA = { initials: 'NA', name: 'Nguyễn Minh Anh', tone: 'container' } as const
const QB = { initials: 'QB', name: 'Trần Quốc Bảo', tone: 'primary' } as const
const LH = { initials: 'LH', name: 'Lê Thu Hà', tone: 'ai' } as const
const HL = { initials: 'HL', name: 'Lê Thu Hà', tone: 'ai' } as const
const TM = { initials: 'TM', name: 'Trần Minh', tone: 'muted' } as const
const TM2 = { initials: 'TM', name: 'Trần Minh', tone: 'neutral' } as const
const DQ = { initials: 'ĐQ', name: 'Đặng Quang', tone: 'primary' } as const

export const boardColumns: BoardColumnData[] = [
  {
    key: 'todo',
    title: 'Cần làm',
    tone: 'neutral',
    tasks: [
      { id: 't1', title: 'Thiết kế module tích hợp OCR nhận diện biên bản PDF', priority: 'high', labels: [{ text: 'AI', tone: 'primary' }, { text: 'Backend', tone: 'neutral' }], source: { icon: 'description', text: 'Hợp đồng tr.3' }, due: { label: '24/10' }, assignee: QB },
      { id: 't2', title: 'Kiểm thử chịu tải STT Streaming 50 người cùng tham gia', priority: 'medium', labels: [{ text: 'Backend', tone: 'neutral' }], source: { icon: 'mic', text: '04:15', mono: true }, due: { label: '26/10' }, assignee: LH },
      { id: 't3', title: 'Chuẩn hóa bộ Icon Semantic theo spec Material Symbols', priority: 'low', labels: [{ text: 'Frontend', tone: 'primary' }], source: { icon: 'notes', text: 'Sprint Note', bare: true }, due: { label: '30/10' }, assignee: TM },
      { id: 't4', title: 'Tối ưu truy vấn vector database Pinecone cho Space search', priority: 'high', labels: [{ text: 'AI', tone: 'primary' }], source: { icon: 'mic', text: '42:10', mono: true }, due: { label: '02/11' }, assignee: DQ },
    ],
  },
  {
    key: 'doing',
    title: 'Đang thực hiện',
    tone: 'solid',
    tasks: [
      { id: 't5', title: 'Hoàn thiện luồng xác nhận ghost task từ transcript ghi âm', priority: 'high', labels: [{ text: '✦ AI Core', tone: 'ai' }, { text: 'Frontend', tone: 'primary' }], source: { icon: 'mic', text: '12:34', mono: true, iconBrand: true }, due: { label: '18/10', overdue: true }, assignee: NA },
      { id: 't6', title: 'Tái cấu trúc API WebSocket audio chunking cho trình duyệt', priority: 'urgent', labels: [{ text: 'Backend', tone: 'neutral' }], source: { icon: 'mic', text: '09:12', mono: true }, due: { label: '21/10' }, assignee: HL },
      { id: 't7', title: 'Tích hợp Waveform động Canvas khi người dùng bấm ghi âm', priority: 'medium', labels: [{ text: 'Frontend', tone: 'primary' }], source: { icon: 'notes', text: 'SRS v2.1', bare: true }, due: { label: '25/10' }, assignee: TM2 },
    ],
  },
  {
    key: 'review',
    title: 'Đang đánh giá / AI đối soát',
    tone: 'ai',
    tasks: [
      { id: 't8', title: '✦ Tự động trích xuất Action Items từ tài liệu cuộc họp ISO', priority: 'high', labels: [{ text: '✦ AI Review', tone: 'ai' }, { text: 'Backend', tone: 'neutral' }], source: { icon: 'description', text: 'ISO_9001.pdf' }, due: { label: '19/10' }, assignee: QB, aiReview: true },
      { id: 't9', title: 'Review phân quyền Space Viewer: Ẩn triệt để thanh công cụ sửa', priority: 'medium', labels: [{ text: 'Frontend', tone: 'primary' }], source: { icon: 'mic', text: '31:02', mono: true }, due: { label: '20/10' }, assignee: NA },
    ],
  },
  {
    key: 'done',
    title: 'Hoàn thành',
    tone: 'success',
    hidden: 3,
    tasks: [
      { id: 't10', title: 'Khởi tạo Repo monorepo & Thiết lập Tailwind tokens chuẩn', labels: [{ text: 'Frontend', tone: 'neutral' }], source: { icon: 'task_alt', text: 'Sprint 40', bare: true }, assignee: DQ },
      { id: 't11', title: 'Viết API kết nối Microservice Speech-To-Text với Whisper v3', labels: [{ text: 'AI', tone: 'primary' }], source: { icon: 'description', text: 'Arch_Specs.md', bare: true }, assignee: HL },
      { id: 't12', title: 'Cập nhật bảng màu Brand: Khóa phổ tím chỉ dành cho AI', labels: [], doneLabel: 'Xong 14/10', assignee: NA },
    ],
  },
]

export const selectedTaskId = 't5'

/** Detail content of the selected task (the Stitch drawer shows only this one; other tasks get generated stubs). */
export const taskDetails: Record<string, TaskDetail> = {
  t5: {
    title: 'Hoàn thiện luồng xác nhận ghost task từ transcript ghi âm',
    code: 'TASK-841',
    statusLabel: 'Đang thực hiện',
    createdNote: 'Tạo bởi Trợ lý AI và được xác nhận bởi Nguyễn Minh Anh • 14:20, 16/10/2024',
    source: {
      title: 'Bản ghi âm: Họp sprint planning tuần 41',
      location: 'Mốc 12:34',
      quote: '“Tôi đồng ý. Bản ghi âm này sau khi bóc băng xong sẽ sinh ra các ghost task có viền nét đứt màu tím để người dùng bấm xác nhận.”',
    },
    assignee: NA,
    due: { label: '18/10/2024 (Quá hạn)', overdue: true },
    priorityLabel: 'High (Ưu tiên cao)',
    labels: [{ text: 'UI/UX', tone: 'primary' }, { text: 'AI Core', tone: 'ai' }],
    description: 'Cần triển khai thành phần Ghost Task hiển thị ngay bên dưới danh sách transcript. Cho phép người dùng duyệt hàng loạt hoặc duyệt từng tác vụ trực tiếp trên bảng.',
    checklist: [
      { text: 'Tạo CSS token viền nét đứt màu tím 1.5px dashed #7C4DFF', done: true },
      { text: 'Nút bấm Xác nhận (Confirm) và Bỏ qua (Dismiss)', done: true },
      { text: 'Kết nối Socket trigger chuyển thẻ từ AI Suggestion sang Kanban board', done: false },
      { text: 'Gắn kèm thẻ metadata citation chip (nguồn âm thanh + mốc giây)', done: false },
    ],
    comments: [
      { author: LH, authorLabel: 'Lê Thu Hà (AI Team)', time: 'Hôm qua lúc 16:45', text: 'Backend đã expose xong webhook trả về timestamp chuẩn. Đã test với bản ghi họp sprint tuần 41 mốc 12:34 hoàn toàn khớp payload nhé!' },
      { author: NA, authorLabel: 'Nguyễn Minh Anh', time: '10 phút trước', text: 'Tuyệt vời! Tôi đang hoàn tất tương tác click chip nhảy thẳng tới audio player để QA test luôn chiều nay.' },
    ],
    lastActivity: 'Hoạt động gần nhất 10 phút trước',
  },
}

const statusByColumn = { todo: 'Cần làm', doing: 'Đang thực hiện', review: 'Đang đánh giá', done: 'Hoàn thành' } as const

/** Detail for any task: the real one for t5, a generated stub for the others. */
export function getTaskDetail(task: BoardTask, column: keyof typeof statusByColumn): TaskDetail {
  const known = taskDetails[task.id]
  if (known) return { ...known, statusLabel: statusByColumn[column] }
  const n = task.id.replace('t', '')
  return {
    title: task.title,
    code: `TASK-${830 + Number(n)}`,
    statusLabel: statusByColumn[column],
    createdNote: 'Tạo bởi Nguyễn Minh Anh • 09:00, 14/10/2024',
    assignee: task.assignee,
    due: task.due ? { label: task.due.label, overdue: task.due.overdue } : { label: 'Chưa đặt hạn' },
    priorityLabel: task.priority ? { urgent: 'Urgent (Khẩn cấp)', high: 'High (Ưu tiên cao)', medium: 'Medium (Trung bình)', low: 'Low (Thấp)' }[task.priority] : 'Chưa đặt',
    labels: task.labels,
    description: 'Chưa có mô tả cho công việc này.',
    checklist: [],
    comments: [],
    lastActivity: 'Chưa có hoạt động',
  }
}
