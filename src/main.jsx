import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

window.__vidhiReady = true
const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Pages are prerendered at build time → hydrate. In dev the root is empty → render.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
