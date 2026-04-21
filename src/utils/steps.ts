import type { SimulationStep } from '../types'

export const STEP_ORDER: SimulationStep[] = [
  'inquiry',
  'quotation',
  'sales-order',
  'delivery',
  'goods-issue',
  'billing',
  'payment',
  'summary',
]

export const STEP_LABELS: Record<SimulationStep, string> = {
  inquiry: 'Inquiry',
  quotation: 'Quotation',
  'sales-order': 'Sales Order (VA01)',
  delivery: 'Delivery (VL01N)',
  'goods-issue': 'Goods Issue (VL02N)',
  billing: 'Billing (VF01)',
  payment: 'Payment (F-28)',
  summary: 'Summary',
}

export const STEP_PATHS: Record<SimulationStep, string> = {
  inquiry: '/simulation/inquiry',
  quotation: '/simulation/quotation',
  'sales-order': '/simulation/sales-order',
  delivery: '/simulation/delivery',
  'goods-issue': '/simulation/goods-issue',
  billing: '/simulation/billing',
  payment: '/simulation/payment',
  summary: '/summary',
}

export const getStepIndex = (step: SimulationStep): number =>
  STEP_ORDER.indexOf(step)
