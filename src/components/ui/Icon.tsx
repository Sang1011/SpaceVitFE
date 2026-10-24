import { cn } from '../../lib/cn'

const sizes = {
  13: 'text-[13px]',
  16: 'text-[16px]',
  18: 'text-[18px]',
  20: 'text-[20px]',
  24: 'text-[24px]',
  28: 'text-[28px]',
} as const

export type IconSize = keyof typeof sizes

export interface IconProps {
  /** Material Symbols name, e.g. "auto_awesome" */
  name: string
  size?: IconSize
  fill?: boolean
  className?: string
}

export function Icon({ name, size = 20, fill, className }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'material-symbols-outlined',
        sizes[size],
        fill && "[font-variation-settings:'FILL'_1,'wght'_400]",
        className,
      )}
    >
      {name}
    </span>
  )
}
