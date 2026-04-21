import type { SimulationStep } from '../../types'
import { SectionCard } from '../common/SectionCard'
import { SimulationWorkspace } from './SimulationWorkspace'
import { TransactionActions } from './TransactionActions'

interface TransactionScreenTemplateProps {
  step: SimulationStep
  title: string
  subtitle: string
  previous?: SimulationStep
  next?: SimulationStep
  onSave?: () => void
  saveLabel?: string
  children?: React.ReactNode
}

export const TransactionScreenTemplate = ({
  step,
  title,
  subtitle,
  previous,
  next,
  onSave,
  saveLabel,
  children,
}: TransactionScreenTemplateProps) => {
  return (
    <SimulationWorkspace
      step={step}
      title={title}
      subtitle={subtitle}
      actions={
        <TransactionActions
          current={step}
          previous={previous}
          next={next}
          onSave={onSave}
          saveLabel={saveLabel}
        />
      }
    >
      {children ?? (
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Header Data">
            <p className="text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
              Transaction-specific fields will be implemented in the next pass.
            </p>
          </SectionCard>
          <SectionCard title="Line Items">
            <p className="text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
              Item grid scaffold is active and ready for detailed data wiring.
            </p>
          </SectionCard>
        </div>
      )}
    </SimulationWorkspace>
  )
}
