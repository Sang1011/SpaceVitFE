export interface NoteBlock { id: string; kind: 'h2' | 'p' | 'pmuted'; text: string }

export interface NoteMeta { id: string; title: string; when: string; folder: string }
export interface Folder { id: string; name: string; count: number }

export const folders: Folder[] = [
  { id: 'plan', name: 'Kế hoạch sản phẩm', count: 4 },
  { id: 'meet', name: 'Họp định kỳ', count: 3 },
  { id: 'tech', name: 'Tài liệu kỹ thuật', count: 8 },
]

export const notesList: NoteMeta[] = [
  { id: 'n1', title: 'Biên bản họp kiến trúc hệ thống Q4', when: '15 phút trước', folder: 'meet' },
  { id: 'n2', title: 'Họp Sprint tuần 40 - Đánh giá KPI', when: 'Hôm qua', folder: 'meet' },
  { id: 'n3', title: 'Tổng kết Retro Release v2.4', when: '2 ngày trước', folder: 'meet' },
]

export const tags = [
  { label: '#Architecture', ai: false },
  { label: '#AI-Pipeline', ai: true },
  { label: '#Q4', ai: false },
]

export const mainNote = {
  title: 'Biên bản họp kiến trúc hệ thống Q4 - Microservices & AI Pipeline',
  blocks: [
    { id: 'h1', kind: 'h2', text: '1. Tổng quan & Bối cảnh kỹ thuật' },
    { id: 'p1', kind: 'pmuted', text: 'Nhằm đáp ứng lượng truy cập xử lý âm thanh đồng thời tăng 300% cho chu kỳ Q4, toàn bộ kiến trúc xử lý tác vụ thông minh (Smart Worker) được chuyển đổi sang mô hình module hóa phi đồng bộ trên nền tảng đám mây. Trọng tâm là giải quyết nút thắt cổ chai ở bước chuyển đổi âm thanh và sinh embedding tóm tắt thời gian thực.' },
    { id: 'h2', kind: 'h2', text: '2. Yêu cầu chuẩn hóa luồng xử lý STT (Speech-to-Text)' },
    { id: 'p2', kind: 'pmuted', text: 'Tại phiên thảo luận lúc 14:15 cùng đội ngũ Core-Backend và AI Engineering, các bên đã thống nhất tiêu chuẩn thời gian phản hồi:' },
    { id: 'p3', kind: 'p', text: 'Hệ thống cần xử lý STT thật nhanh để user không phải đợi lâu quá, nếu lỗi thì phải cho thử lại mấy đoạn hỏng thôi.' },
    { id: 'p4', kind: 'pmuted', text: 'Mỗi phân đoạn (chunk) âm thanh sẽ có định danh telemetry ID duy nhất để đảm bảo khả năng tra cứu nguồn gốc trực tiếp từ màn hình Bảng công việc hoặc Trình nghe lại cuộc họp.' },
  ] as NoteBlock[],
  initialSelection: { blockId: 'p3', text: 'Hệ thống cần xử lý STT thật nhanh để user không phải đợi lâu quá, nếu lỗi thì phải cho thử lại mấy đoạn hỏng thôi.' },
}

export const presetRewrite =
  'Hệ thống chép lời giọng nói theo từng đoạn, trả kết quả gần như ngay khi có; nếu gián đoạn, cho phép người dùng chỉ thử lại những đoạn bị lỗi.'

export const aiActions = [
  { key: 'rewrite', label: 'Viết lại', style: 'Chuyên nghiệp kỹ thuật' },
  { key: 'summarize', label: 'Tóm tắt', style: 'Ngắn gọn' },
  { key: 'tasks', label: 'Trích xuất việc', style: 'Việc cần làm' },
  { key: 'shorten', label: 'Rút gọn', style: 'Súc tích' },
  { key: 'grammar', label: 'Sửa ngữ pháp', style: 'Chuẩn ngữ pháp' },
  { key: 'pro', label: 'Chuyên nghiệp hơn', style: 'Chuyên nghiệp' },
] as const

/** Số nút AI hiện thẳng trên thanh; phần còn lại nằm trong "Thêm". */
export const AI_PRIMARY_COUNT = 3

export const diagram = {
  file: 'arch_v4_final.svg',
  lines: [
    { tone: 'ai', text: '[Inbound Audio Stream] ➔ [Chunker 10s] ➔ [Worker Node GPU]' },
    { tone: 'muted', text: '↳ Fallback: Circuit Breaker active if p99 > 1200ms' },
    { tone: 'brand', text: '[STT Partial Result] ➔ [Vector Indexer] ➔ [Space Knowledge Base]' },
  ] as const,
}

export const sidePanel = {
  origin: { chip: 'Ghi âm cuộc họp', time: '42:15', title: 'Họp sprint tuần 40', cite: 'Đoạn trích 14:20' },
  backlinks: [
    { id: 'b1', title: 'Đặc tả API v3 - Voice Gateway', sub: 'Liên kết từ mục 2.3' },
    { id: 'b2', title: 'Bản đồ kiến trúc Cloud 2024', sub: 'Đính kèm tại trang 4' },
  ],
  task: { code: 'TASK-142', title: 'Setup Redis Sentinel cho streaming buffer STT', due: 'Hạn: 18/10', assignee: 'HL' },
  files: [{ id: 'f1', name: 'benchmark_result.pdf', size: '1.8 MB' }],
}

export const retryRewrite =
  'Hệ thống chép lời cần phản hồi nhanh để người dùng không phải chờ lâu. Khi có lỗi, chỉ những đoạn hỏng được chép lại.'

import type { RecGhost } from './recording'

/** Việc AI đề xuất từ ghi chú (chưa là dữ liệu chính thức). `sourceAt` là mục trong ghi chú. */
export const noteSuggestions: RecGhost[] = [
  { id: 'ns1', title: 'Cấu hình cơ chế thử lại đoạn lỗi cho luồng xử lý', priority: 'high', assignee: 'Trần Minh', due: '', sourceAt: 'Mục 2', inferred: { assignee: false, due: false }, checked: false },
  { id: 'ns2', title: 'Đo độ trễ p99 trước ngày 15/10', priority: 'medium', assignee: 'Lê Thu Hà', due: '2024-10-15', sourceAt: 'Mục 2', inferred: { assignee: true, due: true }, checked: false },
]

export interface NoteComment { id: string; author: string; initials: string; time: string; text: string }
export const noteComments: NoteComment[] = [
  { id: 'c1', author: 'Lê Thu Hà', initials: 'HL', time: '10 phút trước', text: 'Mục 2 nên ghi rõ ngưỡng p99 là bao nhiêu mili giây.' },
  { id: 'c2', author: 'Trần Minh', initials: 'TM', time: '1 giờ trước', text: 'Đã bổ sung sơ đồ ở mục 3, anh chị xem giúp.' },
]

export interface NoteVersion { id: string; when: string; author: string; note: string }
export const noteVersions: NoteVersion[] = [
  { id: 'v3', when: 'Hiện tại', author: 'Nguyễn Minh Anh', note: 'Bản đang xem' },
  { id: 'v2', when: '14:20 hôm nay', author: 'Trần Minh', note: 'Thêm sơ đồ luồng dữ liệu' },
  { id: 'v1', when: 'Hôm qua 17:05', author: 'Nguyễn Minh Anh', note: 'Bản nháp đầu tiên' },
]
