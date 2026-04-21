import { motion } from 'framer-motion'
import { PageTransition } from '../components/common/PageTransition'
import { orgStructure } from '../data/sapData'

const levelColors = [
  'bg-primary text-on-primary',
  'bg-primary-container text-on-primary',
  'bg-primary-fixed text-primary',
  'bg-primary-fixed-dim text-primary',
  'bg-surface-variant text-on-surface',
  'bg-surface-container text-on-surface',
  'bg-surface-container-low text-on-surface dark:text-inverse-on-surface',
]

const levelLabels = ['Client', 'Company Code', 'Sales Organization', 'Distribution Channel', 'Division', 'Plant', 'Shipping Point / Storage']

export const OrgStructurePage = () => {
  return (
    <PageTransition>
      <div className="space-y-4">
        <section className="rounded-xl bg-surface-container-low p-6 ring-1 ring-outline/20 dark:bg-surface-container">
          <h1 className="font-heading text-4xl font-black tracking-tight">Organizational Structure</h1>
          <p className="mt-2 text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
            Enterprise hierarchy for sales, logistics, and reporting — KSAL Corp.
          </p>
        </section>

        {/* Tree Visualization */}
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-on-surface/80 dark:text-inverse-on-surface/80">
            Hierarchy Tree
          </h3>

          <div className="space-y-1">
            {orgStructure.map((node, idx) => (
              <motion.div
                key={`${node.label}-${node.value}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.3 }}
                className="flex items-stretch"
              >
                {/* Indentation Lines */}
                <div className="flex shrink-0">
                  {Array.from({ length: node.level }).map((_, i) => (
                    <div key={i} className="flex w-8 items-stretch justify-center">
                      <div className="w-px bg-outline/20" />
                    </div>
                  ))}
                  {node.level > 0 && (
                    <div className="flex w-8 items-center justify-center">
                      <div className="h-px w-4 bg-outline/30" />
                    </div>
                  )}
                </div>

                {/* Node */}
                <motion.div
                  whileHover={{ scale: 1.01, x: 3 }}
                  className={`my-0.5 flex flex-1 items-center gap-3 rounded-lg px-4 py-2.5 ring-1 ring-outline/10 ${levelColors[node.level]}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-black/10 text-[11px] font-bold">
                    L{node.level}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{node.label}</span>
                      <span className="font-mono text-sm font-bold">{node.value}</span>
                    </div>
                    <p className="text-xs opacity-80">{node.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Level Legend */}
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-on-surface/80 dark:text-inverse-on-surface/80">
            Level Reference
          </h3>
          <div className="flex flex-wrap gap-2">
            {levelLabels.map((label, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ring-1 ring-outline/10 ${levelColors[idx]}`}
              >
                L{idx}: {label}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
