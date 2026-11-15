import { Link } from '../lib/router.jsx'
import { ArrowLeft, Phone } from 'lucide-react'
import { links } from '../config/site.js'

export default function NotFound() {
  return (
    <section className="on-dark relative isolate flex min-h-[80vh] items-center overflow-hidden bg-navy-900 pt-32 pb-20 text-white">
      <div className="grid-lines absolute inset-0 -z-10" aria-hidden="true" />
      <div className="container-x">
        <p className="font-display text-[7rem] font-bold leading-none text-white/10 sm:text-[11rem]" aria-hidden="true">
          404
        </p>
        <p className="eyebrow -mt-4">Page not found</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold text-white sm:text-5xl">This page doesn't exist.</h1>
        <p className="mt-5 max-w-xl text-lg text-silver-light/80">
          The link may be broken or the page may have moved. Head back home, or contact us directly.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <Link to="/contact" className="btn-outline-light">
            Contact Us
          </Link>
          <a href={links.tel} className="btn-outline-light">
            <Phone className="h-4 w-4" /> Call Now
          </a>
        </div>
      </div>
    </section>
  )
}
