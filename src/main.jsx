import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { CookiesProvider } from 'react-cookie'
import '@styles/index.css'
import App from '@/pages/App.jsx'
import { BrowserRouter } from "react-router";
import AuthProvider from '@/hooks/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <CookiesProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </CookiesProvider>
    </StrictMode>,
)