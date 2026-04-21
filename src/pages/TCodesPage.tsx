import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { SapTable } from '../components/common/SapTable'
import { PageTransition } from '../components/common/PageTransition'
import { tCodeData } from '../data/sapData'

export const TCodesPage = () => {
  const [search, setSearch] = useState('')
  const [filterStep, setFilterStep] = useState('All')

  const steps = ['All', ...Array.from(new Set(tCodeData.map((t) => t.step)))]

  const filtered = tCodeData.filter((row) => {
    const matchSearch =
      search === '' ||
      row.code.toLowerCase().includes(search.toLowerCase()) ||
      row.description.toLowerCase().includes(search.toLowerCase()) ||
      row.module.toLowerCase().includes(search.toLowerCase())
    const matchStep = filterStep === 'All' || row.step === filterStep
    return matchSearch && matchStep
  })

  return (
    <PageTransition>
      <div className="space-y-4">
        <section className="rounded-xl bg-surface-container-low p-6 ring-1 ring-outline/20 dark:bg-surface-container">
          <h1 className="font-heading text-4xl font-black tracking-tight">Transaction Codes</h1>
          <p className="mt-2 text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
            Complete SAP SD/FI transaction reference — {tCodeData.length} codes indexed.
          </p>
        </section>

        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-soft ring-1 ring-outline/20 dark:bg-surface-container">
          {/* Search & Filter */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <label className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/60" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by T-Code, description, or module..."
                className="h-10 w-full rounded-lg border border-outline/30 bg-surface pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/40 dark:bg-inverse-surface"
              />
            </label>
            <select
              value={filterStep}
              onChange={(e) => setFilterStep(e.target.value)}
              className="h-10 rounded-lg border border-outline/30 bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 dark:bg-inverse-surface"
            >
              {steps.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <p className="mb-3 text-xs text-on-surface/60 dark:text-inverse-on-surface/60">
            Showing {filtered.length} of {tCodeData.length} transactions
          </p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <SapTable
              columns={[
                { key: 'code', label: 'T-Code', width: '100px' },
                { key: 'description', label: 'Description' },
                { key: 'module', label: 'Module', width: '80px' },
                { key: 'step', label: 'Step' },
                { key: 'area', label: 'Area' },
              ]}
              rows={filtered.map((t) => ({
                code: t.code,
                description: t.description,
                module: t.module,
                step: t.step,
                area: t.area,
              }))}
            />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
