import { Link } from '../../lib/router.jsx'
import { ArrowRight, MapPin, Phone, Star } from 'lucide-react'
import Img from '../ui/Img.jsx'
import ReviewTag from '../ui/ReviewTag.jsx'
import { business, links } from '../../config/site.js'

/**
 * Homepage hero. Background image: /public/images/hero-workshop.webp
 * (placeholder visual — replace with a real workshop photo, 2400×1350).
 */
export default function Hero() {
  const facts = [
    { icon: MapPin, label: 'Located in', value: 'Rakhial, Ahmedabad', href: links.directions, external: true },
    { icon: Star, label: 'Google rating', value: `${business.google.rating.toFixed(1)} / 5`, href: business.google.reviewsUrl, external: true },
    { icon: Phone, label: 'Call or WhatsApp', value: business.phoneDisplay, href: links.tel },
  ]

  return (
    <section className="on-dark relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col md:min-h-[100svh] overflow-hidden bg-navy-900 text-white" aria-labelledby="hero-title">
      <Img
        src="/images/hero-workshop.webp"
        alt="" sizes="100vw"
        priority
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/75 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/40" aria-hidden="true" />
      <div className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(to_right,black,transparent_70%)]" aria-hidden="true" />
      <div className="absolute bottom-40 right-5 hidden sm:block">
        <ReviewTag>Placeholder image</ReviewTag>
      </div>

      <div className="container-x flex flex-1 items-center pt-32 pb-16 lg:pt-36">
        <div className="max-w-3xl animate-[riseIn_0.9s_cubic-bezier(.2,.7,.2,1)_both]">
          <p className="eyebrow">Metal Workshop · Ahmedabad</p>
          <h1 id="hero-title" className="mt-6 text-[2.6rem] font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Precision in Metal.
            <span className="block text-silver-light/90">
              Excellence in <span className="text-accent">Every Detail.</span>
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-silver-light/85 sm:text-lg">
            Delivering quality-driven metalwork solutions with a commitment to precision, reliability, and customer
            satisfaction.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/services" className="btn-primary px-7 py-4 text-[15px]">
              Explore Our Services <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-outline-light px-7 py-4 text-[15px]">
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-navy-900/60 backdrop-blur-md">
        <ul className="container-x grid grid-cols-2 sm:grid-cols-3">
          {facts.map(({ icon: Icon, label, value, href, external }, i) => (
            <li key={label} className={`${i > 0 ? 'border-l border-white/10' : ''} ${i === 2 ? 'hidden sm:block' : ''}`}>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`group flex items-center gap-3 py-4 transition sm:gap-4 sm:py-5 ${i === 0 ? 'pr-4 sm:pr-6' : 'px-4 sm:px-6'}`}
              >
                <span className="hidden h-11 w-11 shrink-0 sm:flex items-center justify-center rounded-lg border border-white/15 bg-white/5 text-accent transition group-hover:border-accent/60">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-silver">{label}</span>
                  <span className="mt-0.5 block font-display text-[15px] font-semibold text-white">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
