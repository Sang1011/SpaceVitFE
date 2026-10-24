import { cn } from '../../lib/cn'

/** Placeholder logo (the Stitch export used a temporary external image). */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="Smart Collaborative Workspace" className={cn('h-8 w-8', className)}>
      <rect width="32" height="32" rx="8" fill="rgb(var(--color-primary-container))" />
      <path d="M16 6.5l2.2 5.6 5.6 2.2-5.6 2.2L16 22l-2.2-5.5-5.6-2.2 5.6-2.2L16 6.5z" fill="rgb(var(--color-on-primary))" />
      <circle cx="23.5" cy="23" r="2.4" fill="rgb(var(--color-ai-accent))" />
    </svg>
  )
}
