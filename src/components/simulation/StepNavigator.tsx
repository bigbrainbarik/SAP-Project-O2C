import { useNavigate } from 'react-router-dom'
import { useSimulator } from '../../context/SimulatorContext'
import type { SimulationStep } from '../../types'
import { STEP_LABELS, STEP_ORDER, STEP_PATHS } from '../../utils/steps'

interface StepNavigatorProps {
  activeStep: SimulationStep
}

export const StepNavigator = ({ activeStep }: StepNavigatorProps) => {
  const navigate = useNavigate()
  const { state, canAccessStep } = useSimulator()

  return (
    <div className="rounded-xl bg-surface-container-low p-3 ring-1 ring-outline/20 dark:bg-surface-container">
      <div className="flex flex-wrap items-center gap-2">
        {STEP_ORDER.filter((step) => step !== 'summary').map((step, index) => {
          const isActive = step === activeStep
          const isCompleted = state.completedSteps.includes(step)
          const isAccessible = canAccessStep(step)

          return (
            <button
              key={step}
              type="button"
              disabled={!isAccessible}
              onClick={() => navigate(STEP_PATHS[step])}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                isActive
                  ? 'border-primary bg-primary-fixed text-primary'
                  : isCompleted
                    ? 'border-primary/50 bg-primary-fixed-dim text-primary'
                    : 'border-outline/40 bg-surface text-on-surface/70 dark:bg-inverse-surface dark:text-inverse-on-surface/70'
              } ${!isAccessible ? 'cursor-not-allowed opacity-50' : 'hover:border-primary/70'}`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                  isActive || isCompleted
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface/70 dark:bg-surface-container-low dark:text-inverse-on-surface/70'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </span>
              <span>{STEP_LABELS[step]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
