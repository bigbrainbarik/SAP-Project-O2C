import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionCard } from '../components/common/SectionCard'
import { SapField } from '../components/common/SapField'
import { SapTable } from '../components/common/SapTable'
import { StatusBadge } from '../components/common/StatusBadge'
import { PageTransition } from '../components/common/PageTransition'
import { TransactionScreenTemplate } from '../components/simulation/TransactionScreenTemplate'
import { useSimulator } from '../context/SimulatorContext'
import { nextPaymentId } from '../utils/documentIds'
import { SoundManager } from '../utils/sound'
import { sapData } from '../data/sapData'

export const PaymentPage = () => {
  const { state, setDocument, pushMessage } = useSimulator()
  const [paymentAmount, setPaymentAmount] = useState('')
  const [cleared, setCleared] = useState(false)

  const selectedCustomer = sapData.customers[0]
  const selectedMaterial = sapData.materials[0]
  const qty = 100
  const basePrice = selectedMaterial.price
  const matDiscount = basePrice * sapData.pricingConditions.K004.pct / 100
  const custDiscount = basePrice * sapData.pricingConditions.K007.pct / 100
  const netPrice = basePrice - matDiscount - custDiscount
  const subtotal = netPrice * qty
  const tax = subtotal * sapData.pricingConditions.MWST.pct / 100
  const invoiceTotal = subtotal + tax

  const onSave = () => {
    const amount = parseFloat(paymentAmount) || invoiceTotal
    if (amount <= 0) {
      pushMessage({ type: 'error', title: 'Invalid amount', detail: 'Payment amount must be greater than 0.' })
      if (state.preferences.soundEnabled) SoundManager.error()
      return
    }

    const paymentId = nextPaymentId()
    setDocument('paymentId', paymentId)
    setCleared(true)

    if (amount < invoiceTotal) {
      pushMessage({
        type: 'warning',
        title: 'Partial payment posted',
        detail: `Payment ${paymentId}: ${amount.toFixed(2)} USD received. Remaining balance: ${(invoiceTotal - amount).toFixed(2)} USD.`,
      })
    } else {
      pushMessage({
        type: 'success',
        title: 'Payment posted & cleared',
        detail: `Payment document ${paymentId} cleared all open receivables of ${invoiceTotal.toFixed(2)} USD.`,
      })
    }
    if (state.preferences.soundEnabled) SoundManager.save()
  }

  return (
    <PageTransition>
      <TransactionScreenTemplate
        step="payment"
        title="Post Incoming Payment (F-28)"
        subtitle="Accounts receivable clearing"
        previous="billing"
        next="summary"
        onSave={onSave}
        saveLabel="Post Payment"
      >
        <motion.div
          className="grid gap-4 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <SectionCard title="Payment Header">
            <div className="space-y-3">
              <SapField label="Document Type" value="DZ (Customer Payment)" />
              <SapField label="Company Code" value="KSAL" />
              <SapField label="Posting Date" value={new Date().toISOString().slice(0, 10)} />
              <SapField label="Period" value="06/2024" />
              <SapField label="Currency" value="USD" />
              <SapField
                label="Amount"
                value={paymentAmount || String(invoiceTotal.toFixed(2))}
                editable
                mandatory
                type="number"
                onChange={setPaymentAmount}
              />
            </div>
          </SectionCard>

          <SectionCard title="Customer Account">
            <div className="space-y-3">
              <SapField label="Customer" value={`${selectedCustomer.id} — ${selectedCustomer.name}`} />
              <SapField label="GL Account" value="140000 — Trade Receivable" />
              <SapField label="Credit Limit" value={`${selectedCustomer.creditLimit.toLocaleString()} USD`} />
              <SapField label="Open Items" value={cleared ? '0' : '1'} />
              <SapField label="Balance" value={cleared ? '0.00 USD' : `${invoiceTotal.toFixed(2)} USD`} />
              <div className="pt-2">
                <StatusBadge status={cleared ? 'complete' : 'pending'} label={cleared ? 'Cleared' : 'Open'} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Bank Details">
            <div className="space-y-3">
              <SapField label="Bank GL" value="113100 — Bank Account" />
              <SapField label="Bank Key" value="HDFC0001234" />
              <SapField label="Reference" value={state.documents.billingId ?? '—'} />
              <SapField label="Text" value="Customer payment for invoice" />
              <SapField label="Value Date" value={new Date().toISOString().slice(0, 10)} />
            </div>
          </SectionCard>
        </motion.div>

        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionCard title="Open Items — Select for Clearing">
            <SapTable
              columns={[
                { key: 'select', label: '✓', width: '40px', align: 'center' },
                { key: 'docNo', label: 'Doc No' },
                { key: 'type', label: 'Type' },
                { key: 'date', label: 'Doc Date' },
                { key: 'dueDate', label: 'Due Date' },
                { key: 'amount', label: 'Amount', align: 'right' },
                { key: 'currency', label: 'Curr' },
                { key: 'status', label: 'Status' },
              ]}
              rows={[
                {
                  select: '☑',
                  docNo: state.documents.billingId ?? '—',
                  type: 'RV (Invoice)',
                  date: new Date().toISOString().slice(0, 10),
                  dueDate: '2024-07-20',
                  amount: invoiceTotal.toFixed(2),
                  currency: 'USD',
                  status: cleared ? 'Cleared' : 'Open',
                },
              ]}
              highlightRow={0}
            />
          </SectionCard>
        </motion.div>

        <motion.div
          className="mt-4 grid gap-4 lg:grid-cols-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionCard title="Clearing Preview">
            <SapTable
              columns={[
                { key: 'pk', label: 'PK' },
                { key: 'account', label: 'Account' },
                { key: 'description', label: 'Description' },
                { key: 'debit', label: 'Debit', align: 'right' },
                { key: 'credit', label: 'Credit', align: 'right' },
              ]}
              rows={[
                { pk: '40', account: '113100', description: 'Bank Account', debit: invoiceTotal.toFixed(2), credit: '' },
                { pk: '15', account: '140000', description: 'Customer Receivable', debit: '', credit: invoiceTotal.toFixed(2) },
              ]}
            />
          </SectionCard>

          <SectionCard title="Transaction Summary">
            <div className="space-y-3">
              <SapField label="Invoice Ref" value={state.documents.billingId ?? '—'} />
              <SapField label="Invoice Amount" value={`${invoiceTotal.toFixed(2)} USD`} />
              <SapField label="Payment" value={`${(parseFloat(paymentAmount) || invoiceTotal).toFixed(2)} USD`} />
              <div className="border-t border-outline/20 pt-3">
                <SapField
                  label="Balance"
                  value={`${Math.max(0, invoiceTotal - (parseFloat(paymentAmount) || invoiceTotal)).toFixed(2)} USD`}
                />
              </div>
            </div>
          </SectionCard>
        </motion.div>
      </TransactionScreenTemplate>
    </PageTransition>
  )
}
