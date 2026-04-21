import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionCard } from '../components/common/SectionCard'
import { SapField } from '../components/common/SapField'
import { SapTable } from '../components/common/SapTable'
import { PageTransition } from '../components/common/PageTransition'
import { TransactionScreenTemplate } from '../components/simulation/TransactionScreenTemplate'
import { useSimulator } from '../context/SimulatorContext'
import { nextQuotationId } from '../utils/documentIds'
import { SoundManager } from '../utils/sound'
import { sapData } from '../data/sapData'

export const QuotationPage = () => {
  const { state, setDocument, pushMessage } = useSimulator()

  const [customer] = useState(sapData.customers[0].id)
  const [material] = useState(sapData.materials[0].id)
  const [quantity, setQuantity] = useState('50')
  const [validFrom] = useState('2024-06-01')
  const [validTo, setValidTo] = useState('2024-07-31')

  const selectedCustomer = sapData.customers.find((c) => c.id === customer)
  const selectedMaterial = sapData.materials.find((m) => m.id === material)
  const basePrice = selectedMaterial?.price ?? 0
  const qty = parseInt(quantity) || 0
  const discount = basePrice * sapData.pricingConditions.K004.pct / 100
  const netPrice = basePrice - discount
  const totalValue = netPrice * qty

  const onSave = () => {
    if (qty <= 0) {
      pushMessage({ type: 'error', title: 'Validation Error', detail: 'Quantity must be greater than 0.' })
      if (state.preferences.soundEnabled) SoundManager.error()
      return
    }
    const quotationId = nextQuotationId()
    setDocument('quotationId', quotationId)
    pushMessage({ type: 'success', title: 'Quotation created', detail: `Quotation ${quotationId} is now in review state.` })
    if (state.preferences.soundEnabled) SoundManager.save()
  }

  return (
    <PageTransition>
      <TransactionScreenTemplate
        step="quotation"
        title="Create Quotation (VA21)"
        subtitle="Sales quotation with pricing conditions"
        previous="inquiry"
        next="sales-order"
        onSave={onSave}
        saveLabel="Save Quotation"
      >
        <motion.div
          className="grid gap-4 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SectionCard title="Quotation Header" className="lg:col-span-1">
            <div className="space-y-3">
              <SapField label="Doc. Type" value="AG (Quotation)" />
              <SapField label="Sales Org" value={sapData.salesAreas.salesOrg} />
              <SapField label="Dist. Channel" value={sapData.salesAreas.distChannel} />
              <SapField label="Division" value={sapData.salesAreas.division} />
              <SapField label="Ref. Inquiry" value={state.documents.inquiryId ?? '—'} />
            </div>
          </SectionCard>

          <SectionCard title="Customer" className="lg:col-span-1">
            <div className="space-y-3">
              <SapField label="Sold-to Party" value={`${customer} — ${selectedCustomer?.name}`} />
              <SapField label="Ship-to Party" value={customer} />
              <SapField label="City" value={selectedCustomer?.city ?? ''} />
              <SapField label="Incoterms" value={selectedCustomer?.incoterms ?? ''} />
              <SapField label="Payment Terms" value={selectedCustomer?.terms ?? ''} />
            </div>
          </SectionCard>

          <SectionCard title="Validity Period" className="lg:col-span-1">
            <div className="space-y-3">
              <SapField label="Valid From" value={validFrom} />
              <SapField label="Valid To" value={validTo} editable type="date" onChange={setValidTo} />
              <SapField label="Currency" value="USD" />
              <SapField label="PO Number" value="PO-998877" />
            </div>
          </SectionCard>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionCard title="Item Overview">
            <div className="mb-3 w-[200px]">
              <SapField label="Quantity" value={quantity} editable mandatory type="number" onChange={setQuantity} />
            </div>
            <SapTable
              columns={[
                { key: 'item', label: 'Item', width: '60px' },
                { key: 'material', label: 'Material' },
                { key: 'description', label: 'Description' },
                { key: 'qty', label: 'Qty', align: 'right' },
                { key: 'uom', label: 'UOM' },
                { key: 'price', label: 'Unit Price', align: 'right' },
                { key: 'discount', label: 'Discount', align: 'right' },
                { key: 'net', label: 'Net Price', align: 'right' },
                { key: 'value', label: 'Total', align: 'right' },
              ]}
              rows={[
                {
                  item: '10',
                  material: selectedMaterial?.id ?? '',
                  description: selectedMaterial?.name ?? '',
                  qty: qty,
                  uom: selectedMaterial?.uom ?? '',
                  price: basePrice.toFixed(2),
                  discount: `-${discount.toFixed(2)} (${sapData.pricingConditions.K004.pct}%)`,
                  net: netPrice.toFixed(2),
                  value: `${totalValue.toFixed(2)} USD`,
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
          <SectionCard title="Pricing Conditions">
            <SapTable
              columns={[
                { key: 'type', label: 'Cond. Type' },
                { key: 'name', label: 'Description' },
                { key: 'rate', label: 'Rate', align: 'right' },
                { key: 'amount', label: 'Value', align: 'right' },
              ]}
              rows={[
                { type: 'PR00', name: 'Base Price', rate: `${basePrice.toFixed(2)}`, amount: `${(basePrice * qty).toFixed(2)}` },
                { type: 'K004', name: 'Material Discount', rate: `-${sapData.pricingConditions.K004.pct}%`, amount: `-${(discount * qty).toFixed(2)}` },
                { type: 'NET', name: 'Net Value', rate: '', amount: `${totalValue.toFixed(2)} USD` },
              ]}
            />
          </SectionCard>

          <SectionCard title="Status">
            <div className="space-y-3">
              <SapField label="Overall Status" value="Open" />
              <SapField label="Delivery Status" value="Not yet processed" />
              <SapField label="Billing Status" value="Not yet billed" />
              <SapField label="Rejection" value="Not rejected" />
            </div>
          </SectionCard>
        </motion.div>
      </TransactionScreenTemplate>
    </PageTransition>
  )
}
