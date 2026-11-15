import { Link } from '../../lib/router.jsx'
import { business } from '../../config/site.js'

export function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#14283F" />
      <path d="M13 15h10.5L32 39.5 40.5 15H51L37.5 49h-11z" fill="#C9D0D6" />
      <path d="M32 39.5 40.5 15H51L37.5 49z" fill="#A7B0B8" />
      <rect x="26.5" y="52" width="11" height="3.5" rx="1" fill="#E58A35" />
    </svg>
  )
}

/** Text-based logo. `tone` = 'light' for dark backgrounds. */
export default function Logo({ tone = 'dark', className = '' }) {
  const light = tone === 'light'
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`} aria-label={`${business.name} — Home`}>
      <LogoMark className={`h-10 w-10 shrink-0 transition ${light ? 'ring-1 ring-white/15 rounded-[14px]' : ''}`} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.05rem] font-bold uppercase tracking-[0.14em] ${light ? 'text-white' : 'text-navy'}`}
        >
          Vidhi <span className="text-accent">Industries</span>
        </span>
        <span className={`mt-1 text-[11px] font-medium tracking-wide ${light ? 'text-silver' : 'text-muted'}`}>
          {business.nameGujarati}
        </span>
      </span>
    </Link>
  )
}
