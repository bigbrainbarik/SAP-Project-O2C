import { CircleAlert, CircleCheck, TriangleAlert, X } from 'lucide-react'
import { useSimulator } from '../../context/SimulatorContext'

const iconByType = {
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
}

const stylesByType = {
  success: 'border-emerald-500/40 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-500/40 bg-amber-50 text-amber-700',
  error: 'border-red-500/40 bg-red-50 text-red-700',
}

export const MessagePanel = () => {
  const { state, dismissMessage, clearMessages } = useSimulator()

  return (
    <section className="rounded-xl bg-surface-container-low p-4 ring-1 ring-outline/20 dark:bg-surface-container">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide">System Messages</h3>
        <button
          type="button"
          onClick={clearMessages}
          className="text-xs font-semibold text-primary"
        >
          Clear
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {state.messages.length === 0 && (
          <p className="rounded-lg bg-surface p-3 text-xs text-on-surface/70 dark:bg-inverse-surface dark:text-inverse-on-surface/70">
            No new system messages.
          </p>
        )}

        {state.messages.map((msg) => {
          const Icon = iconByType[msg.type]
          return (
            <article
              key={msg.id}
              className={`rounded-lg border p-3 text-xs ${stylesByType[msg.type]}`}
            >
              <div className="flex items-start gap-2">
                <Icon size={16} className="mt-[2px] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{msg.title}</p>
                  <p className="mt-1 text-[11px] opacity-90">{msg.detail}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dismissMessage(msg.id)}
                  aria-label="Dismiss message"
                  className="rounded p-0.5 hover:bg-black/5"
                >
                  <X size={14} />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
