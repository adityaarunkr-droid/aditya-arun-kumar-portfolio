import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './app/theme/ThemeProvider'
import { ErrorOverlayProvider } from './components/ui/error'
import { syncFavicon } from './lib/syncFavicon'
import './index.css'
import App from './App.tsx'

syncFavicon()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ErrorOverlayProvider>
          <App />
        </ErrorOverlayProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
