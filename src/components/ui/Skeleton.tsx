import { cn } from '../../lib/cn'

/** Khối giữ chỗ khi đang tải. Tự tắt hiệu ứng nếu người dùng chọn giảm chuyển động. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-surface-container-high motion-reduce:animate-none', className)} />
}

/** Nhóm Skeleton có nhãn cho trình đọc màn hình. */
export function SkeletonGroup({ label = 'Đang tải', children, className }: { label?: string; children: React.ReactNode; className?: string }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      {children}
    </div>
  )
}
