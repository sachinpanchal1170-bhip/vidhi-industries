import { Link } from '../../lib/router.jsx'
import { ArrowRight, Check } from 'lucide-react'
import Img from '../ui/Img.jsx'
import ReviewTag from '../ui/ReviewTag.jsx'
import { business } from '../../config/site.js'

export default function Intro() {
  const points = ['Workshop in Rakhial, Ahmedabad', 'Requirements discussed with you directly', 'Easy to reach by phone and WhatsApp']
  return (
    <section className="section overflow-hidden" aria-labelledby="intro-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 lg:order-1" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lift sm:aspect-[5/4] lg:aspect-[7/8]">
            <Img src="/images/intro-workshop.webp" alt="Metalwork in progress at a workshop (placeholder visual)" sizes="(min-width: 1024px) 560px, 100vw" className="h-full w-full object-cover" />
            <ReviewTag className="absolute left-4 top-4">Placeholder image</ReviewTag>
          </div>
          <div className="absolute -bottom-6 -right-2 hidden rounded-xl border border-line bg-white p-5 shadow-lift sm:block lg:-right-8">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-muted">Workshop</p>
            <p className="mt-1 font-display text-lg font-semibold text-navy">Shreenathji Estate</p>
            <p className="text-sm text-muted">Rakhial, Ahmedabad 380023</p>
          </div>
          <div className="absolute -left-4 -top-4 -z-10 h-32 w-32 rounded-2xl bg-accent/15" aria-hidden="true" />
        </div>

        <div className="order-1 lg:order-2">
          <div data-reveal>
            <p className="eyebrow">About {business.name}</p>
            <h2 id="intro-title" className="h-section mt-4">
              Built on Quality. Driven by Precision.
            </h2>
          </div>
          <div className="mt-6 space-y-4 lead" data-reveal style={{ '--reveal-delay': '100ms' }}>
            <p>
              {business.name} ({business.nameGujarati}) is a metal workshop located at Shreenathji Estate, Rakhial, in
              Ahmedabad, Gujarat.
            </p>
            <p>
              We approach every metalwork job with the same priorities: understand the requirement clearly, work with
              care and precision, and keep our customers informed from start to finish.
            </p>
          </div>
          <ul className="mt-8 space-y-3" data-reveal style={{ '--reveal-delay': '180ms' }}>
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[15px] font-medium text-navy">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-10" data-reveal style={{ '--reveal-delay': '240ms' }}>
            <Link to="/about" className="btn-navy px-6 py-3.5">
              More About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
