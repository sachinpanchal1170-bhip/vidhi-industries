/** Renders public/og-image.jpg (1200×630) for social sharing. */
import { createRequire } from 'node:module'
import path from 'node:path'
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
const { chromium } = createRequire(import.meta.url)('playwright')

const root = path.resolve('.')
const b64 = (f) => readFileSync(path.join(root, f)).toString('base64')
const font = `data:font/woff2;base64,${b64('node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2')}`
const hero = `data:image/webp;base64,${b64('public/images/hero-workshop.webp')}`
const html = `<!doctype html><html><head><style>
@font-face{font-family:SG;src:url(${font}) format('woff2');font-weight:300 700}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;font-family:SG;color:#fff;position:relative;overflow:hidden;background:#0b1828}
.bg{position:absolute;inset:0;background:url(${hero}) 70% center/cover}
.ov{position:absolute;inset:0;background:linear-gradient(90deg,#0b1828 0%,rgba(11,24,40,.88) 45%,rgba(11,24,40,.2) 100%)}
.c{position:absolute;left:80px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;width:960px}
.logo{display:flex;align-items:center;gap:18px}.logo b{font-size:30px;letter-spacing:.14em;text-transform:uppercase}.logo b span{color:#E58A35}
h1{font-size:62px;line-height:1.04;font-weight:600;margin-top:56px;letter-spacing:-.01em}h1 em{font-style:normal;color:#E58A35}
p{margin-top:28px;font-size:24px;color:#C9D0D6;letter-spacing:.02em}.bar{position:absolute;left:0;top:0;bottom:0;width:10px;background:#E58A35}
</style></head><body><div class="bg"></div><div class="ov"></div><div class="bar"></div><div class="c">
<div class="logo"><svg width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#14283F" stroke="rgba(255,255,255,.2)"/><path d="M13 15h10.5L32 39.5 40.5 15H51L37.5 49h-11z" fill="#C9D0D6"/><path d="M32 39.5 40.5 15H51L37.5 49z" fill="#A7B0B8"/><rect x="26.5" y="52" width="11" height="3.5" rx="1" fill="#E58A35"/></svg><b>Vidhi <span>Industries</span></b></div>
<h1>Precision in Metal.<br/>Excellence in <em>Every Detail.</em></h1>
<p>Metal Workshop · Rakhial, Ahmedabad · +91 98253 42853</p></div></body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
const png = await page.screenshot()
await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toFile('public/og-image.jpg')
await browser.close()
console.log('✓ public/og-image.jpg')
