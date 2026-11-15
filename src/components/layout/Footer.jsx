import { Link } from '../../lib/router.jsx'
import { Phone, MapPin, Navigation, ArrowUpRight } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import { WhatsAppIcon } from '../ui/Icons.jsx'
import Stars from '../ui/Stars.jsx'
import { business, links, navigation, fullAddress } from '../../config/site.js'
import { services } from '../../content/services.js'
import { visibleItems } from '../../lib/content.js'

export default function Footer() {
  const year = new Date().getFullYear()
  const serviceList = visibleItems(services)

  return (
    <footer className="relative overflow-hidden bg-navy-900 pb-14 text-silver-light md:pb-0">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-silver">
              {business.name} is a metal workshop in Rakhial, Ahmedabad, focused on quality-driven metalwork,
              attention to detail and clear communication with every customer.
            </p>
            <a
              href={business.google.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-white/25"
            >
              <span className="font-display text-xl font-semibold text-white">{business.google.rating.toFixed(1)}</span>
              <span>
                <Stars value={business.google.rating} className="h-3.5 w-3.5" />
                <span className="mt-0.5 block text-xs text-silver">Rated on Google</span>
              </span>
            </a>
          </div>

          <nav aria-label="Quick links" className="lg:col-span-2">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">Quick Links</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {navigation.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="transition hover:text-accent">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services" className="lg:col-span-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">Services</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {serviceList.length ? (
                serviceList.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services#${s.slug}`} className="transition hover:text-accent">
                      {s.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link to="/services" className="transition hover:text-accent">
                    Metalwork services
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">Contact</h2>
            <address className="mt-5 space-y-4 text-sm not-italic">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{fullAddress}</span>
              </p>
              <a href={links.tel} className="flex items-center gap-3 transition hover:text-accent">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                {business.phoneDisplay}
              </a>
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition hover:text-accent">
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-accent" />
                WhatsApp us
              </a>
              <a href={links.directions} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition hover:text-accent">
                <Navigation className="h-4 w-4 shrink-0 text-accent" />
                View on Google Maps
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </a>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-silver sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.name} ({business.nameGujarati}). All rights reserved.
          </p>
          <p>Metal Workshop · Rakhial, Ahmedabad, Gujarat</p>
        </div>
      </div>
    </footer>
  )
}
