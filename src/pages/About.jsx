import { Link } from '../lib/router.jsx'
import { ArrowRight, MapPin, Phone, Navigation } from 'lucide-react'
import PageHero from '../components/sections/PageHero.jsx'
import WhyChooseUs from '../components/sections/WhyChooseUs.jsx'
import CtaSection from '../components/sections/CtaSection.jsx'
import Img from '../components/ui/Img.jsx'
import ReviewTag, { OwnerNote } from '../components/ui/ReviewTag.jsx'
import Stars from '../components/ui/Stars.jsx'
import { business, links, fullAddress } from '../config/site.js'

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        image="/images/gallery-8.webp"
        title="A Metal Workshop Built on Quality and Care"
        intro={`${business.name} (${business.nameGujarati}) is a metal workshop in Rakhial, Ahmedabad, focused on precise, dependable metalwork and honest communication.`}
      />

      <section className="section" aria-labelledby="who-title">
        <div className="container-x grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <p className="eyebrow">Who We Are</p>
            <h2 id="who-title" className="h-section mt-4">
              A Workshop That Values Getting It Right
            </h2>
            <div className="lead mt-6 space-y-4">
              <p>
                {business.name} is a metal workshop located at {business.address.line1}, {business.address.line2},{' '}
                {business.address.locality}, Ahmedabad.
              </p>
              <p>
                Our approach is simple. We take time to understand what each customer needs, carry out the work with
                care and attention to detail, and stay reachable by phone and WhatsApp throughout the job.
              </p>
              <p>
                That approach is reflected in the 5.0 rating our customers have given us on Google — and it is the
                standard we hold ourselves to on every piece of work.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services" className="btn-navy">
                Our Services <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="relative" data-reveal style={{ '--reveal-delay': '120ms' }}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lift">
              <Img src="/images/gallery-6.webp" alt="Steel sheets and box sections ready for work (placeholder visual)" sizes="(min-width: 1024px) 600px, 100vw" className="h-full w-full object-cover" />
              <ReviewTag className="absolute left-4 top-4">Placeholder image</ReviewTag>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a href={business.google.reviewsUrl} target="_blank" rel="noopener noreferrer" className="card p-6 transition hover:shadow-lift">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Google Rating</p>
                <p className="mt-2 flex items-center gap-3">
                  <span className="font-display text-4xl font-semibold text-navy">{business.google.rating.toFixed(1)}</span>
                  <Stars value={business.google.rating} />
                </p>
              </a>
              <a href={links.directions} target="_blank" rel="noopener noreferrer" className="card p-6 transition hover:shadow-lift">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Location</p>
                <p className="mt-2 font-display text-lg font-semibold leading-snug text-navy">Rakhial, Ahmedabad</p>
                <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent-ink">
                  <Navigation className="h-3.5 w-3.5" /> Directions
                </p>
              </a>
            </div>
          </div>
        </div>
        <div className="container-x mt-14">
          <OwnerNote
            title="Add verified details here to strengthen this page:"
            items={[
              'Year the workshop was established and the founder / proprietor name',
              'Short story of how Vidhi Industries started',
              'Team size and key skills (only if you are comfortable sharing)',
              'Main machinery and equipment in the workshop',
              'Materials you regularly work with',
              'Real photos of the workshop, team and finished jobs',
              'Working hours and days',
            ]}
          />
        </div>
      </section>

      <WhyChooseUs />

      <section className="section" aria-labelledby="visit-title">
        <div className="container-x">
          <div className="card grid overflow-hidden lg:grid-cols-2">
            <div className="p-8 sm:p-12" data-reveal>
              <p className="eyebrow">Visit Us</p>
              <h2 id="visit-title" className="h-section mt-4">
                Our Workshop in Rakhial
              </h2>
              <address className="mt-6 space-y-4 not-italic text-[15px] text-ink">
                <p className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" /> {fullAddress}
                </p>
                <a href={links.tel} className="flex items-center gap-3 font-semibold text-navy hover:text-accent-ink">
                  <Phone className="h-5 w-5 text-accent" /> {business.phoneDisplay}
                </a>
              </address>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={links.directions} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Navigation className="h-4 w-4" /> Get Directions
                </a>
                <a href={links.tel} className="btn-outline">
                  <Phone className="h-4 w-4" /> Call Before Visiting
                </a>
              </div>
            </div>
            <div className="relative min-h-[300px] bg-navy">
              <Img src="/images/about-workshop.webp" alt="" sizes="(min-width: 1024px) 600px, 100vw" className="absolute inset-0 h-full w-full object-cover opacity-80" />
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
