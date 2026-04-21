import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageTransition } from '../components/common/PageTransition'
import { useSimulator } from '../context/SimulatorContext'

const nodes = [
  { label: 'Inquiry', key: 'inquiryId' as const, to: '/simulation/inquiry', tcode: 'VA11' },
  { label: 'Quotation', key: 'quotationId' as const, to: '/simulation/quotation', tcode: 'VA21' },
  { label: 'Sales Order', key: 'salesOrderId' as const, to: '/simulation/sales-order', tcode: 'VA01' },
  { label: 'Delivery', key: 'deliveryId' as const, to: '/simulation/delivery', tcode: 'VL01N' },
  { label: 'Goods Issue', key: 'goodsIssueId' as const, to: '/simulation/goods-issue', tcode: 'VL02N' },
  { label: 'Billing', key: 'billingId' as const, to: '/simulation/billing', tcode: 'VF01' },
  { label: 'Payment', key: 'paymentId' as const, to: '/simulation/payment', tcode: 'F-28' },
]

export const DocumentFlowPage = () => {
  const navigate = useNavigate()
  const { state } = useSimulator()

  const completedCount = nodes.filter((n) => state.documents[n.key]).length

  return (
    <PageTransition>
      <div className="space-y-4">
        <section className="rounded-xl bg-surface-container-low p-6 ring-1 ring-outline/20 dark:bg-surface-container">
          <h1 className="font-heading text-4xl font-black tracking-tight">Document Flow</h1>
          <p className="mt-2 text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
            End-to-end O2C transaction chain — {completedCount}/{nodes.length} documents generated.
          </p>
        </section>

        {/* Graph Visualization */}
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-on-surface/80 dark:text-inverse-on-surface/80">
            Flow Graph
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {nodes.map((node, idx) => {
              const docId = state.documents[node.key]
              const isActive = !!docId
              const isCurrentStep = !docId && (idx === 0 || !!state.documents[nodes[idx - 1].key])

              return (
                <div key={node.label} className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    onClick={() => navigate(node.to)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className={`flex min-w-[120px] flex-col items-center rounded-xl border-2 p-4 transition ${
                      isActive
                        ? 'border-primary bg-primary-fixed text-primary shadow-md'
                        : isCurrentStep
                          ? 'border-primary/40 bg-primary-fixed/30 text-primary/80 animate-pulse'
                          : 'border-outline/20 bg-surface text-on-surface/60 hover:border-primary/30 dark:bg-inverse-surface dark:text-inverse-on-surface/60'
                    }`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      isActive ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface/60 dark:bg-surface-container-low'
                    }`}>
                      {isActive ? '✓' : idx + 1}
                    </span>
                    <span className="mt-2 text-xs font-semibold uppercase tracking-wide">{node.label}</span>
                    <span className="mt-1 text-[10px] font-medium opacity-70">{node.tcode}</span>
                    <span className={`mt-2 text-[11px] font-bold ${isActive ? 'text-primary' : 'text-on-surface/40 dark:text-inverse-on-surface/40'}`}>
                      {docId ?? 'Awaiting'}
                    </span>
                  </motion.button>

                  {idx < nodes.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 + 0.05 }}
                    >
                      <ArrowRight
                        size={20}
                        className={isActive ? 'text-primary' : 'text-outline/30'}
                      />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Document Details Table */}
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-on-surface/80 dark:text-inverse-on-surface/80">
            Document Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-primary/30 text-xs uppercase tracking-wide text-on-surface/60 dark:text-inverse-on-surface/60">
                  <th className="px-3 py-2">Step</th>
                  <th className="px-3 py-2">T-Code</th>
                  <th className="px-3 py-2">Document ID</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((node) => {
                  const docId = state.documents[node.key]
                  return (
                    <tr key={node.label} className="border-b border-outline/10 transition-colors hover:bg-primary-fixed/20">
                      <td className="px-3 py-2 font-medium">{node.label}</td>
                      <td className="px-3 py-2 font-mono text-xs">{node.tcode}</td>
                      <td className="px-3 py-2 font-mono text-xs">{docId ?? '—'}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          docId
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800/40 dark:text-gray-400'
                        }`}>
                          {docId ? 'Complete' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => navigate(node.to)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
