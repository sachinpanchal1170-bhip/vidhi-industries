import { routesMeta, OG_IMAGE } from '../config/seo.js'
import { SITE_URL } from '../config/site.js'

const upsert = (selector, create, attrs) => {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(create)
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  return el
}

/** Keeps <head> in sync during client-side navigation. */
export function applySeo(pathname, isNotFound) {
  const meta = isNotFound ? routesMeta[404] : routesMeta[pathname] || routesMeta[404]
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
  document.title = meta.title
  upsert('meta[name="description"]', 'meta', { name: 'description', content: meta.description })
  upsert('meta[property="og:title"]', 'meta', { property: 'og:title', content: meta.title })
  upsert('meta[property="og:description"]', 'meta', { property: 'og:description', content: meta.description })
  upsert('meta[property="og:url"]', 'meta', { property: 'og:url', content: url })
  upsert('meta[property="og:image"]', 'meta', { property: 'og:image', content: OG_IMAGE })
  const canonical = document.head.querySelector('link[rel="canonical"]')
  const robots = document.head.querySelector('meta[name="robots"]')
  if (meta.noindex) {
    canonical?.remove()
    upsert('meta[name="robots"]', 'meta', { name: 'robots', content: 'noindex, follow' })
  } else {
    robots?.remove()
    upsert('link[rel="canonical"]', 'link', { rel: 'canonical', href: url })
  }
}
