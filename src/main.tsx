import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles/globals.css'
import { ThemeProvider } from './contexts/ThemeProvider'
import { LanguageProvider } from './contexts/LanguageProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
)
