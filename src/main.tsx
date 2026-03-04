import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AppErrorBoundary from '@/components/AppErrorBoundary'
import { AuthProvider } from '@/context/AuthContext'

const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
