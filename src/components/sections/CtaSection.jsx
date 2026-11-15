import { Link } from '../../lib/router.jsx'
import { Phone, Navigation, ArrowRight } from 'lucide-react'
import Img from '../ui/Img.jsx'
import { links } from '../../config/site.js'

export default function CtaSection({
  title = 'Have a Metalwork Project in Mind?',
  text = 'Connect with Vidhi Industries to discuss your requirements and explore the right solution for your project.',
}) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-10" aria-labelledby="cta-title">
      <div className="on-dark relative isolate mx-auto max-w-7xl overflow-hidden rounded-3xl bg-navy px-6 py-16 text-white shadow-lift sm:px-12 sm:py-20 lg:px-20" data-reveal>
        <Img src="/images/cta-texture.webp" alt="" sizes="(min-width: 1280px) 1280px, 100vw" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/90 to-navy/60" aria-hidden="true" />
        <div className="absolute -left-20 top-0 -z-10 h-full w-1.5 bg-accent sm:left-0" aria-hidden="true" />
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow">Get in touch</p>
            <h2 id="cta-title" className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-silver-light/85 sm:text-lg">{text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a href={links.tel} className="btn-primary py-4 text-[15px]">
              <Phone className="h-4 w-4" /> Call Now
            </a>
            <Link to="/contact" className="btn bg-white py-4 text-[15px] text-navy hover:bg-mist">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={links.directions} target="_blank" rel="noopener noreferrer" className="btn-outline-light py-4 text-[15px]">
              <Navigation className="h-4 w-4" /> Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
