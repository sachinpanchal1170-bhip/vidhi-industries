import { useEffect, useState } from 'react'
import { NavLink, useLocation } from '../../lib/router.jsx'
import { Menu, X, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import { WhatsAppIcon } from '../ui/Icons.jsx'
import { business, links, navigation } from '../../config/site.js'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on navigation
  useEffect(() => setOpen(false), [pathname])

  // Lock scroll + Esc to close while the mobile menu is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const solid = scrolled || open
  const desktopNav = navigation.filter((n) => !n.mobileOnly)

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'bg-white/95 shadow-[0_1px_0_rgb(20_40_63/0.08),0_10px_30px_-15px_rgb(20_40_63/0.25)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
      >
        Skip to content
      </a>
      <div className={`container-x flex items-center justify-between transition-all ${solid ? 'h-[72px]' : 'h-[88px]'}`}>
        <Logo tone={solid ? 'dark' : 'light'} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {desktopNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative rounded-md px-4 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-4 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-accent after:transition-transform ${
                      isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                    } ${solid ? (isActive ? 'text-navy' : 'text-ink/75 hover:text-navy') : isActive ? 'text-white' : 'text-white/80 hover:text-white'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden h-11 w-11 items-center justify-center rounded-md border transition lg:inline-flex ${solid ? 'border-line text-navy hover:border-navy' : 'border-white/25 text-white hover:border-white'}`}
            aria-label="WhatsApp Vidhi Industries"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <a href={links.tel} className="btn-primary hidden sm:inline-flex" aria-label={`Call Vidhi Industries on ${business.phoneDisplay}`}>
            <Phone className="h-4 w-4" />
            <span>Call Now</span>
            <span className="hidden xl:inline font-normal opacity-90">· {business.phoneDisplay}</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md lg:hidden ${solid ? 'text-navy hover:bg-mist' : 'text-white hover:bg-white/10'}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>

      {/* Mobile menu — kept outside <header>: its backdrop-filter would otherwise
          become the containing block for this fixed panel. */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-[72px] z-50 overflow-y-auto bg-white transition-all duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
        hidden={!open}
      >
        <nav aria-label="Mobile" className="container-x py-6">
          <ul className="divide-y divide-line border-y border-line">
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between py-4 font-display text-xl font-medium ${isActive ? 'text-accent-ink' : 'text-navy'}`
                  }
                >
                  {item.label}
                  <ArrowUpRight className="h-5 w-5 opacity-40" />
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <a href={links.tel} className="btn-primary py-4 text-base">
              <Phone className="h-5 w-5" /> Call {business.phoneDisplay}
            </a>
            <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-navy py-4 text-base">
              <WhatsAppIcon /> WhatsApp Inquiry
            </a>
            <a href={links.directions} target="_blank" rel="noopener noreferrer" className="btn-outline py-4 text-base">
              <MapPin className="h-5 w-5" /> Get Directions
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
