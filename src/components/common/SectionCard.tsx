import type { PropsWithChildren } from 'react'
import { clsx } from 'clsx'

interface SectionCardProps extends PropsWithChildren {
  title: string
  className?: string
}

export const SectionCard = ({ title, className, children }: SectionCardProps) => {
  return (
    <section
      className={clsx(
        'rounded-xl bg-surface-container-lowest p-4 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container',
        className,
      )}
    >
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-on-surface/80 dark:text-inverse-on-surface/80">
        {title}
      </h3>
      {children}
    </section>
  )
}
