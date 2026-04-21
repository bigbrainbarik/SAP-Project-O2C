import { motion } from 'framer-motion'
import { BarChart3, BookOpen, Database, FileCode2, GitBranch, Layers, PlayCircle, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SectionCard } from '../components/common/SectionCard'
import { PageTransition } from '../components/common/PageTransition'
import { useSimulator } from '../context/SimulatorContext'

const tiles = [
  { title: 'O2C Process Flow', to: '/simulation/setup', icon: Layers, desc: 'Interactive O2C simulation', color: 'from-blue-500 to-indigo-500' },
  { title: 'Simulation Mode', to: '/simulation/setup', icon: PlayCircle, desc: 'Normal, Credit, Stock scenarios', color: 'from-violet-500 to-purple-500' },
  { title: 'Master Data', to: '/master-data', icon: Database, desc: 'Customer & Material master', color: 'from-emerald-500 to-teal-500' },
  { title: 'Org Structure', to: '/org-structure', icon: BookOpen, desc: 'Enterprise hierarchy', color: 'from-orange-500 to-amber-500' },
  { title: 'T-Code Reference', to: '/t-codes', icon: FileCode2, desc: '25+ transaction codes', color: 'from-cyan-500 to-blue-500' },
  { title: 'Configuration (SPRO)', to: '/spro', icon: Settings, desc: 'Customizing guide', color: 'from-pink-500 to-rose-500' },
  { title: 'Document Flow', to: '/document-flow', icon: GitBranch, desc: 'Transaction chain graph', color: 'from-fuchsia-500 to-pink-500' },
  { title: 'Summary', to: '/summary', icon: BarChart3, desc: 'KPIs & lifecycle view', color: 'from-red-500 to-orange-500' },
]

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { state } = useSimulator()

  const docKeys = ['inquiryId', 'quotationId', 'salesOrderId', 'deliveryId', 'goodsIssueId', 'billingId', 'paymentId'] as const
  const completedDocs = docKeys.filter((k) => state.documents[k]).length

  return (
    <PageTransition>
      <div className="space-y-4">
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-gradient-to-br from-primary to-primary-container p-6 text-on-primary ring-1 ring-outline/20"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-on-primary/80">Fiori Launchpad</p>
          <h1 className="mt-2 font-heading text-4xl font-black tracking-tight">Order-to-Cash Workspace</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <span>
              Scenario: <strong>{state.scenario ?? 'Not Selected'}</strong>
            </span>
            <span>
              Progress: <strong>{completedDocs}/7</strong> documents
            </span>
            <span>
              Engine: <strong>Active</strong>
            </span>
          </div>
        </motion.section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tiles.map((tile, idx) => {
            const Icon = tile.icon
            return (
              <motion.button
                key={tile.title}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(tile.to)}
                className="group rounded-xl bg-surface-container-lowest p-5 text-left shadow-soft ring-1 ring-outline/20 transition dark:bg-surface-container"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${tile.color} text-white shadow`}>
                  <Icon size={20} />
                </div>
                <p className="mt-3 text-sm font-bold group-hover:text-primary">{tile.title}</p>
                <p className="mt-1 text-xs text-on-surface/60 dark:text-inverse-on-surface/60">{tile.desc}</p>
              </motion.button>
            )
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <SectionCard title="O2C Lifecycle">
            <div className="flex flex-wrap gap-1.5">
              {['Inquiry', 'Quotation', 'Order', 'Delivery', 'GI', 'Billing', 'Payment'].map((step, idx) => (
                <motion.span
                  key={step}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.06 }}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                >
                  {step}
                </motion.span>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Pipeline Value">
            <p className="text-3xl font-bold text-primary">$4.2M</p>
            <p className="text-xs text-on-surface/70 dark:text-inverse-on-surface/70">Open orders aggregate</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-variant">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container"
              />
            </div>
          </SectionCard>
          <SectionCard title="Quick Actions">
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate('/simulation/setup')}
                className="w-full rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-on-primary transition hover:brightness-105"
              >
                Execute New Simulation
              </button>
              <button
                type="button"
                onClick={() => navigate('/document-flow')}
                className="w-full rounded-lg border border-primary/40 bg-primary-fixed px-3 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary-fixed-dim"
              >
                View Document Flow
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageTransition>
  )
}
