import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { SimulatorProvider } from './context/SimulatorContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SimulatorProvider>
        <App />
      </SimulatorProvider>
    </BrowserRouter>
  </StrictMode>,
)
