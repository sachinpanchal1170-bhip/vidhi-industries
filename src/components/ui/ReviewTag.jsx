import { REVIEW_MODE } from '../../config/site.js'

/**
 * Small tag shown ONLY in REVIEW_MODE to flag content that still needs the
 * owner's confirmation (proposed services/industries, placeholder images).
 */
export default function ReviewTag({ children = 'To be confirmed', className = '', show = true }) {
  if (!REVIEW_MODE || !show) return null
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent/60 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-ink backdrop-blur ${className}`}
      title="Draft content — confirm with Vidhi Industries before launch"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </span>
  )
}

/** Dashed note box for owners: lists verified info that still needs to be added. */
export function OwnerNote({ title, items }) {
  if (!REVIEW_MODE) return null
  return (
    <aside className="rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 p-6 text-sm text-ink">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
        Owner review · not shown on live site
      </p>
      <p className="mt-2 font-semibold text-navy">{title}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </aside>
  )
}
