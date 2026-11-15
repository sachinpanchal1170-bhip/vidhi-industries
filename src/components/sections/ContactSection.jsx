import { useState } from 'react'
import { Phone, MapPin, Navigation, ArrowUpRight, Map as MapIcon, FileText, Ruler, Layers, CalendarClock } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import { WhatsAppIcon } from '../ui/Icons.jsx'
import ContactForm from './ContactForm.jsx'
import { business, links, fullAddress } from '../../config/site.js'

export function ContactCards() {
  const cards = [
    {
      icon: Phone,
      label: 'Call us',
      value: business.phoneDisplay,
      action: 'Call Now',
      href: links.tel,
    },
    {
      icon: WhatsAppIcon,
      label: 'WhatsApp',
      value: business.phoneDisplay,
      action: 'Send a message',
      href: links.whatsapp,
      external: true,
    },
    {
      icon: MapPin,
      label: 'Visit the workshop',
      value: fullAddress,
      action: 'Get Directions',
      href: links.directions,
      external: true,
    },
  ]
  return (
    <div className="grid gap-4">
      {cards.map(({ icon: Icon, label, value, action, href, external }) => (
        <a
          key={label}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="group card flex items-start gap-5 p-6 transition hover:-translate-y-0.5 hover:border-navy/20 hover:shadow-lift"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy text-white transition group-hover:bg-accent">
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</span>
            <span className="mt-1 block font-display text-[17px] font-semibold leading-snug text-navy">{value}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent-ink">
              {action} <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </span>
        </a>
      ))}
    </div>
  )
}

/**
 * Google Map with a lightweight facade: the heavy Google Maps embed (~1 MB of
 * scripts) only loads when the visitor asks for it, or immediately when
 * `autoLoad` is set (Contact page).
 */
export function MapEmbed({ className = '', autoLoad = false }) {
  const [show, setShow] = useState(autoLoad)
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line bg-navy shadow-card ${className}`}>
      {show ? (
        <iframe
          title={`Map showing ${business.name}, Rakhial, Ahmedabad`}
          src={links.mapEmbed}
          className="h-full min-h-[320px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="on-dark relative flex h-full min-h-[320px] flex-col justify-between p-6 text-white">
          <div className="grid-lines absolute inset-0 opacity-70" aria-hidden="true" />
          <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d="M-10 210 C 80 190, 140 230, 230 180 S 360 120, 420 140" stroke="#a7b0b8" strokeWidth="10" fill="none" />
            <path d="M120 -10 L 170 320" stroke="#a7b0b8" strokeWidth="6" fill="none" />
            <path d="M-10 90 L 420 60" stroke="#a7b0b8" strokeWidth="4" fill="none" />
            <path d="M300 -10 L 260 320" stroke="#a7b0b8" strokeWidth="3" fill="none" />
          </svg>
          <div className="relative">
            <p className="eyebrow">Workshop location</p>
            <p className="mt-3 font-display text-xl font-semibold">Shreenathji Estate</p>
            <p className="text-sm text-silver-light/80">Rakhial, Ahmedabad 380023</p>
          </div>
          <span className="absolute left-1/2 top-[55%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-navy-900 shadow-lift ring-8 ring-accent/20" aria-hidden="true">
            <MapPin className="h-6 w-6" />
          </span>
          <div className="relative flex flex-wrap gap-3">
            <a href={links.directions} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Navigation className="h-4 w-4" /> Get Directions
            </a>
            <button type="button" onClick={() => setShow(true)} className="btn-outline-light">
              <MapIcon className="h-4 w-4" /> Show Map
            </button>
          </div>
        </div>
      )}
      {show && (
        <a href={links.directions} target="_blank" rel="noopener noreferrer" className="btn-navy absolute bottom-4 left-4 shadow-lift">
          <Navigation className="h-4 w-4" /> Open in Google Maps
        </a>
      )}
    </div>
  )
}

/** Contact info + inquiry form + map. Used on Home and Contact pages. */
export default function ContactSection({ withHeading = true, autoLoadMap = false }) {
  const FormHeading = withHeading ? 'h3' : 'h2'
  return (
    <section id="contact" className="section bg-mist" aria-label="Contact information and inquiry form">
      <div className="container-x">
        {withHeading && (
          <SectionHeading
            eyebrow="Contact"
            title="Contact Vidhi Industries"
            intro="Call, WhatsApp or send us your requirement. You are also welcome to visit our workshop in Rakhial."
          />
        )}
        <div className={`${withHeading ? 'mt-14' : ''} grid gap-8 lg:grid-cols-12`}>
          <div className="space-y-8 lg:col-span-5">
            <ContactCards />
            <MapEmbed className="h-[340px]" autoLoad={autoLoadMap} />
          </div>
          <div className="card p-6 sm:p-10 lg:col-span-7" data-reveal>
            <FormHeading className="text-2xl font-semibold">Send an Inquiry</FormHeading>
            <p className="mt-2 text-[15px] text-muted">Share a few details about your requirement and we will get back to you.</p>
            <ul className="mt-6 grid grid-cols-2 gap-2 text-[13px] text-ink sm:grid-cols-4" aria-label="Helpful details to include">
              {[
                [FileText, 'Drawing or photo'],
                [Layers, 'Material & thickness'],
                [Ruler, 'Sizes & quantity'],
                [CalendarClock, 'Required by date'],
              ].map(([Icon, t]) => (
                <li key={t} className="flex items-center gap-2 rounded-md bg-mist px-3 py-2">
                  <Icon className="h-4 w-4 shrink-0 text-accent-ink" /> {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Prefer a quick chat?{' '}
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-ink">
                Message us on WhatsApp
              </a>{' '}
              or{' '}
              <a href={links.tel} className="font-semibold text-navy underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-ink">
                call {business.phoneDisplay}
              </a>
              .
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
