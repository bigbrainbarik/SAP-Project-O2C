import type { PropsWithChildren } from 'react'
import type { SimulationStep } from '../../types'
import { ContextPanel } from './ContextPanel'
import { MessagePanel } from './MessagePanel'
import { StepNavigator } from './StepNavigator'

interface SimulationWorkspaceProps extends PropsWithChildren {
  step: SimulationStep
  title: string
  subtitle: string
  actions?: React.ReactNode
}

export const SimulationWorkspace = ({
  step,
  title,
  subtitle,
  actions,
  children,
}: SimulationWorkspaceProps) => {
  return (
    <div className="space-y-4">
      <StepNavigator activeStep={step} />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-container-low p-4 ring-1 ring-outline/20 dark:bg-surface-container">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[260px_1fr_300px]">
        <ContextPanel />
        <div className="rounded-xl bg-surface-container-low p-4 ring-1 ring-outline/20 dark:bg-surface-container">
          {children}
        </div>
        <MessagePanel />
      </div>
    </div>
  )
}
