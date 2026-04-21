import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionCard } from '../components/common/SectionCard'
import { SapField } from '../components/common/SapField'
import { SapTable } from '../components/common/SapTable'
import { StatusBadge } from '../components/common/StatusBadge'
import { PageTransition } from '../components/common/PageTransition'
import { TransactionScreenTemplate } from '../components/simulation/TransactionScreenTemplate'
import { useSimulator } from '../context/SimulatorContext'
import { nextGoodsIssueId } from '../utils/documentIds'
import { SoundManager } from '../utils/sound'
import { sapData } from '../data/sapData'

export const GoodsIssuePage = () => {
  const { state, setDocument, pushMessage } = useSimulator()
  const [posted, setPosted] = useState(false)

  const selectedMaterial = sapData.materials[0]
  const qty = 100

  const onSave = () => {
    const goodsIssueId = nextGoodsIssueId()
    setDocument('goodsIssueId', goodsIssueId)
    setPosted(true)
    pushMessage({
      type: 'success',
      title: 'Goods Issue posted',
      detail: `Material document ${goodsIssueId} posted. Inventory updated. FI document generated.`,
    })
    if (state.preferences.soundEnabled) SoundManager.save()
  }

  return (
    <PageTransition>
      <TransactionScreenTemplate
        step="goods-issue"
        title="Post Goods Issue (VL02N)"
        subtitle="Delivery execution and FI/CO integration"
        previous="delivery"
        next="billing"
        onSave={onSave}
        saveLabel="Post Goods Issue"
      >
        <motion.div
          className="grid gap-4 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SectionCard title="Goods Issue Header">
            <div className="space-y-3">
              <SapField label="Delivery" value={state.documents.deliveryId ?? '—'} />
              <SapField label="Sales Order" value={state.documents.salesOrderId ?? '—'} />
              <SapField label="Posting Date" value={new Date().toISOString().slice(0, 10)} />
              <SapField label="Document Date" value={new Date().toISOString().slice(0, 10)} />
              <SapField label="Movement Type" value="601 (GI for Delivery)" />
              <div className="pt-2">
                <StatusBadge status={posted ? 'complete' : 'processing'} label={posted ? 'Posted' : 'Ready to Post'} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Material Movement">
            <div className="space-y-3">
              <SapField label="Material" value={`${selectedMaterial.id} — ${selectedMaterial.name}`} />
              <SapField label="Plant" value={selectedMaterial.plant} />
              <SapField label="Storage Loc" value={selectedMaterial.storage} />
              <SapField label="Quantity" value={`${qty} ${selectedMaterial.uom}`} />
              <SapField label="Batch" value="BATCH-001" />
            </div>
          </SectionCard>

          <SectionCard title="Accounting Impact">
            <div className="space-y-3">
              <SapField label="Debit GL" value="500000 — COGS" />
              <SapField label="Credit GL" value="300000 — Inventory" />
              <SapField label="Cost Center" value="CC-4100" />
              <SapField label="Profit Center" value="PC-1000" />
              <SapField label="Value" value={`${(selectedMaterial.price * qty).toFixed(2)} USD`} />
            </div>
          </SectionCard>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionCard title="Material Document Items">
            <SapTable
              columns={[
                { key: 'item', label: 'Item', width: '50px' },
                { key: 'mvt', label: 'Mvt Type' },
                { key: 'material', label: 'Material' },
                { key: 'description', label: 'Description' },
                { key: 'qty', label: 'Quantity', align: 'right' },
                { key: 'uom', label: 'UOM' },
                { key: 'plant', label: 'Plant' },
                { key: 'sloc', label: 'SLoc' },
                { key: 'value', label: 'Value', align: 'right' },
              ]}
              rows={[
                {
                  item: '1',
                  mvt: '601',
                  material: selectedMaterial.id,
                  description: selectedMaterial.name,
                  qty: qty,
                  uom: selectedMaterial.uom,
                  plant: selectedMaterial.plant,
                  sloc: selectedMaterial.storage,
                  value: `${(selectedMaterial.price * qty).toFixed(2)}`,
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
          <SectionCard title="Stock Before/After">
            <SapTable
              columns={[
                { key: 'type', label: 'Stock Type' },
                { key: 'before', label: 'Before GI', align: 'right' },
                { key: 'after', label: 'After GI', align: 'right' },
                { key: 'uom', label: 'UOM' },
              ]}
              rows={[
                { type: 'Unrestricted', before: 500, after: posted ? 500 - qty : 500, uom: selectedMaterial.uom },
                { type: 'In Transit', before: 0, after: posted ? qty : 0, uom: selectedMaterial.uom },
                { type: 'Quality Insp.', before: 20, after: 20, uom: selectedMaterial.uom },
                { type: 'Blocked', before: 0, after: 0, uom: selectedMaterial.uom },
              ]}
            />
          </SectionCard>

          <SectionCard title="FI Document Preview">
            <SapTable
              columns={[
                { key: 'pk', label: 'PK' },
                { key: 'account', label: 'GL Account' },
                { key: 'description', label: 'Description' },
                { key: 'debit', label: 'Debit', align: 'right' },
                { key: 'credit', label: 'Credit', align: 'right' },
              ]}
              rows={[
                { pk: '40', account: '500000', description: 'Cost of Goods Sold', debit: `${(selectedMaterial.price * qty).toFixed(2)}`, credit: '' },
                { pk: '50', account: '300000', description: 'Finished Goods', debit: '', credit: `${(selectedMaterial.price * qty).toFixed(2)}` },
              ]}
            />
          </SectionCard>
        </motion.div>
      </TransactionScreenTemplate>
    </PageTransition>
  )
}
