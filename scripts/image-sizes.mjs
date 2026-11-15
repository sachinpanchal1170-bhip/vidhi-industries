/**
 * Creates responsive WebP variants (-640, -1280) for every image in
 * public/images (including sub-folders such as public/images/work) and writes
 * src/content/image-manifest.json, which the <Img> component uses to emit
 * srcset + intrinsic width/height automatically.
 *
 *   npm run images:sizes      (run after adding or replacing photos)
 *
 * Accepts .webp/.jpg/.jpeg/.png originals. Variants are always WebP.
 */
import { readdir, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve('public')
const dir = path.join(root, 'images')
const WIDTHS = [640, 1280]
const manifest = {}

async function walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const full = path.join(d, e.name)
    if (e.isDirectory()) await walk(full)
    else if (/\.(webp|jpe?g|png)$/i.test(e.name) && !/-(640|1280)\.webp$/.test(e.name)) {
      const meta = await sharp(full).metadata()
      const base = full.replace(/\.(webp|jpe?g|png)$/i, '')
      const sizes = []
      for (const w of WIDTHS) {
        if (w >= meta.width) continue
        const out = `${base}-${w}.webp`
        const srcTime = (await stat(full)).mtimeMs
        const outTime = await stat(out).then((s) => s.mtimeMs).catch(() => 0)
        if (outTime < srcTime) await sharp(full).resize(w).webp({ quality: 74, effort: 6 }).toFile(out)
        sizes.push(w)
      }
      manifest['/' + path.relative(root, full).split(path.sep).join('/')] = { w: meta.width, h: meta.height, sizes }
    }
  }
}
await walk(dir)
await writeFile('src/content/image-manifest.json', JSON.stringify(manifest, null, 1) + '\n')
console.log(`image-manifest.json: ${Object.keys(manifest).length} images`)
