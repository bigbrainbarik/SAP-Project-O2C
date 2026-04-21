import { motion } from 'framer-motion'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageTransition } from '../components/common/PageTransition'
import { useSimulator } from '../context/SimulatorContext'

const flowSteps = [
  { label: 'Inquiry', tcode: 'VA11', icon: '📋', color: 'from-blue-500 to-blue-600' },
  { label: 'Quotation', tcode: 'VA21', icon: '📄', color: 'from-indigo-500 to-indigo-600' },
  { label: 'Sales Order', tcode: 'VA01', icon: '📝', color: 'from-violet-500 to-violet-600' },
  { label: 'Delivery', tcode: 'VL01N', icon: '🚚', color: 'from-purple-500 to-purple-600' },
  { label: 'Goods Issue', tcode: 'VL02N', icon: '📦', color: 'from-fuchsia-500 to-fuchsia-600' },
  { label: 'Billing', tcode: 'VF01', icon: '💰', color: 'from-pink-500 to-pink-600' },
  { label: 'Payment', tcode: 'F-28', icon: '✅', color: 'from-rose-500 to-rose-600' },
]

export const SummaryPage = () => {
  const navigate = useNavigate()
  const { state, resetSimulation } = useSimulator()

  const docKeys = ['inquiryId', 'quotationId', 'salesOrderId', 'deliveryId', 'goodsIssueId', 'billingId', 'paymentId'] as const
  const completedCount = docKeys.filter((k) => state.documents[k]).length
  const isComplete = completedCount === 7

  const cards = [
    { title: 'Total Order Value', value: '$12,936.00', desc: 'Including tax & discounts' },
    { title: 'Documents Generated', value: String(completedCount), desc: `${completedCount}/7 complete` },
    { title: 'Scenario', value: state.scenario === 'credit' ? 'Credit Block' : state.scenario === 'stock' ? 'Stock Issue' : 'Normal', desc: 'Active simulation mode' },
    { title: 'Completion', value: `${Math.round((completedCount / 7) * 100)}%`, desc: isComplete ? 'All steps done!' : 'In progress' },
  ]

  const handleReset = () => {
    resetSimulation()
    navigate('/simulation/setup')
  }

  return (
    <PageTransition>
      <div className="space-y-4">
        <section className="rounded-xl bg-surface-container-low p-6 ring-1 ring-outline/20 dark:bg-surface-container">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-4xl font-black tracking-tight">Simulation Summary</h1>
              <p className="mt-2 text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
                Scenario: <span className="font-semibold text-primary">{state.scenario ?? 'Not selected'}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:brightness-105"
            >
              <RotateCcw size={14} />
              New Simulation
            </button>
          </div>
        </section>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, idx) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-xl bg-surface-container-lowest p-5 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container"
            >
              <p className="text-xs uppercase tracking-wide text-on-surface/60 dark:text-inverse-on-surface/60">{card.title}</p>
              <p className="mt-2 text-3xl font-bold text-primary">{card.value}</p>
              <p className="mt-1 text-xs text-on-surface/50 dark:text-inverse-on-surface/50">{card.desc}</p>
            </motion.article>
          ))}
        </div>

        {/* Animated Lifecycle Flow */}
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-on-surface/80 dark:text-inverse-on-surface/80">
            O2C Lifecycle Flow
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {flowSteps.map((step, idx) => {
              const docId = state.documents[docKeys[idx]]
              return (
                <div key={step.label} className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, type: 'spring', stiffness: 300 }}
                    className={`flex flex-col items-center rounded-xl bg-gradient-to-br ${step.color} p-4 text-white shadow-lg ${
                      docId ? '' : 'opacity-40'
                    }`}
                    style={{ minWidth: '100px' }}
                  >
                    <span className="text-2xl">{step.icon}</span>
                    <span className="mt-1 text-xs font-bold">{step.label}</span>
                    <span className="text-[10px] opacity-80">{step.tcode}</span>
                    {docId && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-mono font-bold"
                      >
                        {docId}
                      </motion.span>
                    )}
                  </motion.div>
                  {idx < flowSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 + 0.05 }}
                    >
                      <ArrowRight size={18} className={docId ? 'text-primary' : 'text-outline/30'} />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Document IDs Table */}
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-on-surface/80 dark:text-inverse-on-surface/80">
            Document Chain
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-primary/30 text-xs uppercase tracking-wide text-on-surface/60 dark:text-inverse-on-surface/60">
                  <th className="px-3 py-2">Step</th>
                  <th className="px-3 py-2">T-Code</th>
                  <th className="px-3 py-2">Document ID</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {flowSteps.map((step, idx) => {
                  const docId = state.documents[docKeys[idx]]
                  return (
                    <motion.tr
                      key={step.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-outline/10 transition-colors hover:bg-primary-fixed/20"
                    >
                      <td className="px-3 py-2 font-medium">{step.label}</td>
                      <td className="px-3 py-2 font-mono text-xs">{step.tcode}</td>
                      <td className="px-3 py-2 font-mono text-xs font-bold text-primary">{docId ?? '—'}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          docId
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800/40 dark:text-gray-400'
                        }`}>
                          {docId ? '✓ Complete' : '○ Pending'}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Integration Map */}
        <div className="grid gap-4 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-surface-container-lowest p-5 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface/60">SD Module</p>
            <p className="mt-2 text-sm">Sales & Distribution handled order creation, pricing, delivery, and billing.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl bg-surface-container-lowest p-5 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface/60">FI Integration</p>
            <p className="mt-2 text-sm">Financial accounting received postings from billing (revenue) and payment (clearing).</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl bg-surface-container-lowest p-5 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface/60">MM Integration</p>
            <p className="mt-2 text-sm">Materials Management processed goods issue and inventory updates.</p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
