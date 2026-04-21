const counters = {
  inquiry: 10000000,
  quotation: 20000000,
  salesOrder: 50000000,
  delivery: 80000000,
  goodsIssue: 70000000,
  billing: 90000000,
  payment: 14000000,
}

const nextNumeric = (key: keyof typeof counters): string => {
  counters[key] += 1
  return String(counters[key])
}

export const nextInquiryId = (): string => `INQ-${nextNumeric('inquiry')}`
export const nextQuotationId = (): string => `QT-${nextNumeric('quotation')}`
export const nextSalesOrderId = (): string => nextNumeric('salesOrder')
export const nextDeliveryId = (): string => nextNumeric('delivery')
export const nextGoodsIssueId = (): string => `GI-${nextNumeric('goodsIssue')}`
export const nextBillingId = (): string => nextNumeric('billing')
export const nextPaymentId = (): string => nextNumeric('payment')
