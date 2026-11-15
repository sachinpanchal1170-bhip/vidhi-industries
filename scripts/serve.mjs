/**
 * Tiny zero-dependency static server that behaves like production hosting:
 * /about → dist/about/index.html, unknown paths → dist/404.html (status 404).
 *   npm run serve   (after npm run build)
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const root = path.resolve('dist')
const port = Number(process.env.PORT) || 4173
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.json': 'application/json' }

const isFile = async (p) => (await stat(p).catch(() => null))?.isFile()

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const safe = path.normalize(url).replace(/^(\.\.[/\\])+/, '')
  let file = path.join(root, safe)
  let status = 200
  if (!(await isFile(file))) {
    if (await isFile(path.join(file, 'index.html'))) file = path.join(file, 'index.html')
    else (file = path.join(root, '404.html')), (status = 404)
  }
  const ext = path.extname(file)
  let body = await readFile(file)
  const headers = {
    'Content-Type': types[ext] || 'application/octet-stream',
    'Cache-Control': file.includes(`${path.sep}assets${path.sep}`) || file.includes(`${path.sep}images${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
  }
  // gzip text responses, as production hosts do
  if (/\.(html|js|css|svg|xml|txt|json|webmanifest)$/.test(ext) && /gzip/.test(req.headers['accept-encoding'] || '')) {
    body = gzipSync(body)
    headers['Content-Encoding'] = 'gzip'
  }
  res.writeHead(status, headers)
  res.end(body)
}).listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`))
