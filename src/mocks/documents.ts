import type { RecStatus } from './recording'

export type DocKind = 'pdf' | 'docx' | 'image'

export interface DocItem {
  id: string
  name: string
  kind: DocKind
  size: string
  pages: number
  uploaded: string
  by: string
  status: RecStatus
  progress?: number
  /** Số đoạn OCR có độ tin cậy thấp cần xem lại. */
  lowConfidence: number
}

export const docs: DocItem[] = [
  { id: 'd1', name: 'Hợp đồng dịch vụ đám mây', kind: 'pdf', size: '2,4 MB', pages: 24, uploaded: '14/10/2024', by: 'Nguyễn Minh Anh', status: 'completed', lowConfidence: 2 },
  { id: 'd2', name: 'Biên bản nghiệm thu giai đoạn 1', kind: 'pdf', size: '1,1 MB', pages: 8, uploaded: '13/10/2024', by: 'Lê Thu Hà', status: 'partial_failed', lowConfidence: 5 },
  { id: 'd3', name: 'Ảnh chụp hóa đơn tháng 9', kind: 'image', size: '3,8 MB', pages: 1, uploaded: 'Hôm nay', by: 'Trần Quốc Bảo', status: 'processing', progress: 45, lowConfidence: 0 },
  { id: 'd4', name: 'Quy trình bảo mật thông tin', kind: 'docx', size: '640 KB', pages: 12, uploaded: '10/10/2024', by: 'Nguyễn Minh Anh', status: 'completed', lowConfidence: 0 },
  { id: 'd5', name: 'Báo giá thiết bị văn phòng', kind: 'pdf', size: '920 KB', pages: 3, uploaded: '09/10/2024', by: 'Bùi Khánh', status: 'failed', lowConfidence: 0 },
]

/** Dưới ngưỡng này (độ tin cậy OCR, %) thì đoạn bị đánh dấu cần xem lại. */
export const LOW_CONFIDENCE = 80

export interface DocPara {
  id: string
  page: number
  text: string
  /** Độ tin cậy OCR 0-100. */
  confidence: number
}

export const docParas: DocPara[] = [
  { id: 'p1', page: 4, text: 'Điều 4. Thời hạn và gia hạn. Hợp đồng có hiệu lực 12 tháng kể từ ngày ký. Hai bên có thể gia hạn thêm 12 tháng nếu thông báo bằng văn bản trước 30 ngày.', confidence: 97 },
  { id: 'p2', page: 4, text: 'Điều 5. Nghĩa vụ bảo mật. Bên B cam kết không tiết lộ dữ liệu của Bên A cho bên thứ ba, trừ trường hợp có yêu cầu của cơ quan nhà nước có thẩm quyền.', confidence: 95 },
  { id: 'p3', page: 4, text: 'Điều 6. Phí dịch vụ. Tổng phí là 1.2O0.OOO.000 đồng, thanh toán thành hai đợt: 50% khi ký và 50% sau nghiệm thu.', confidence: 61 },
  { id: 'p4', page: 5, text: 'Điều 7. Quét OCR hồ sơ. Bên B hoàn tất quét OCR toàn bộ hồ sơ giấy trước thứ Sáu của tuần ký hợp đồng.', confidence: 93 },
]
