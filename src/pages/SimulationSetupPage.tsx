import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { SectionCard } from '../components/common/SectionCard'
import { PageTransition } from '../components/common/PageTransition'
import { useSimulator } from '../context/SimulatorContext'
import { SoundManager } from '../utils/sound'
import type { ScenarioType } from '../types'

const scenarios: Array<{ value: Exclude<ScenarioType, null>; title: string; detail: string; icon: string; badge: string }> = [
  {
    value: 'normal',
    title: 'Standard Order-to-Cash',
    detail: 'Complete O2C flow from inquiry through payment — no exceptions. All steps complete normally.',
    icon: '✅',
    badge: 'Recommended',
  },
  {
    value: 'credit',
    title: 'Credit Limit Exception',
    detail: 'Sales order triggers credit block. Requires manager override or quantity reduction to proceed.',
    icon: '🚫',
    badge: 'Error Handling',
  },
  {
    value: 'stock',
    title: 'Stock Not Available',
    detail: 'Delivery creation fails ATP check. Options: delay delivery or create partial delivery split.',
    icon: '📦',
    badge: 'Exception Flow',
  },
]

export const SimulationSetupPage = () => {
  const navigate = useNavigate()
  const { state, setScenario, setCurrentStep, clearMessages, pushMessage, resetSimulation } = useSimulator()

  const start = () => {
    if (!state.scenario) {
      pushMessage({ type: 'error', title: 'Scenario missing', detail: 'Select a scenario before starting simulation.' })
      if (state.preferences.soundEnabled) SoundManager.error()
      return
    }

    const selectedScenario = state.scenario
    clearMessages()
    resetSimulation()
    setScenario(selectedScenario)
    setCurrentStep('inquiry')
    if (state.preferences.soundEnabled) SoundManager.success()
    navigate('/simulation/inquiry')
  }

  return (
    <PageTransition>
      <div className="space-y-4">
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-surface-container-low p-6 ring-1 ring-outline/20 dark:bg-surface-container"
        >
          <h1 className="font-heading text-4xl font-black tracking-tight">Configure New Simulation</h1>
          <p className="mt-2 text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
            Select a scenario to begin the Order-to-Cash simulation.
          </p>
        </motion.section>

        <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
          <div className="grid gap-4 md:grid-cols-3">
            {scenarios.map((scenario, idx) => {
              const selected = state.scenario === scenario.value
              return (
                <motion.button
                  key={scenario.value}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setScenario(scenario.value)
                    if (state.preferences.soundEnabled) SoundManager.click()
                  }}
                  className={`relative rounded-xl p-5 text-left ring-2 transition ${
                    selected
                      ? 'bg-primary-fixed text-primary ring-primary/60 shadow-lg'
                      : 'bg-surface-container-lowest ring-outline/20 hover:ring-primary/50 dark:bg-surface-container'
                  }`}
                >
                  <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {scenario.badge}
                  </span>
                  <span className="text-3xl">{scenario.icon}</span>
                  <p className="mt-3 text-lg font-bold">{scenario.title}</p>
                  <p className="mt-2 text-xs text-on-surface/60 dark:text-inverse-on-surface/60">
                    {scenario.detail}
                  </p>
                </motion.button>
              )
            })}
          </div>

          <SectionCard title="Scenario Preview">
            <div className="space-y-3 text-sm">
              {state.scenario === 'normal' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="font-semibold">Normal Flow</p>
                  <p className="mt-1 text-xs text-on-surface/60">All 7 steps complete without exception. Ideal for understanding the baseline O2C process.</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs">✓ No credit blocks</p>
                    <p className="text-xs">✓ Full stock availability</p>
                    <p className="text-xs">✓ Complete delivery</p>
                    <p className="text-xs">✓ Full payment clearing</p>
                  </div>
                </motion.div>
              )}
              {state.scenario === 'credit' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="font-semibold">Credit Block Scenario</p>
                  <p className="mt-1 text-xs text-on-surface/60">Order value exceeds credit limit on VA01 save.</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-red-600">✗ Credit limit exceeded at VA01</p>
                    <p className="text-xs">→ Override (manager auth)</p>
                    <p className="text-xs">→ Reduce quantity (50%)</p>
                  </div>
                </motion.div>
              )}
              {state.scenario === 'stock' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="font-semibold">Stock Unavailability</p>
                  <p className="mt-1 text-xs text-on-surface/60">ATP check fails at delivery creation.</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-amber-600">⚠ Material not available</p>
                    <p className="text-xs">→ Delay delivery (+5 days)</p>
                    <p className="text-xs">→ Partial delivery (60%)</p>
                  </div>
                </motion.div>
              )}
              {!state.scenario && (
                <p className="text-xs text-on-surface/60">Select a scenario to preview expected execution path.</p>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-lg border border-outline/40 px-4 py-2 text-sm font-semibold transition hover:bg-surface-container"
          >
            Cancel
          </button>
          <motion.button
            type="button"
            onClick={start}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-on-primary transition hover:brightness-105"
          >
            Start Simulation →
          </motion.button>
        </div>
      </div>
    </PageTransition>
  )
}
