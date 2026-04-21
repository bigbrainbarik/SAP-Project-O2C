import { clsx } from 'clsx'

interface StatusBadgeProps {
  status: 'complete' | 'processing' | 'pending' | 'blocked' | 'warning'
  label?: string
}

const styles: Record<StatusBadgeProps['status'], string> = {
  complete: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  pending: 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-300',
  blocked: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

const defaultLabels: Record<StatusBadgeProps['status'], string> = {
  complete: 'Complete',
  processing: 'Processing',
  pending: 'Pending',
  blocked: 'Blocked',
  warning: 'Warning',
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => (
  <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold', styles[status])}>
    <span className={clsx('mr-1.5 inline-block h-1.5 w-1.5 rounded-full', {
      'bg-emerald-500': status === 'complete',
      'bg-blue-500': status === 'processing',
      'bg-gray-400': status === 'pending',
      'bg-red-500': status === 'blocked',
      'bg-amber-500': status === 'warning',
    })} />
    {label ?? defaultLabels[status]}
  </span>
)
