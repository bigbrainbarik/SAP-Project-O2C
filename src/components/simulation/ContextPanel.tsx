import { useSimulator } from '../../context/SimulatorContext'

export const ContextPanel = () => {
  const { state } = useSimulator()

  return (
    <div className="space-y-3">
      <section className="rounded-xl bg-surface-container-low p-4 ring-1 ring-outline/20 dark:bg-surface-container">
        <h3 className="text-sm font-semibold uppercase tracking-wide">Simulation Context</h3>
        <p className="mt-2 text-xs text-on-surface/70 dark:text-inverse-on-surface/70">
          Scenario: <span className="font-semibold text-primary">{state.scenario ?? 'Not Selected'}</span>
        </p>
      </section>

      <section className="rounded-xl bg-surface-container-low p-4 ring-1 ring-outline/20 dark:bg-surface-container">
        <h3 className="text-sm font-semibold uppercase tracking-wide">Document Chain</h3>
        <div className="mt-2 space-y-2 text-xs">
          <p>Inquiry: {state.documents.inquiryId ?? '-'}</p>
          <p>Quotation: {state.documents.quotationId ?? '-'}</p>
          <p>Sales Order: {state.documents.salesOrderId ?? '-'}</p>
          <p>Delivery: {state.documents.deliveryId ?? '-'}</p>
          <p>Goods Issue: {state.documents.goodsIssueId ?? '-'}</p>
          <p>Billing: {state.documents.billingId ?? '-'}</p>
          <p>Payment: {state.documents.paymentId ?? '-'}</p>
        </div>
      </section>
    </div>
  )
}
