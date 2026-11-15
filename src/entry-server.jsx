import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { Router } from './lib/router.jsx'
import App from './App.jsx'
import { headTags } from './config/seo.js'

export function render(url) {
  const html = renderToString(
    <StrictMode>
      <Router ssrPath={url}>
        <App />
      </Router>
    </StrictMode>,
  )
  return { html, head: headTags(url) }
}

export { routesMeta } from './config/seo.js'
export { SITE_URL } from './config/site.js'
