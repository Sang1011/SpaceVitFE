/** Định dạng thời gian và ngày (quyết định D7). */

const pad = (n: number) => String(n).padStart(2, '0')

/** Thời lượng: `mm:ss` dưới 1 giờ, `h:mm:ss` từ 1 giờ. Nhận số giây. */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

/** Ngày `dd/MM`; thêm `/yyyy` khi khác năm hiện tại. */
export function formatDate(date: Date | string | number, now: Date = new Date()): string {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const base = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
  return d.getFullYear() === now.getFullYear() ? base : `${base}/${d.getFullYear()}`
}

/** Giờ `HH:mm` (24 giờ). */
export function formatTime(date: Date | string | number): string {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? '' : `${pad(d.getHours())}:${pad(d.getMinutes())}`
}
