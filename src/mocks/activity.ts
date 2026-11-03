import type { ActivityItem, NotificationItem } from '../types/activity'

export const seedNotifications: NotificationItem[] = [
  { id: 'n1', kind: 'assigned', title: 'Trần Minh giao cho bạn một việc', body: 'Hoàn thiện API đăng nhập & xác thực', time: '10 phút trước', href: '/bang-cong-viec', read: false },
  { id: 'n2', kind: 'comment', title: 'Lê Thu Hà bình luận trong ghi chú', body: 'Mục 2 nên ghi rõ ngưỡng p99 là bao nhiêu mili giây.', time: '10 phút trước', href: '/ghi-chu?panel=comments', read: false },
  { id: 'n3', kind: 'reminder', title: 'Sắp đến hạn: Gửi báo cáo tiến độ tuần 41', body: 'Hôm nay 18:00', time: '1 giờ trước', href: '/lich-nhac-nho', read: false },
  { id: 'n4', kind: 'processing', title: 'Bản chép lời đã xong', body: 'Họp sprint planning tuần 41 · 3 việc đề xuất đang chờ bạn duyệt', time: '2 giờ trước', href: '/ghi-am/demo', read: true },
  { id: 'n5', kind: 'assigned', title: 'Đặng Quang giao cho bạn một việc', body: 'Review thiết kế Onboarding và luồng kích hoạt', time: 'Hôm qua', href: '/bang-cong-viec', read: true },
  { id: 'n6', kind: 'comment', title: 'Trần Minh nhắc tên bạn trong một việc', body: 'Tuyệt vời, nhờ @Nguyễn Minh Anh kiểm tra thêm phần webhook.', time: 'Hôm qua', href: '/bang-cong-viec', read: true },
]

export const seedActivity: ActivityItem[] = [
  { id: 'a1', kind: 'task', actor: 'Trần Minh', initials: 'TM', text: 'đã giao việc cho Nguyễn Minh Anh:', target: { label: 'Hoàn thiện API đăng nhập & xác thực', href: '/bang-cong-viec' }, group: 'Hôm nay', time: '10 phút trước' },
  { id: 'a2', kind: 'note', actor: 'Lê Thu Hà', initials: 'HL', text: 'đã bình luận vào ghi chú', target: { label: 'Biên bản họp kiến trúc hệ thống Q4', href: '/ghi-chu?panel=comments' }, group: 'Hôm nay', time: '10 phút trước' },
  { id: 'a3', kind: 'recording', actor: 'Hệ thống', initials: 'AI', text: 'đã xử lý xong bản chép lời của', target: { label: 'Họp sprint planning tuần 41', href: '/ghi-am/demo' }, group: 'Hôm nay', time: '2 giờ trước' },
  { id: 'a4', kind: 'task', actor: 'Nguyễn Minh Anh', initials: 'NA', text: 'đã chuyển việc sang Đang làm:', target: { label: 'Kết nối Socket cho thẻ gợi ý AI', href: '/bang-cong-viec' }, group: 'Hôm nay', time: '3 giờ trước' },
  { id: 'a5', kind: 'document', actor: 'Trần Quốc Bảo', initials: 'QB', text: 'đã tải lên tài liệu', target: { label: 'Ảnh chụp hóa đơn tháng 9', href: '/tai-lieu/d3' }, group: 'Hôm nay', time: '5 giờ trước' },
  { id: 'a6', kind: 'member', actor: 'Trần Minh', initials: 'TM', text: 'đã mời khach@doitac.vn làm Viewer', group: 'Hôm qua', time: '16:20' },
  { id: 'a7', kind: 'task', actor: 'Nguyễn Minh Anh', initials: 'NA', text: 'đã tạo 2 việc từ gợi ý của ghi âm', target: { label: 'Họp sprint planning tuần 41', href: '/ghi-am/demo' }, group: 'Hôm qua', time: '14:05' },
  { id: 'a8', kind: 'document', actor: 'Lê Thu Hà', initials: 'HL', text: 'đã tải lên tài liệu', target: { label: 'Biên bản nghiệm thu giai đoạn 1', href: '/tai-lieu/d2' }, group: 'Hôm qua', time: '09:40' },
  { id: 'a9', kind: 'note', actor: 'Trần Minh', initials: 'TM', text: 'đã thêm sơ đồ vào ghi chú', target: { label: 'Biên bản họp kiến trúc hệ thống Q4', href: '/ghi-chu' }, group: 'Hôm qua', time: '14:20' },
  { id: 'a10', kind: 'member', actor: 'Trần Minh', initials: 'TM', text: 'đã mời linh.pham@congty.vn làm Editor', group: 'Trước đó', time: '12/10' },
  { id: 'a11', kind: 'space', actor: 'Nguyễn Minh Anh', initials: 'NA', text: 'đã tạo không gian', group: 'Trước đó', time: '01/10' },
]
