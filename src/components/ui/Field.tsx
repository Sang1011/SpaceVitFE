import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

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

export interface FieldAreaProps extends Omit<ComponentProps<'textarea'>, 'id'> {
  label: string
  error?: string
  hint?: ReactNode
}

/** Ô nhập nhiều dòng, cùng kiểu với Field. Có maxLength thì hiện bộ đếm ký tự. */
export function FieldArea({ label, error, hint, className, value, maxLength, ...props }: FieldAreaProps) {
  const id = useId()
  const descId = `${id}-d`
  const hasDesc = !!error || !!hint
  const len = typeof value === 'string' ? value.length : 0
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-body-medium text-body-medium text-text-primary">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={hasDesc ? descId : undefined}
        className={cn(
          'w-full resize-y rounded-lg border bg-surface-variant px-3 py-2 font-body-default text-body-default text-text-primary placeholder:text-text-secondary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand disabled:cursor-not-allowed disabled:opacity-70',
          error ? 'border-status-error' : 'border-border-strong',
          className,
        )}
        {...props}
      />
      <div className="flex items-start justify-between gap-2">
        {hasDesc ? (
          <p id={descId} role={error ? 'alert' : undefined} className={cn('flex items-center gap-1 font-caption text-caption', error ? 'text-status-error-text' : 'text-text-secondary')}>
            {error && <Icon name="error" size={16} className="shrink-0" />}
            <span>{error ?? hint}</span>
          </p>
        ) : (
          <span />
        )}
        {maxLength && <span aria-hidden="true" className="shrink-0 font-caption text-caption text-text-secondary">{len}/{maxLength}</span>}
      </div>
    </div>
  )
}
