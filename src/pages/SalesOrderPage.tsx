import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ShieldCheck, Minus } from 'lucide-react'
import { SectionCard } from '../components/common/SectionCard'
import { SapField } from '../components/common/SapField'
import { SapTable } from '../components/common/SapTable'
import { StatusBadge } from '../components/common/StatusBadge'
import { PageTransition } from '../components/common/PageTransition'
import { TransactionScreenTemplate } from '../components/simulation/TransactionScreenTemplate'
import { useSimulator } from '../context/SimulatorContext'
import { nextSalesOrderId } from '../utils/documentIds'
import { SoundManager } from '../utils/sound'
import { sapData } from '../data/sapData'

export const SalesOrderPage = () => {
  const { state, pushMessage, setDocument } = useSimulator()

  const [customer] = useState(sapData.customers[0].id)
  const [quantity, setQuantity] = useState('100')
  const [material] = useState(sapData.materials[0].id)
  const [poNumber] = useState('PO-998877')
  const [reqDeliveryDate] = useState('2024-06-20')
  const [creditBlocked, setCreditBlocked] = useState(false)
  const [creditOverridden, setCreditOverridden] = useState(false)

  const selectedCustomer = sapData.customers.find((c) => c.id === customer)!
  const selectedMaterial = sapData.materials.find((m) => m.id === material)!
  const qty = parseInt(quantity) || 0
  const basePrice = selectedMaterial.price
  const matDiscount = basePrice * sapData.pricingConditions.K004.pct / 100
  const custDiscount = basePrice * sapData.pricingConditions.K007.pct / 100
  const netPrice = basePrice - matDiscount - custDiscount
  const subtotal = netPrice * qty
  const tax = subtotal * sapData.pricingConditions.MWST.pct / 100
  const grandTotal = subtotal + tax

  const handleReduceQuantity = () => {
    const reduced = Math.floor(qty * 0.5)
    setQuantity(String(reduced))
    setCreditBlocked(false)
    pushMessage({ type: 'warning', title: 'Quantity reduced', detail: `Quantity reduced to ${reduced} to meet credit limit.` })
    if (state.preferences.soundEnabled) SoundManager.warning()
  }

  const handleOverride = () => {
    setCreditOverridden(true)
    setCreditBlocked(false)
    pushMessage({ type: 'success', title: 'Credit override approved', detail: 'Manager authorization applied. Order can proceed.' })
    if (state.preferences.soundEnabled) SoundManager.success()
  }

  const onSave = () => {
    if (qty <= 0) {
      pushMessage({ type: 'error', title: 'Validation Error', detail: 'Quantity must be greater than 0.' })
      if (state.preferences.soundEnabled) SoundManager.error()
      return
    }

    if (state.scenario === 'credit' && !creditOverridden) {
      setCreditBlocked(true)
      pushMessage({
        type: 'error',
        title: 'Credit limit exceeded',
        detail: `Order value ${grandTotal.toFixed(2)} USD exceeds available credit of ${selectedCustomer.creditLimit.toLocaleString()} USD. Select override or reduce quantity.`,
      })
      if (state.preferences.soundEnabled) SoundManager.error()
      return
    }

    const salesOrderId = nextSalesOrderId()
    setDocument('salesOrderId', salesOrderId)
    pushMessage({ type: 'success', title: 'Sales Order saved', detail: `Sales order ${salesOrderId} created successfully.` })
    if (state.preferences.soundEnabled) SoundManager.save()
  }

  return (
    <PageTransition>
      <TransactionScreenTemplate
        step="sales-order"
        title="Create Sales Order (VA01)"
        subtitle="Standard order — simulation step 3 of 7"
        previous="quotation"
        next="delivery"
        onSave={onSave}
        saveLabel="Save Sales Order"
      >
        {/* Credit Block Modal */}
        <AnimatePresence>
          {creditBlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-4 rounded-xl border-2 border-red-500/60 bg-red-50 p-5 dark:bg-red-950/30"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={22} />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Credit Limit Exceeded</h3>
                  <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                    Order value <strong>{grandTotal.toFixed(2)} USD</strong> exceeds customer credit limit
                    of <strong>{selectedCustomer.creditLimit.toLocaleString()} USD</strong>.
                  </p>
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    Credit area: A000 | Risk category: 001 | Credit group: 01
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleOverride}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      <ShieldCheck size={14} />
                      Override (Manager Auth)
                    </button>
                    <button
                      type="button"
                      onClick={handleReduceQuantity}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-400 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/30"
                    >
                      <Minus size={14} />
                      Reduce Quantity (50%)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {creditOverridden && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-50 p-3 dark:bg-emerald-950/30">
            <ShieldCheck size={18} className="text-emerald-600" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Credit override active — manager authorization applied
            </p>
          </div>
        )}

        <motion.div
          className="grid gap-4 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SectionCard title="Document Info" className="lg:col-span-1">
            <div className="space-y-3">
              <SapField label="Order Type" value="OR (Standard Order)" />
              <SapField label="Sales Org" value={sapData.salesAreas.salesOrg} />
              <SapField label="Dist. Channel" value={sapData.salesAreas.distChannel} />
              <SapField label="Division" value={sapData.salesAreas.division} />
              <SapField label="Ref. Quotation" value={state.documents.quotationId ?? '—'} />
              <div className="pt-2">
                <StatusBadge status={creditBlocked ? 'blocked' : state.documents.salesOrderId ? 'complete' : 'processing'} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Customer Details" className="lg:col-span-1">
            <div className="space-y-3">
              <SapField label="Sold-to Party" value={`${customer} — ${selectedCustomer.name}`} />
              <SapField label="Ship-to Party" value={customer} />
              <SapField label="PO Number" value={poNumber} />
              <SapField label="Req. Del. Date" value={reqDeliveryDate} />
              <SapField label="Credit Limit" value={`${selectedCustomer.creditLimit.toLocaleString()} USD`} />
              <SapField label="Payment Terms" value={selectedCustomer.terms} />
            </div>
          </SectionCard>

          <SectionCard title="Order Summary" className="lg:col-span-1">
            <div className="space-y-3">
              <SapField label="Subtotal" value={`${subtotal.toFixed(2)} USD`} />
              <SapField label={`Tax (${sapData.pricingConditions.MWST.pct}%)`} value={`${tax.toFixed(2)} USD`} />
              <div className="border-t border-outline/20 pt-3">
                <SapField label="Grand Total" value={`${grandTotal.toFixed(2)} USD`} />
              </div>
              <SapField label="Currency" value="USD" />
              <SapField label="Incoterms" value={selectedCustomer.incoterms} />
            </div>
          </SectionCard>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionCard title="All Items — Order Line Details">
            <div className="mb-3 w-[200px]">
              <SapField label="Qty (Item 10)" value={quantity} editable mandatory type="number" onChange={setQuantity} />
            </div>
            <SapTable
              columns={[
                { key: 'item', label: 'Item', width: '50px' },
                { key: 'material', label: 'Material' },
                { key: 'description', label: 'Description' },
                { key: 'qty', label: 'Qty', align: 'right' },
                { key: 'uom', label: 'UOM' },
                { key: 'base', label: 'Base', align: 'right' },
                { key: 'matDisc', label: 'K004', align: 'right' },
                { key: 'custDisc', label: 'K007', align: 'right' },
                { key: 'net', label: 'Net', align: 'right' },
                { key: 'total', label: 'Total', align: 'right' },
              ]}
              rows={[
                {
                  item: '10',
                  material: selectedMaterial.id,
                  description: selectedMaterial.name,
                  qty: qty,
                  uom: selectedMaterial.uom,
                  base: basePrice.toFixed(2),
                  matDisc: `-${matDiscount.toFixed(2)}`,
                  custDisc: `-${custDiscount.toFixed(2)}`,
                  net: netPrice.toFixed(2),
                  total: `${(netPrice * qty).toFixed(2)}`,
                },
              ]}
            />
          </SectionCard>
        </motion.div>

        <motion.div
          className="mt-4 grid gap-4 lg:grid-cols-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionCard title="Pricing Procedure (RVAA01)">
            <SapTable
              columns={[
                { key: 'step', label: 'Step', width: '50px' },
                { key: 'type', label: 'Cond. Type' },
                { key: 'name', label: 'Description' },
                { key: 'rate', label: 'Rate', align: 'right' },
                { key: 'value', label: 'Cond. Value', align: 'right' },
              ]}
              rows={[
                { step: '10', type: 'PR00', name: 'Base Price', rate: basePrice.toFixed(2), value: (basePrice * qty).toFixed(2) },
                { step: '20', type: 'K004', name: 'Material Discount', rate: `-${sapData.pricingConditions.K004.pct}%`, value: `-${(matDiscount * qty).toFixed(2)}` },
                { step: '30', type: 'K007', name: 'Customer Discount', rate: `-${sapData.pricingConditions.K007.pct}%`, value: `-${(custDiscount * qty).toFixed(2)}` },
                { step: '40', type: '', name: 'Net Value', rate: '', value: subtotal.toFixed(2) },
                { step: '50', type: 'MWST', name: 'Output Tax', rate: `${sapData.pricingConditions.MWST.pct}%`, value: tax.toFixed(2) },
                { step: '60', type: '', name: 'Grand Total', rate: '', value: `${grandTotal.toFixed(2)} USD` },
              ]}
            />
          </SectionCard>

          <SectionCard title="Schedule Lines">
            <SapTable
              columns={[
                { key: 'item', label: 'Item' },
                { key: 'schedLine', label: 'Sched. Line' },
                { key: 'date', label: 'Del. Date' },
                { key: 'qty', label: 'Qty', align: 'right' },
                { key: 'confirmed', label: 'Confirmed', align: 'right' },
                { key: 'category', label: 'Category' },
              ]}
              rows={[
                { item: '10', schedLine: '1', date: reqDeliveryDate, qty: qty, confirmed: qty, category: 'CP' },
              ]}
            />
          </SectionCard>
        </motion.div>
      </TransactionScreenTemplate>
    </PageTransition>
  )
}
