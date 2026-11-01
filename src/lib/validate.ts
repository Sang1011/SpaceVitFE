export function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
}

/** Mật khẩu: tối thiểu 8 ký tự, có chữ và số. Trả về thông báo lỗi hoặc undefined. */
export function passwordError(v: string): string | undefined {
  if (!v) return 'Nhập mật khẩu'
  if (v.length < 8) return 'Mật khẩu cần ít nhất 8 ký tự'
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Mật khẩu cần có cả chữ và số'
  return undefined
}

/** Chỉ cho chuyển hướng nội bộ, tránh mở trang ngoài qua tham số next. */
export function safeNext(v: string | null): string {
  return v && v.startsWith('/') && !v.startsWith('//') ? v : '/tong-quan'
}
