import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../../components/ui'

export interface FieldProps extends Omit<ComponentProps<'input'>, 'id'> {
  label: string
  error?: string
  hint?: ReactNode
}

/** Ô nhập có nhãn, gợi ý và lỗi gắn bằng aria-describedby. Ô mật khẩu có nút hiện/ẩn. */
export function Field({ label, error, hint, type = 'text', className, ...props }: FieldProps) {
  const id = useId()
  const descId = `${id}-d`
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const hasDesc = !!error || !!hint
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-body-medium text-body-medium text-text-primary">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasDesc ? descId : undefined}
          className={cn(
            'h-11 w-full rounded-lg border bg-surface-variant px-3 font-body-default text-body-default text-text-primary placeholder:text-text-secondary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand',
            error ? 'border-status-error' : 'border-border-strong',
            isPassword && 'pr-11',
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-pressed={show}
            aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Icon name={show ? 'visibility_off' : 'visibility'} size={20} />
          </button>
        )}
      </div>
      {hasDesc && (
        <p id={descId} role={error ? 'alert' : undefined} className={cn('flex items-center gap-1 font-caption text-caption', error ? 'text-status-error-text' : 'text-text-secondary')}>
          {error && <Icon name="error" size={16} className="shrink-0" />}
          <span>{error ?? hint}</span>
        </p>
      )}
    </div>
  )
}
