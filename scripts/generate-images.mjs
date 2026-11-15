/**
 * Renders the PLACEHOLDER industrial visuals used until real photographs of
 * Vidhi Industries are supplied: 3D scenes (three.js, physically based steel
 * materials, real lighting, depth of field, bloom) rendered in headless
 * Chromium, then encoded as optimised WebP in several widths for srcset.
 *
 *   npm run images              # full set
 *   PREVIEW=1 npm run images    # quick low-res pass into /tmp/vidhi-preview
 *
 * Replace any output in /public/images with a real photo at any time — keep the
 * file name and run `npm run images:sizes` to regenerate the -640/-1280 sizes
 * or update the paths in src/content/*.js.
 */
import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import sharp from 'sharp'

const { chromium } = createRequire(import.meta.url)('playwright')
const root = path.resolve('.')
const PREVIEW = !!process.env.PREVIEW
const OUT = PREVIEW ? '/tmp/vidhi-preview' : path.join(root, 'public/images')

// name, scene, size, seed, camera overrides (cx,cy,cz = position, lx,ly,lz = target)
const specs = [
  { name: 'hero-workshop', scene: 'workshop', w: 2400, h: 1350, seed: 7, fog: 0.04, o: { cx: -0.9, cy: 1.35, cz: 2.6, lx: 1.0, ly: 1.15, lz: -3 } },
  { name: 'intro-workshop', scene: 'welding', w: 1400, h: 1600, seed: 3, fog: 0, fov: 34, o: { cx: 0.3, cy: 0.3, cz: 0.5 } },
  { name: 'about-workshop', scene: 'workshop', w: 1600, h: 1100, seed: 11, fog: 0.045, o: { cx: 3.4, cy: 1.8, cz: 3.2, lx: -1.5, ly: 1.0, lz: -4 } },
  { name: 'service-fabrication', scene: 'beams', w: 1200, h: 900, seed: 21, fog: 0.04 },
  { name: 'service-cutting', scene: 'cutting', w: 1200, h: 900, seed: 22, fog: 0 },
  { name: 'service-welding', scene: 'welding', w: 1200, h: 900, seed: 23, fog: 0 },
  { name: 'service-structure', scene: 'structure', w: 1200, h: 900, seed: 24, fog: 0 },
  { name: 'service-custom', scene: 'pipes', w: 1200, h: 900, seed: 25, fog: 0.04 },
  { name: 'service-components', scene: 'components', w: 1200, h: 900, seed: 26, fog: 0 },
  { name: 'industry-construction', scene: 'structure', w: 1000, h: 1200, seed: 31, fog: 0, o: { cx: 4, cy: 1.2, cz: 7, lx: -3, ly: 7, lz: -5 } },
  { name: 'industry-manufacturing', scene: 'workshop', w: 1000, h: 1200, seed: 32, fog: 0.045, o: { cx: -0.2, cy: 1.4, cz: 2.4, lx: 1.2, ly: 1.3, lz: -3 } },
  { name: 'industry-engineering', scene: 'components', w: 1000, h: 1200, seed: 33, fog: 0, o: { cx: 0.1, cy: 0.75, cz: 0.75 } },
  { name: 'industry-infrastructure', scene: 'beams', w: 1000, h: 1200, seed: 34, fog: 0.04, o: { cx: 1.8, cy: 2.2, cz: 6.2 } },
  { name: 'gallery-1', scene: 'workshop', w: 1800, h: 1000, seed: 41, fog: 0.045, o: { cx: -2.5, cy: 2.2, cz: 5.5, lx: 0.5, ly: 1.2, lz: -5 } },
  { name: 'gallery-2', scene: 'welding', w: 1200, h: 1000, seed: 42, fog: 0, o: { cx: -0.1, cy: 0.25, cz: 0.6 } },
  { name: 'gallery-3', scene: 'structure', w: 1200, h: 1000, seed: 43, fog: 0, o: { cx: -6, cy: 1.8, cz: 8, lx: 2, ly: 6, lz: -4 } },
  { name: 'gallery-4', scene: 'components', w: 1200, h: 1000, seed: 44, fog: 0 },
  { name: 'gallery-5', scene: 'cutting', w: 1200, h: 1000, seed: 45, fog: 0, o: { cx: -0.3, cy: 0.45, cz: 0.85 } },
  { name: 'gallery-6', scene: 'sheets', w: 1800, h: 1000, seed: 46, fog: 0.04 },
  { name: 'gallery-7', scene: 'pipes', w: 1200, h: 1000, seed: 47, fog: 0.04, o: { cx: -2.2, cy: 1.3, cz: 3.2, lx: 0.3, ly: 0.7, lz: -0.4 } },
  { name: 'gallery-8', scene: 'beams', w: 1200, h: 1000, seed: 48, fog: 0.04, o: { cx: -3, cy: 1.4, cz: 7 } },
  { name: 'cta-texture', scene: 'sheets', w: 2000, h: 900, seed: 51, fog: 0.04, o: { cx: -1.6, cy: 0.9, cz: 2.2 } },
]

const types = { '.html': 'text/html', '.js': 'text/javascript' }
const server = createServer(async (req, res) => {
  try {
    const file = path.join(root, decodeURIComponent(req.url.split('?')[0]))
    if (!file.startsWith(root)) throw new Error('forbidden')
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
    res.end(await readFile(file))
  } catch {
    res.writeHead(404).end()
  }
}).listen(0)
const port = server.address().port


await mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
const only = process.argv.slice(2)
for (const spec of specs.filter((s) => !only.length || only.includes(s.name))) {
  const s = PREVIEW ? { ...spec, w: Math.round(spec.w / 3), h: Math.round(spec.h / 3) } : spec
  const page = await browser.newPage()
  page.on('pageerror', (e) => console.error('page error', spec.name, e.message))
  await page.goto(`http://localhost:${port}/scripts/render/index.html`)
  await page.waitForFunction(() => window.ready, null, { timeout: 60000 })
  const dataUrl = await page.evaluate((sp) => window.renderScene(sp), s)
  const buf = Buffer.from(dataUrl.split(',')[1], 'base64')
  if (PREVIEW) await sharp(buf).png().toFile(path.join(OUT, `${spec.name}.png`))
  else await sharp(buf).webp({ quality: 78, effort: 6 }).toFile(path.join(OUT, `${spec.name}.webp`))
  console.log('✓', spec.name)
  await page.close()
}
await browser.close()
server.close()
if (!PREVIEW) await import('./image-sizes.mjs')
