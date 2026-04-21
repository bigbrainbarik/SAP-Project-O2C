import { ArrowLeft, ArrowRight, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSimulator } from '../../context/SimulatorContext'
import type { SimulationStep } from '../../types'
import { STEP_PATHS } from '../../utils/steps'
import { SoundManager } from '../../utils/sound'

interface TransactionActionsProps {
  current: SimulationStep
  previous?: SimulationStep
  next?: SimulationStep
  onSave?: () => void
  saveLabel?: string
}

export const TransactionActions = ({
  current,
  previous,
  next,
  onSave,
  saveLabel = 'Save',
}: TransactionActionsProps) => {
  const navigate = useNavigate()
  const { completeStep, setCurrentStep, state } = useSimulator()

  const goNext = () => {
    if (!next) return
    completeStep(current)
    setCurrentStep(next)
    if (state.preferences.soundEnabled) SoundManager.click()
    navigate(STEP_PATHS[next])
  }

  const goPrevious = () => {
    if (!previous) return
    setCurrentStep(previous)
    if (state.preferences.soundEnabled) SoundManager.click()
    navigate(STEP_PATHS[previous])
  }

  return (
    <div className="flex items-center gap-2">
      {previous && (
        <button
          type="button"
          onClick={goPrevious}
          className="inline-flex items-center gap-1 rounded-lg border border-outline/40 px-3 py-2 text-sm font-semibold transition hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      )}

      {onSave && (
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-on-primary transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <Save size={14} />
          {saveLabel}
        </button>
      )}

      {next && (
        <button
          type="button"
          onClick={goNext}
          className="inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary-fixed px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary-fixed-dim focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          Next Step
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}
