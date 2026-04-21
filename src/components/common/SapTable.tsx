import { clsx } from 'clsx'

interface SapTableProps {
  columns: { key: string; label: string; align?: 'left' | 'right' | 'center'; width?: string }[]
  rows: Record<string, string | number>[]
  className?: string
  highlightRow?: number
}

export const SapTable = ({ columns, rows, className, highlightRow }: SapTableProps) => {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="w-full min-w-[540px] text-left text-sm">
        <thead>
          <tr className="border-b-2 border-primary/30 text-xs uppercase tracking-wide text-on-surface/60 dark:text-inverse-on-surface/60">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx('px-3 py-2', col.align === 'right' && 'text-right', col.align === 'center' && 'text-center')}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={clsx(
                'border-b border-outline/10 transition-colors hover:bg-primary-fixed/30',
                idx % 2 === 1 && 'bg-surface-container-low/50 dark:bg-surface-container/50',
                highlightRow === idx && 'bg-primary-fixed text-primary'
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={clsx('px-3 py-2', col.align === 'right' && 'text-right', col.align === 'center' && 'text-center')}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
