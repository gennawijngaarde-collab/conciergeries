import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AppErrorBoundary from '@/components/AppErrorBoundary'
import { AuthProvider } from '@/context/AuthContext'

const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter

// Replace %VITE_GA_MEASUREMENT_ID% with actual env var
if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    if (script.innerHTML.includes('%VITE_GA_MEASUREMENT_ID%')) {
      script.innerHTML = script.innerHTML.replace(
        /%VITE_GA_MEASUREMENT_ID%/g,
        import.meta.env.VITE_GA_MEASUREMENT_ID
      );
    }
  });
}

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
