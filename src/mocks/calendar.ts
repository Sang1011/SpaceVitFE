export type CalKind = 'due' | 'reminder' | 'pending'

export interface CalEvent {
  id: string
  /** yyyy-MM-dd */
  date: string
  /** HH:mm, rỗng nếu cả ngày */
  time: string
  title: string
  kind: CalKind
  owner: 'me' | 'team'
  ownerName: string
  /** Nhắc nhở do Trợ lý tạo, hoặc ngày giờ AI trích từ nguồn nào. */
  source?: { kind: 'assistant' | 'audio' | 'document'; label: string }
  done?: boolean
}

/** Hôm nay trong dữ liệu mẫu. */
export const TODAY = '2024-10-15'

export const calEvents: CalEvent[] = [
  { id: 'e1', date: '2024-10-14', time: '18:00', title: 'Hạn: Hoàn thiện API đăng nhập & xác thực SSO', kind: 'due', owner: 'me', ownerName: 'Nguyễn Minh Anh' },
  { id: 'e2', date: '2024-10-15', time: '15:30', title: 'Hạn: Review thiết kế Onboarding', kind: 'due', owner: 'me', ownerName: 'Nguyễn Minh Anh' },
  { id: 'e3', date: '2024-10-15', time: '17:00', title: 'Hạn: Viết kiểm thử cổng thanh toán', kind: 'due', owner: 'team', ownerName: 'Trần Quốc Bảo' },
  { id: 'e4', date: '2024-10-15', time: '18:00', title: 'Gửi báo cáo tiến độ tuần 41', kind: 'reminder', owner: 'me', ownerName: 'Nguyễn Minh Anh' },
  { id: 'e5', date: '2024-10-16', time: '17:00', title: 'Gửi báo cáo tiến độ sprint cho ban giám đốc', kind: 'reminder', owner: 'me', ownerName: 'Nguyễn Minh Anh', source: { kind: 'assistant', label: 'Trợ lý AI' } },
  { id: 'e6', date: '2024-10-16', time: '09:00', title: 'Hạn: Chuyển dữ liệu khách hàng sang kho mới', kind: 'due', owner: 'team', ownerName: 'Trần Quốc Bảo' },
  { id: 'e7', date: '2024-10-18', time: '17:00', title: 'Hạn: Chuẩn bị tài liệu demo cho khách hàng', kind: 'due', owner: 'me', ownerName: 'Nguyễn Minh Anh' },
  { id: 'e8', date: '2024-10-18', time: '10:00', title: 'Họp chốt demo với khách hàng', kind: 'pending', owner: 'me', ownerName: 'Nguyễn Minh Anh', source: { kind: 'audio', label: 'Họp sprint planning tuần 41, 13:48' } },
  { id: 'e9', date: '2024-10-22', time: '', title: 'Demo cho khách hàng', kind: 'pending', owner: 'team', ownerName: 'Cả nhóm', source: { kind: 'audio', label: 'Họp sprint planning tuần 41, 13:48' } },
  { id: 'e10', date: '2024-10-22', time: '23:59', title: 'Hạn: Đối soát điều khoản SLA', kind: 'due', owner: 'me', ownerName: 'Nguyễn Minh Anh' },
  { id: 'e11', date: '2024-10-25', time: '09:00', title: 'Nhắc: Lên lịch phỏng vấn người dùng đợt 5', kind: 'reminder', owner: 'me', ownerName: 'Nguyễn Minh Anh' },
  { id: 'e12', date: '2024-10-29', time: '14:00', title: 'Hạn nộp hồ sơ OCR hợp đồng', kind: 'pending', owner: 'team', ownerName: 'Cả nhóm', source: { kind: 'document', label: 'Hợp đồng dịch vụ đám mây, tr.5' } },
]
