import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { PageTransition } from '../components/common/PageTransition'
import { sproConfig } from '../data/sapData'

const statusIcon = {
  Maintained: <CheckCircle2 size={14} className="text-emerald-500" />,
  'Review Required': <AlertCircle size={14} className="text-amber-500" />,
  Incomplete: <Clock size={14} className="text-red-500" />,
}

const statusStyle = {
  Maintained: 'text-emerald-600 dark:text-emerald-400',
  'Review Required': 'text-amber-600 dark:text-amber-400',
  Incomplete: 'text-red-600 dark:text-red-400',
}

export const SproPage = () => {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set([sproConfig[0].category]))

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const totalItems = sproConfig.reduce((acc, c) => acc + c.items.length, 0)
  const maintainedCount = sproConfig.reduce((acc, c) => acc + c.items.filter((i) => i.status === 'Maintained').length, 0)

  return (
    <PageTransition>
      <div className="space-y-4">
        <section className="rounded-xl bg-surface-container-low p-6 ring-1 ring-outline/20 dark:bg-surface-container">
          <h1 className="font-heading text-4xl font-black tracking-tight">SPRO Configuration</h1>
          <p className="mt-2 text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
            Implementation guide — {maintainedCount}/{totalItems} configuration steps maintained.
          </p>
        </section>

        {/* Summary Badges */}
        <div className="flex flex-wrap gap-3">
          <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            ✓ Maintained: {maintainedCount}
          </div>
          <div className="rounded-lg bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            ⚠ Review: {sproConfig.reduce((a, c) => a + c.items.filter((i) => i.status === 'Review Required').length, 0)}
          </div>
          <div className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
            ✗ Incomplete: {sproConfig.reduce((a, c) => a + c.items.filter((i) => i.status === 'Incomplete').length, 0)}
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {sproConfig.map((category, catIdx) => {
            const isOpen = openCategories.has(category.category)
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.06 }}
                className="rounded-xl bg-surface-container-lowest shadow-soft ring-1 ring-outline/20 dark:bg-surface-container"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(category.category)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown size={18} className="text-primary" /> : <ChevronRight size={18} />}
                    <div>
                      <p className="text-sm font-bold">{category.category}</p>
                      <p className="text-xs text-on-surface/60 dark:text-inverse-on-surface/60">
                        {category.items.length} configuration nodes
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {category.items.map((item, idx) => (
                      <span
                        key={idx}
                        className={`inline-block h-2 w-2 rounded-full ${
                          item.status === 'Maintained' ? 'bg-emerald-500' :
                          item.status === 'Review Required' ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      />
                    ))}
                  </div>
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-outline/10 p-4"
                  >
                    <div className="space-y-3">
                      {category.items.map((item) => (
                        <article
                          key={item.title}
                          className="rounded-lg bg-surface p-4 ring-1 ring-outline/10 dark:bg-inverse-surface"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-mono text-on-surface/50 dark:text-inverse-on-surface/50">{item.path}</p>
                              <p className="mt-1 text-sm font-semibold">{item.title}</p>
                              <p className="mt-1 text-xs text-on-surface/70 dark:text-inverse-on-surface/70">{item.desc}</p>
                              <p className="mt-2 text-[11px] text-on-surface/50 dark:text-inverse-on-surface/50">
                                Dependency: {item.dependency}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1.5">
                              {statusIcon[item.status]}
                              <span className={`text-xs font-semibold ${statusStyle[item.status]}`}>
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}
