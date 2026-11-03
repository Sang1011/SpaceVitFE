/** Chữ cái đầu của họ và tên (từ đầu và từ cuối), ví dụ "Nguyễn Minh Anh" thành "NA". */
export function initialsOf(name: string): string {
  const w = name.trim().split(/\s+/).filter(Boolean)
  if (w.length === 0) return '?'
  const a = w[0][0]
  const b = w.length > 1 ? w[w.length - 1][0] : ''
  return (a + b).toLocaleUpperCase('vi')
}
