import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionCard } from '../components/common/SectionCard'
import { SapField } from '../components/common/SapField'
import { SapTable } from '../components/common/SapTable'
import { PageTransition } from '../components/common/PageTransition'
import { sapData } from '../data/sapData'

type Tab = 'customer' | 'material' | 'info'

export const MasterDataPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('customer')
  const [selectedCustomer, setSelectedCustomer] = useState(0)
  const [selectedMaterial, setSelectedMaterial] = useState(0)

  const tabs: { key: Tab; label: string; tcode: string }[] = [
    { key: 'customer', label: 'Customer Master', tcode: 'XD01/XD02' },
    { key: 'material', label: 'Material Master', tcode: 'MM01' },
    { key: 'info', label: 'Customer-Material Info', tcode: 'VD51' },
  ]

  const cust = sapData.customers[selectedCustomer]
  const mat = sapData.materials[selectedMaterial]

  return (
    <PageTransition>
      <div className="space-y-4">
        <section className="rounded-xl bg-surface-container-low p-6 ring-1 ring-outline/20 dark:bg-surface-container">
          <h1 className="font-heading text-4xl font-black tracking-tight">Master Data</h1>
          <p className="mt-2 text-sm text-on-surface/70 dark:text-inverse-on-surface/70">
            Core enterprise records — {sapData.customers.length} customers, {sapData.materials.length} materials.
          </p>
        </section>

        {/* Tab Navigation */}
        <div className="flex gap-1 rounded-xl bg-surface-container-low p-1 ring-1 ring-outline/20 dark:bg-surface-container">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'text-on-surface/70 hover:bg-surface-container hover:text-primary dark:text-inverse-on-surface/70'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-70">({tab.tcode})</span>
            </button>
          ))}
        </div>

        {/* Customer Master */}
        {activeTab === 'customer' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-4 flex gap-2">
              {sapData.customers.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCustomer(i)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedCustomer === i
                      ? 'bg-primary-fixed text-primary ring-1 ring-primary/40'
                      : 'bg-surface-container text-on-surface/60 hover:text-primary dark:bg-inverse-surface dark:text-inverse-on-surface/60'
                  }`}
                >
                  {c.id}
                </button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <SectionCard title="General Data">
                <div className="space-y-3">
                  <SapField label="Customer ID" value={cust.id} />
                  <SapField label="Name" value={cust.name} />
                  <SapField label="City" value={cust.city} />
                  <SapField label="Country" value={cust.country} />
                  <SapField label="Tax ID" value={cust.taxId} />
                  <SapField label="Language" value="EN" />
                  <SapField label="Industry" value="Manufacturing" />
                </div>
              </SectionCard>

              <SectionCard title="Sales Area Data">
                <div className="space-y-3">
                  <SapField label="Sales Org" value={sapData.salesAreas.salesOrg} />
                  <SapField label="Dist. Channel" value={sapData.salesAreas.distChannel} />
                  <SapField label="Division" value={sapData.salesAreas.division} />
                  <SapField label="Credit Limit" value={`${cust.creditLimit.toLocaleString()} USD`} />
                  <SapField label="Payment Terms" value={cust.terms} />
                  <SapField label="Incoterms" value={cust.incoterms} />
                  <SapField label="Customer Group" value="01 (Domestic)" />
                </div>
              </SectionCard>

              <SectionCard title="Partner Functions" className="lg:col-span-2">
                <SapTable
                  columns={[
                    { key: 'function', label: 'Partner Function' },
                    { key: 'partner', label: 'Partner No' },
                    { key: 'name', label: 'Name' },
                    { key: 'city', label: 'City' },
                  ]}
                  rows={[
                    { function: 'SP (Sold-to Party)', partner: cust.id, name: cust.name, city: cust.city },
                    { function: 'SH (Ship-to Party)', partner: cust.id, name: cust.name, city: cust.city },
                    { function: 'BP (Bill-to Party)', partner: cust.id, name: cust.name, city: cust.city },
                    { function: 'PY (Payer)', partner: cust.id, name: cust.name, city: cust.city },
                  ]}
                />
              </SectionCard>
            </div>
          </motion.div>
        )}

        {/* Material Master */}
        {activeTab === 'material' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-4 flex gap-2">
              {sapData.materials.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMaterial(i)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    selectedMaterial === i
                      ? 'bg-primary-fixed text-primary ring-1 ring-primary/40'
                      : 'bg-surface-container text-on-surface/60 hover:text-primary dark:bg-inverse-surface dark:text-inverse-on-surface/60'
                  }`}
                >
                  {m.id}
                </button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <SectionCard title="Basic Data 1">
                <div className="space-y-3">
                  <SapField label="Material" value={mat.id} />
                  <SapField label="Description" value={mat.name} />
                  <SapField label="Base UOM" value={mat.uom} />
                  <SapField label="Material Group" value="001 (Industrial)" />
                  <SapField label="Gross Weight" value={`${mat.weight} KG`} />
                  <SapField label="Net Weight" value={`${(mat.weight * 0.95).toFixed(1)} KG`} />
                </div>
              </SectionCard>

              <SectionCard title="Sales: Sales Org Data">
                <div className="space-y-3">
                  <SapField label="Sales Org" value={sapData.salesAreas.salesOrg} />
                  <SapField label="Dist. Channel" value={sapData.salesAreas.distChannel} />
                  <SapField label="Base Price" value={`${mat.price.toFixed(2)} USD`} />
                  <SapField label="Tax Category" value="MWST (Output Tax)" />
                  <SapField label="Item Category Grp" value="NORM" />
                  <SapField label="Acct Assgt Group" value="01 (Domestic Rev)" />
                </div>
              </SectionCard>

              <SectionCard title="Plant / Storage">
                <div className="space-y-3">
                  <SapField label="Plant" value={mat.plant} />
                  <SapField label="Storage Loc" value={mat.storage} />
                  <SapField label="Lead Time" value={`${mat.leadTime} Days`} />
                  <SapField label="MRP Type" value="PD (MRP)" />
                  <SapField label="Safety Stock" value="50" />
                  <SapField label="Lot Size" value="EX (Exact)" />
                </div>
              </SectionCard>

              <SectionCard title="Accounting / Costing">
                <div className="space-y-3">
                  <SapField label="Valuation Class" value="3000" />
                  <SapField label="Price Control" value="S (Standard)" />
                  <SapField label="Standard Price" value={`${mat.price.toFixed(2)} USD`} />
                  <SapField label="Moving Avg" value={`${(mat.price * 0.98).toFixed(2)} USD`} />
                  <SapField label="Profit Center" value="PC-1000" />
                </div>
              </SectionCard>
            </div>
          </motion.div>
        )}

        {/* Customer-Material Info */}
        {activeTab === 'info' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SectionCard title="Customer-Material Information Record (VD51)">
              <SapTable
                columns={[
                  { key: 'customer', label: 'Customer' },
                  { key: 'material', label: 'Material' },
                  { key: 'custMat', label: 'Cust Material' },
                  { key: 'minOrd', label: 'Min Order', align: 'right' },
                  { key: 'plant', label: 'Plant' },
                  { key: 'priority', label: 'Priority' },
                  { key: 'atp', label: 'ATP Rule' },
                ]}
                rows={sapData.customers.flatMap((c) =>
                  sapData.materials.slice(0, 2).map((m) => ({
                    customer: c.id,
                    material: m.id,
                    custMat: `${c.id}-${m.id}`,
                    minOrd: 10,
                    plant: m.plant,
                    priority: 'High',
                    atp: 'SD01',
                  }))
                )}
              />
            </SectionCard>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <SectionCard title="Selected Record Details">
                <div className="space-y-3">
                  <SapField label="Customer" value={`${cust.id} — ${cust.name}`} />
                  <SapField label="Material" value={`${mat.id} — ${mat.name}`} />
                  <SapField label="Min Order Qty" value="10" />
                  <SapField label="Preferred Route" value="R001" />
                  <SapField label="Availability" value="Active" />
                </div>
              </SectionCard>

              <SectionCard title="Delivery Preferences">
                <div className="space-y-3">
                  <SapField label="Delivery Priority" value="01 (High)" />
                  <SapField label="Shipping Condition" value="01 (Standard)" />
                  <SapField label="Partial Delivery" value="C (Allowed)" />
                  <SapField label="Order Combination" value="X (Active)" />
                  <SapField label="Max Part. Del." value="3" />
                </div>
              </SectionCard>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
