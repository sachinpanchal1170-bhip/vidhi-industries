/**
 * Build-time prerendering: writes a fully rendered HTML file (with unique
 * <title>, meta description, canonical, Open Graph and JSON-LD) for every
 * route, plus 404.html, sitemap.xml and robots.txt.
 */
import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const ssrDir = path.resolve('dist-ssr')
const { render, routesMeta, SITE_URL } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

let template = await readFile(path.join(dist, 'index.html'), 'utf8')

// Inline the stylesheet (removes a render-blocking request) and preload the
// two above-the-fold font files.
const cssLink = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
if (cssLink) {
  const css = await readFile(path.join(dist, cssLink[1]), 'utf8')
  template = template.replace(cssLink[0], () => `<style>${css}</style>`)
}
const assets = await readdir(path.join(dist, 'assets'))
const preloads = ['inter-latin-wght-normal', 'space-grotesk-latin-wght-normal']
  .map((n) => assets.find((a) => a.startsWith(n) && a.endsWith('.woff2')))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ')
template = template.replace('<!--app-head-->', `${preloads}\n    <!--app-head-->`)
const routes = Object.keys(routesMeta).filter((r) => r.startsWith('/'))

const page = (url) => {
  const { html, head } = render(url)
  return template.replace('<!--app-head-->', head).replace('<!--app-html-->', html)
}

for (const route of routes) {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html')
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, page(route))
  console.log('prerendered', route)
}
await writeFile(path.join(dist, '404.html'), page('/404'))
console.log('prerendered 404.html')

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r === '/' ? '/' : r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${r === '/' ? '1.0' : r === '/services' || r === '/contact' ? '0.9' : '0.7'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(path.join(dist, 'sitemap.xml'), sitemap)
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
console.log('wrote sitemap.xml, robots.txt')

await rm(ssrDir, { recursive: true, force: true })
