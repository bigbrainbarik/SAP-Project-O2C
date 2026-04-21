import { clsx } from 'clsx'

interface SapFieldProps {
  label: string
  value: string
  editable?: boolean
  onChange?: (v: string) => void
  mandatory?: boolean
  error?: string
  className?: string
  type?: 'text' | 'number' | 'date' | 'select'
  options?: { label: string; value: string }[]
  disabled?: boolean
}

export const SapField = ({
  label,
  value,
  editable = false,
  onChange,
  mandatory = false,
  error,
  className,
  type = 'text',
  options,
  disabled = false,
}: SapFieldProps) => {
  const fieldId = `sap-field-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className={clsx('flex items-start gap-2 text-sm', className)}>
      <label
        htmlFor={fieldId}
        className={clsx(
          'w-[140px] shrink-0 pt-2 text-xs font-semibold uppercase tracking-wide',
          mandatory && "after:ml-0.5 after:text-red-500 after:content-['*']"
        )}
      >
        {label}
      </label>
      <div className="min-w-0 flex-1">
        {editable ? (
          type === 'select' && options ? (
            <select
              id={fieldId}
              value={value}
              disabled={disabled}
              onChange={(e) => onChange?.(e.target.value)}
              className={clsx(
                'h-9 w-full rounded-md border bg-surface-container-lowest px-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/40 dark:bg-surface-container',
                error ? 'border-red-500' : 'border-outline/30'
              )}
            >
              {options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={fieldId}
              type={type}
              value={value}
              disabled={disabled}
              onChange={(e) => onChange?.(e.target.value)}
              className={clsx(
                'h-9 w-full rounded-md border bg-surface-container-lowest px-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/40 dark:bg-surface-container',
                error ? 'border-red-500' : 'border-outline/30'
              )}
            />
          )
        ) : (
          <div className="flex h-9 items-center rounded-md bg-surface-variant/50 px-2 text-sm dark:bg-surface-container">
            {value || '—'}
          </div>
        )}
        {error && <p className="mt-0.5 text-[11px] text-red-500">{error}</p>}
      </div>
    </div>
  )
}
