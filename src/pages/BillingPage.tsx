import { motion } from 'framer-motion'
import { SectionCard } from '../components/common/SectionCard'
import { SapField } from '../components/common/SapField'
import { SapTable } from '../components/common/SapTable'
import { StatusBadge } from '../components/common/StatusBadge'
import { PageTransition } from '../components/common/PageTransition'
import { TransactionScreenTemplate } from '../components/simulation/TransactionScreenTemplate'
import { useSimulator } from '../context/SimulatorContext'
import { nextBillingId } from '../utils/documentIds'
import { SoundManager } from '../utils/sound'
import { sapData } from '../data/sapData'

export const BillingPage = () => {
  const { state, setDocument, pushMessage } = useSimulator()

  const selectedMaterial = sapData.materials[0]
  const selectedCustomer = sapData.customers[0]
  const qty = 100
  const basePrice = selectedMaterial.price
  const matDiscount = basePrice * sapData.pricingConditions.K004.pct / 100
  const custDiscount = basePrice * sapData.pricingConditions.K007.pct / 100
  const netPrice = basePrice - matDiscount - custDiscount
  const subtotal = netPrice * qty
  const tax = subtotal * sapData.pricingConditions.MWST.pct / 100
  const grandTotal = subtotal + tax

  const onSave = () => {
    const billingId = nextBillingId()
    setDocument('billingId', billingId)
    pushMessage({
      type: 'success',
      title: 'Billing document created',
      detail: `Invoice ${billingId} posted. FI document and revenue recognition triggered.`,
    })
    if (state.preferences.soundEnabled) SoundManager.save()
  }

  return (
    <PageTransition>
      <TransactionScreenTemplate
        step="billing"
        title="Create Billing Document (VF01)"
        subtitle="Invoice creation with FI posting"
        previous="goods-issue"
        next="payment"
        onSave={onSave}
        saveLabel="Post to Accounting"
      >
        <motion.div
          className="grid gap-4 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SectionCard title="Billing Header">
            <div className="space-y-3">
              <SapField label="Billing Type" value="F2 (Invoice)" />
              <SapField label="Billing Date" value={new Date().toISOString().slice(0, 10)} />
              <SapField label="Sales Order" value={state.documents.salesOrderId ?? '—'} />
              <SapField label="Delivery" value={state.documents.deliveryId ?? '—'} />
              <SapField label="Payer" value={`${selectedCustomer.id} — ${selectedCustomer.name}`} />
              <div className="pt-2">
                <StatusBadge status={state.documents.billingId ? 'complete' : 'processing'} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Invoice Preview">
            <div className="space-y-3">
              <SapField label="Net Value" value={`${subtotal.toFixed(2)} USD`} />
              <SapField label={`Tax (${sapData.pricingConditions.MWST.pct}%)`} value={`${tax.toFixed(2)} USD`} />
              <div className="border-t border-outline/20 pt-3">
                <SapField label="Invoice Total" value={`${grandTotal.toFixed(2)} USD`} />
              </div>
              <SapField label="Payment Terms" value={selectedCustomer.terms} />
              <SapField label="Due Date" value="2024-07-20" />
            </div>
          </SectionCard>

          <SectionCard title="Accounting">
            <div className="space-y-3">
              <SapField label="Debit GL" value="140000 — Receivables" />
              <SapField label="Credit GL" value="800000 — Revenue" />
              <SapField label="Tax GL" value="175000 — Output Tax" />
              <SapField label="Company Code" value="KSAL" />
              <SapField label="Fiscal Year" value="2024" />
            </div>
          </SectionCard>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionCard title="Billing Items">
            <SapTable
              columns={[
                { key: 'item', label: 'Item', width: '50px' },
                { key: 'material', label: 'Material' },
                { key: 'description', label: 'Description' },
                { key: 'qty', label: 'Billed Qty', align: 'right' },
                { key: 'uom', label: 'UOM' },
                { key: 'net', label: 'Net Price', align: 'right' },
                { key: 'tax', label: 'Tax', align: 'right' },
                { key: 'total', label: 'Total', align: 'right' },
              ]}
              rows={[
                {
                  item: '10',
                  material: selectedMaterial.id,
                  description: selectedMaterial.name,
                  qty: qty,
                  uom: selectedMaterial.uom,
                  net: `${subtotal.toFixed(2)}`,
                  tax: `${tax.toFixed(2)}`,
                  total: `${grandTotal.toFixed(2)}`,
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
          <SectionCard title="Pricing Breakdown">
            <SapTable
              columns={[
                { key: 'step', label: 'Step', width: '50px' },
                { key: 'type', label: 'Cond. Type' },
                { key: 'name', label: 'Description' },
                { key: 'value', label: 'Value', align: 'right' },
              ]}
              rows={[
                { step: '10', type: 'PR00', name: 'Base Price', value: `${(basePrice * qty).toFixed(2)}` },
                { step: '20', type: 'K004', name: 'Material Discount', value: `-${(matDiscount * qty).toFixed(2)}` },
                { step: '30', type: 'K007', name: 'Customer Discount', value: `-${(custDiscount * qty).toFixed(2)}` },
                { step: '40', type: 'NET', name: 'Net Value', value: subtotal.toFixed(2) },
                { step: '50', type: 'MWST', name: 'Output Tax', value: tax.toFixed(2) },
                { step: '60', type: '', name: 'Grand Total', value: `${grandTotal.toFixed(2)} USD` },
              ]}
            />
          </SectionCard>

          <SectionCard title="FI Document Lines">
            <SapTable
              columns={[
                { key: 'pk', label: 'PK' },
                { key: 'account', label: 'GL Account' },
                { key: 'description', label: 'Description' },
                { key: 'debit', label: 'Debit', align: 'right' },
                { key: 'credit', label: 'Credit', align: 'right' },
              ]}
              rows={[
                { pk: '01', account: '140000', description: 'Trade Receivable', debit: grandTotal.toFixed(2), credit: '' },
                { pk: '50', account: '800000', description: 'Revenue Domestic', debit: '', credit: subtotal.toFixed(2) },
                { pk: '50', account: '175000', description: 'Output Tax Payable', debit: '', credit: tax.toFixed(2) },
              ]}
            />
          </SectionCard>
        </motion.div>
      </TransactionScreenTemplate>
    </PageTransition>
  )
}
