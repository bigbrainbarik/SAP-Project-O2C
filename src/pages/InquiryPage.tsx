import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionCard } from '../components/common/SectionCard'
import { SapField } from '../components/common/SapField'
import { SapTable } from '../components/common/SapTable'
import { PageTransition } from '../components/common/PageTransition'
import { TransactionScreenTemplate } from '../components/simulation/TransactionScreenTemplate'
import { useSimulator } from '../context/SimulatorContext'
import { nextInquiryId } from '../utils/documentIds'
import { SoundManager } from '../utils/sound'
import { sapData } from '../data/sapData'

export const InquiryPage = () => {
  const { setDocument, pushMessage, state } = useSimulator()

  const [customer, setCustomer] = useState(sapData.customers[0].id)
  const [material, setMaterial] = useState(sapData.materials[0].id)
  const [quantity, setQuantity] = useState('50')
  const [reqDate, setReqDate] = useState('2024-06-15')
  const [notes, setNotes] = useState('Customer inquired about bulk pricing')

  const selectedCustomer = sapData.customers.find((c) => c.id === customer)
  const selectedMaterial = sapData.materials.find((m) => m.id === material)
  const basePrice = selectedMaterial?.price ?? 0
  const qty = parseInt(quantity) || 0
  const totalValue = basePrice * qty

  const onSave = () => {
    if (!quantity || qty <= 0) {
      pushMessage({ type: 'error', title: 'Validation Error', detail: 'Quantity must be greater than 0.' })
      if (state.preferences.soundEnabled) SoundManager.error()
      return
    }
    const inquiryId = nextInquiryId()
    setDocument('inquiryId', inquiryId)
    pushMessage({ type: 'success', title: 'Inquiry created', detail: `Inquiry document ${inquiryId} created successfully.` })
    if (state.preferences.soundEnabled) SoundManager.save()
  }

  return (
    <PageTransition>
      <TransactionScreenTemplate
        step="inquiry"
        title="Create Customer Inquiry (VA11)"
        subtitle="Pre-sales document — initial demand capture"
        next="quotation"
        onSave={onSave}
        saveLabel="Save Inquiry"
      >
        <motion.div
          className="grid gap-4 lg:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SectionCard title="Inquiry Header">
            <div className="space-y-3">
              <SapField label="Inquiry Type" value="AF (Customer Inquiry)" />
              <SapField label="Sales Org" value={sapData.salesAreas.salesOrg} />
              <SapField label="Dist. Channel" value={sapData.salesAreas.distChannel} />
              <SapField label="Division" value={sapData.salesAreas.division} />
              <SapField
                label="Customer"
                value={customer}
                editable
                mandatory
                type="select"
                options={sapData.customers.map((c) => ({ label: `${c.id} — ${c.name}`, value: c.id }))}
                onChange={setCustomer}
              />
              <SapField label="Req. Del. Date" value={reqDate} editable type="date" onChange={setReqDate} />
            </div>
          </SectionCard>

          <SectionCard title="Customer Information">
            <div className="space-y-3">
              <SapField label="Name" value={selectedCustomer?.name ?? ''} />
              <SapField label="City" value={selectedCustomer?.city ?? ''} />
              <SapField label="Country" value={selectedCustomer?.country ?? ''} />
              <SapField label="Credit Limit" value={`${(selectedCustomer?.creditLimit ?? 0).toLocaleString()} USD`} />
              <SapField label="Payment Terms" value={selectedCustomer?.terms ?? ''} />
              <SapField label="Incoterms" value={selectedCustomer?.incoterms ?? ''} />
            </div>
          </SectionCard>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionCard title="Item Details">
            <div className="mb-4 flex flex-wrap items-end gap-4">
              <div className="flex-1">
                <SapField
                  label="Material"
                  value={material}
                  editable
                  mandatory
                  type="select"
                  options={sapData.materials.map((m) => ({ label: `${m.id} — ${m.name}`, value: m.id }))}
                  onChange={setMaterial}
                />
              </div>
              <div className="w-[200px]">
                <SapField
                  label="Quantity"
                  value={quantity}
                  editable
                  mandatory
                  type="number"
                  onChange={setQuantity}
                />
              </div>
            </div>

            <SapTable
              columns={[
                { key: 'item', label: 'Item', width: '60px' },
                { key: 'material', label: 'Material' },
                { key: 'description', label: 'Description' },
                { key: 'qty', label: 'Quantity', align: 'right' },
                { key: 'uom', label: 'UOM' },
                { key: 'price', label: 'Unit Price', align: 'right' },
                { key: 'value', label: 'Net Value', align: 'right' },
              ]}
              rows={[
                {
                  item: '10',
                  material: selectedMaterial?.id ?? '',
                  description: selectedMaterial?.name ?? '',
                  qty: qty,
                  uom: selectedMaterial?.uom ?? '',
                  price: `${basePrice.toFixed(2)}`,
                  value: `${totalValue.toFixed(2)} USD`,
                },
              ]}
            />
          </SectionCard>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionCard title="Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-20 w-full rounded-md border border-outline/30 bg-surface-container-lowest p-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 dark:bg-surface-container"
              placeholder="Enter inquiry notes..."
            />
          </SectionCard>
        </motion.div>
      </TransactionScreenTemplate>
    </PageTransition>
  )
}
