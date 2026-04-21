import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, PackageMinus, AlertTriangle } from 'lucide-react'
import { SectionCard } from '../components/common/SectionCard'
import { SapField } from '../components/common/SapField'
import { SapTable } from '../components/common/SapTable'
import { StatusBadge } from '../components/common/StatusBadge'
import { PageTransition } from '../components/common/PageTransition'
import { TransactionScreenTemplate } from '../components/simulation/TransactionScreenTemplate'
import { useSimulator } from '../context/SimulatorContext'
import { nextDeliveryId } from '../utils/documentIds'
import { SoundManager } from '../utils/sound'
import { sapData } from '../data/sapData'

export const DeliveryPage = () => {
  const { state, setDocument, pushMessage } = useSimulator()

  const [shippingPoint, setShippingPoint] = useState('SP01')
  const [deliveryDate] = useState('2024-06-20')
  const [pickingStatus, setPickingStatus] = useState<'pending' | 'picked' | 'partial'>('pending')
  const [stockBlocked, setStockBlocked] = useState(false)
  const [stockResolved, setStockResolved] = useState(false)
  const [deliveryQty, setDeliveryQty] = useState(100)

  const selectedMaterial = sapData.materials[0]
  const totalWeight = selectedMaterial.weight * deliveryQty

  const handleDelayDelivery = () => {
    setStockBlocked(false)
    setStockResolved(true)
    setPickingStatus('pending')
    pushMessage({
      type: 'warning',
      title: 'Delivery delayed',
      detail: 'Delivery rescheduled to next available date. Lead time extended by 5 business days.',
    })
    if (state.preferences.soundEnabled) SoundManager.warning()
  }

  const handlePartialDelivery = () => {
    const partial = Math.floor(deliveryQty * 0.6)
    setDeliveryQty(partial)
    setStockBlocked(false)
    setStockResolved(true)
    setPickingStatus('partial')
    pushMessage({
      type: 'warning',
      title: 'Partial delivery created',
      detail: `Delivery quantity reduced to ${partial}. Backorder created for remaining ${deliveryQty - partial} units.`,
    })
    if (state.preferences.soundEnabled) SoundManager.warning()
  }

  const onSave = () => {
    if (state.scenario === 'stock' && !stockResolved) {
      setStockBlocked(true)
      pushMessage({
        type: 'error',
        title: 'Material not available',
        detail: `Insufficient stock for ${selectedMaterial.id}. Available: 60 PC. Required: ${deliveryQty} PC.`,
      })
      if (state.preferences.soundEnabled) SoundManager.error()
      return
    }

    setPickingStatus(stockResolved && pickingStatus === 'partial' ? 'partial' : 'picked')
    const deliveryId = nextDeliveryId()
    setDocument('deliveryId', deliveryId)
    pushMessage({ type: 'success', title: 'Delivery created', detail: `Outbound delivery ${deliveryId} created with ${deliveryQty} units.` })
    if (state.preferences.soundEnabled) SoundManager.save()
  }

  return (
    <PageTransition>
      <TransactionScreenTemplate
        step="delivery"
        title="Create Outbound Delivery (VL01N)"
        subtitle={`Reference Sales Order: ${state.documents.salesOrderId ?? '—'}`}
        previous="sales-order"
        next="goods-issue"
        onSave={onSave}
        saveLabel="Save Delivery"
      >
        {/* Stock Issue Block */}
        <AnimatePresence>
          {stockBlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-4 rounded-xl border-2 border-amber-500/60 bg-amber-50 p-5 dark:bg-amber-950/30"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={22} />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400">Stock Not Available</h3>
                  <p className="mt-1 text-sm text-amber-600 dark:text-amber-300">
                    Material <strong>{selectedMaterial.id}</strong> has insufficient stock.
                    Available: <strong>60 PC</strong> | Required: <strong>{deliveryQty} PC</strong>
                  </p>
                  <p className="mt-1 text-xs text-amber-500">
                    Plant: {selectedMaterial.plant} | Storage Loc: {selectedMaterial.storage} | ATP check: Failed
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleDelayDelivery}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                    >
                      <Clock size={14} />
                      Delay Delivery (+5 Days)
                    </button>
                    <button
                      type="button"
                      onClick={handlePartialDelivery}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/30"
                    >
                      <PackageMinus size={14} />
                      Partial Delivery (60%)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {stockResolved && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-50/50 p-3 dark:bg-amber-950/20">
            <Clock size={18} className="text-amber-600" />
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              {pickingStatus === 'partial' ? 'Partial delivery created — backorder pending' : 'Delivery delayed — rescheduled'}
            </p>
          </div>
        )}

        <motion.div
          className="grid gap-4 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SectionCard title="Delivery Header">
            <div className="space-y-3">
              <SapField label="Delivery Type" value="LF (Standard)" />
              <SapField
                label="Shipping Point"
                value={shippingPoint}
                editable
                type="select"
                options={sapData.shippingPoints.map((sp) => ({ label: `${sp.id} — ${sp.name}`, value: sp.id }))}
                onChange={setShippingPoint}
              />
              <SapField label="Del. Date" value={deliveryDate} />
              <SapField label="Sales Order" value={state.documents.salesOrderId ?? '—'} />
              <SapField label="Ref. Quotation" value={state.documents.quotationId ?? '—'} />
            </div>
          </SectionCard>

          <SectionCard title="Picking & Storage">
            <div className="space-y-3">
              <SapField label="Picking Status" value={pickingStatus === 'picked' ? 'A (Picked)' : pickingStatus === 'partial' ? 'B (Partial)' : 'Not Started'} />
              <SapField label="Storage Location" value={selectedMaterial.storage} />
              <SapField label="Plant" value={selectedMaterial.plant} />
              <SapField label="Warehouse" value="Main Warehouse" />
              <div className="pt-2">
                <StatusBadge status={pickingStatus === 'picked' ? 'complete' : pickingStatus === 'partial' ? 'warning' : 'pending'} label={`Picking: ${pickingStatus}`} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Weight & Volume">
            <div className="space-y-3">
              <SapField label="Gross Weight" value={`${totalWeight.toFixed(1)} KG`} />
              <SapField label="Net Weight" value={`${(totalWeight * 0.95).toFixed(1)} KG`} />
              <SapField label="Volume" value={`${(deliveryQty * 0.05).toFixed(2)} M³`} />
              <SapField label="Loading Group" value="Z001" />
              <SapField label="Route" value="R00001" />
            </div>
          </SectionCard>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionCard title="Delivery Items">
            <SapTable
              columns={[
                { key: 'item', label: 'Item', width: '50px' },
                { key: 'material', label: 'Material' },
                { key: 'description', label: 'Description' },
                { key: 'delQty', label: 'Del. Qty', align: 'right' },
                { key: 'picked', label: 'Picked', align: 'right' },
                { key: 'uom', label: 'UOM' },
                { key: 'plant', label: 'Plant' },
                { key: 'sloc', label: 'SLoc' },
                { key: 'batch', label: 'Batch' },
              ]}
              rows={[
                {
                  item: '10',
                  material: selectedMaterial.id,
                  description: selectedMaterial.name,
                  delQty: deliveryQty,
                  picked: pickingStatus === 'picked' ? deliveryQty : pickingStatus === 'partial' ? deliveryQty : 0,
                  uom: selectedMaterial.uom,
                  plant: selectedMaterial.plant,
                  sloc: selectedMaterial.storage,
                  batch: 'BATCH-001',
                },
              ]}
            />
          </SectionCard>
        </motion.div>
      </TransactionScreenTemplate>
    </PageTransition>
  )
}
