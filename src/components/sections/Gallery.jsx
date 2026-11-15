import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '../../lib/router.jsx'
import { ArrowRight, ChevronLeft, ChevronRight, Expand, X, Camera } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import ReviewTag from '../ui/ReviewTag.jsx'
import Img from '../ui/Img.jsx'
import { gallery, galleryCategories } from '../../content/gallery.js'
import { visibleImages } from '../../lib/content.js'
import { links } from '../../config/site.js'
import { WhatsAppIcon } from '../ui/Icons.jsx'

function Lightbox({ items, index, onClose, onNav }) {
  const closeRef = useRef(null)
  const item = items[index]

  useEffect(() => {
    const prevFocus = document.activeElement
    closeRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNav(1)
      if (e.key === 'ArrowLeft') onNav(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevFocus?.focus?.()
    }
  }, [onClose, onNav])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${items.length}: ${item.caption}`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/95 p-4 backdrop-blur-sm animate-[fadeIn_.2s_ease-out]"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Close image viewer"
      >
        <X className="h-5 w-5" />
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => (e.stopPropagation(), onNav(-1))}
            className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => (e.stopPropagation(), onNav(1))}
            className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.alt} className="max-h-[78vh] w-auto rounded-lg object-contain shadow-2xl" />
        <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-silver-light">
          <span>
            <span className="font-semibold text-white">{item.caption}</span> · {item.category}
          </span>
          <span className="flex items-center gap-3">
            <ReviewTag show={item.placeholder}>Placeholder</ReviewTag>
            <span className="text-silver">
              {index + 1} / {items.length}
            </span>
          </span>
        </figcaption>
      </figure>
    </div>
  )
}

/**
 * Responsive gallery with category filters and lightbox.
 * @param {number} limit   show only the first N images (homepage preview)
 * @param {boolean} filters show category filter buttons
 */
export default function Gallery({ limit, filters = false, withHeading = true }) {
  const all = useMemo(() => visibleImages(gallery), [])
  const [active, setActive] = useState('All')
  const [open, setOpen] = useState(null)

  const list = useMemo(() => {
    const f = active === 'All' ? all : all.filter((g) => g.category === active)
    return limit ? f.slice(0, limit) : f
  }, [all, active, limit])

  const close = useCallback(() => setOpen(null), [])
  const nav = useCallback((d) => setOpen((i) => (i + d + list.length) % list.length), [list.length])
  const cats = ['All', ...galleryCategories.filter((c) => all.some((g) => g.category === c))]

  return (
    <section className="section bg-mist" aria-label="Our work gallery">
      <div className="container-x">
        {withHeading && (
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Our Work"
              title="From the Workshop Floor"
              intro="A look at our workshop, processes and finished metalwork."
            />
            {limit && (
              <Link to="/our-work" className="btn-outline shrink-0 self-start lg:self-auto" data-reveal>
                View Full Gallery <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}

        {filters && all.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Filter gallery by category">
            {cats.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                aria-pressed={active === c}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active === c ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink hover:border-navy/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {list.length ? (
          <ul className={`${withHeading ? 'mt-14' : 'mt-8'} grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 sm:auto-rows-[240px] lg:grid-cols-3 lg:auto-rows-[260px] lg:gap-5`}>
            {list.map((item, i) => (
              <li key={item.src} className={item.wide ? 'sm:col-span-2' : ''}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="group relative block h-full w-full overflow-hidden rounded-xl bg-navy text-left shadow-card"
                >
                  <span className="sr-only">Open image: </span>
                  <Img src={item.src} alt={item.alt} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent opacity-80 transition group-hover:opacity-100" aria-hidden="true" />
                  <span className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3">
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{item.category}</span>
                      <span className="mt-1 block font-display text-lg font-semibold text-white">{item.caption}</span>
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                      <Expand className="h-4 w-4" />
                    </span>
                  </span>
                  <ReviewTag className="absolute left-3 top-3" show={item.placeholder}>
                    Placeholder
                  </ReviewTag>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card mt-12 flex flex-col items-center gap-4 px-6 py-14 text-center">
            <Camera className="h-10 w-10 text-silver" />
            <p className="max-w-md text-muted">
              Project photographs are being added. Message us on WhatsApp to see examples of our work.
            </p>
            <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-navy">
              <WhatsAppIcon className="h-4 w-4" /> Request photos on WhatsApp
            </a>
          </div>
        )}
      </div>
      {open !== null && list[open] && <Lightbox items={list} index={open} onClose={close} onNav={nav} />}
    </section>
  )
}
