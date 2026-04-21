import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { BillingPage } from './pages/BillingPage'
import { DashboardPage } from './pages/DashboardPage'
import { DeliveryPage } from './pages/DeliveryPage'
import { DocumentFlowPage } from './pages/DocumentFlowPage'
import { GoodsIssuePage } from './pages/GoodsIssuePage'
import { InquiryPage } from './pages/InquiryPage'
import { LoaderPage } from './pages/LoaderPage'
import { LoginPage } from './pages/LoginPage'
import { MasterDataPage } from './pages/MasterDataPage'
import { OrgStructurePage } from './pages/OrgStructurePage'
import { PaymentPage } from './pages/PaymentPage'
import { QuotationPage } from './pages/QuotationPage'
import { SalesOrderPage } from './pages/SalesOrderPage'
import { SimulationSetupPage } from './pages/SimulationSetupPage'
import { SproPage } from './pages/SproPage'
import { SummaryPage } from './pages/SummaryPage'
import { TCodesPage } from './pages/TCodesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/loader" element={<LoaderPage />} />

      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/simulation/setup" element={<SimulationSetupPage />} />
        <Route path="/simulation/inquiry" element={<InquiryPage />} />
        <Route path="/simulation/quotation" element={<QuotationPage />} />
        <Route path="/simulation/sales-order" element={<SalesOrderPage />} />
        <Route path="/simulation/delivery" element={<DeliveryPage />} />
        <Route path="/simulation/goods-issue" element={<GoodsIssuePage />} />
        <Route path="/simulation/billing" element={<BillingPage />} />
        <Route path="/simulation/payment" element={<PaymentPage />} />
        <Route path="/document-flow" element={<DocumentFlowPage />} />
        <Route path="/master-data" element={<MasterDataPage />} />
        <Route path="/org-structure" element={<OrgStructurePage />} />
        <Route path="/t-codes" element={<TCodesPage />} />
        <Route path="/spro" element={<SproPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
