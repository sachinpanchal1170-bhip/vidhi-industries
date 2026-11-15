import manifest from '../../content/image-manifest.json'

/**
 * Image with performance defaults.
 * - Emits srcset from src/content/image-manifest.json (run `npm run images:sizes`)
 * - Intrinsic width/height from the manifest prevent layout shift
 * - `sizes` describes the rendered width, e.g. "(min-width: 1024px) 33vw, 100vw"
 */
export default function Img({ src, alt, width, height, sizes = '100vw', priority = false, className = '', ...rest }) {
  const m = manifest[src]
  const base = src.replace(/\.(webp|jpe?g|png)$/i, '')
  const srcSet = m?.sizes?.length ? [...m.sizes.map((w) => `${base}-${w}.webp ${w}w`), `${src} ${m.w}w`].join(', ') : undefined
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width ?? m?.w}
      height={height ?? m?.h}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      {...rest}
    />
  )
}
