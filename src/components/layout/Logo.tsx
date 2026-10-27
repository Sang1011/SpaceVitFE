import { cn } from '../../lib/cn'

/**
 * Logo tạm: ba ô xếp thành bảng làm việc chung. Không dùng ngôi sao ✦ vì ký hiệu đó
 * dành riêng cho nội dung AI chưa xác nhận (quyết định D2).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="Smart Collaborative Workspace" className={cn('h-8 w-8', className)}>
      <rect width="32" height="32" rx="8" fill="rgb(var(--color-primary-container))" />
      <rect x="7" y="7" width="8" height="18" rx="2.5" fill="rgb(var(--color-on-primary))" />
      <rect x="17" y="7" width="8" height="8" rx="2.5" fill="rgb(var(--color-on-primary))" opacity="0.85" />
      <rect x="17" y="17" width="8" height="8" rx="2.5" fill="rgb(var(--color-on-primary))" opacity="0.6" />
    </svg>
  )
}
