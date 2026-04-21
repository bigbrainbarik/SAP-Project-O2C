export type ScenarioType = 'normal' | 'credit' | 'stock' | null

export type SimulationStep =
  | 'inquiry'
  | 'quotation'
  | 'sales-order'
  | 'delivery'
  | 'goods-issue'
  | 'billing'
  | 'payment'
  | 'summary'

export type ThemeMode = 'light' | 'dark'

export type DocumentKey =
  | 'inquiryId'
  | 'quotationId'
  | 'salesOrderId'
  | 'deliveryId'
  | 'goodsIssueId'
  | 'billingId'
  | 'paymentId'

export interface Documents {
  inquiryId: string | null
  quotationId: string | null
  salesOrderId: string | null
  deliveryId: string | null
  goodsIssueId: string | null
  billingId: string | null
  paymentId: string | null
}

export interface SimulatorMessage {
  id: string
  type: 'success' | 'warning' | 'error'
  title: string
  detail: string
}

export interface Preferences {
  theme: ThemeMode
  soundEnabled: boolean
}

export interface SimulatorState {
  scenario: ScenarioType
  currentStep: SimulationStep
  completedSteps: SimulationStep[]
  documents: Documents
  messages: SimulatorMessage[]
  preferences: Preferences
}
