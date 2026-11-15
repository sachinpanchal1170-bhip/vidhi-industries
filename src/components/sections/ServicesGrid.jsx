import { Link } from '../../lib/router.jsx'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import ServiceCard from './ServiceCard.jsx'
import EmptyState from './EmptyState.jsx'
import { services } from '../../content/services.js'
import { visibleItems } from '../../lib/content.js'

export default function ServicesGrid({ showAllLink = true }) {
  const list = visibleItems(services)
  return (
    <section className="section bg-mist" aria-labelledby="services-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Our Services"
            title={<span id="services-title">Metalwork Services</span>}
            intro="Tell us what you need made, cut, joined or built. We will review your requirement and discuss the right way to take it forward."
          />
          {showAllLink && (
            <Link to="/services" className="btn-outline shrink-0 self-start lg:self-auto" data-reveal>
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        {list.length ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {list.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState text="Our service details are being updated. Call or WhatsApp us to discuss your metalwork requirement." />
        )}
      </div>
    </section>
  )
}
