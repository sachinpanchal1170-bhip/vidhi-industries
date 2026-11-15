import { Link } from '../lib/router.jsx'
import { ArrowRight, MessageSquareText, ClipboardCheck, Hammer, PackageCheck } from 'lucide-react'
import PageHero from '../components/sections/PageHero.jsx'
import CtaSection from '../components/sections/CtaSection.jsx'
import EmptyState from '../components/sections/EmptyState.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Img from '../components/ui/Img.jsx'
import ReviewTag, { OwnerNote } from '../components/ui/ReviewTag.jsx'
import { services } from '../content/services.js'
import { visibleItems } from '../lib/content.js'
import { WhatsAppIcon } from '../components/ui/Icons.jsx'
import { links } from '../config/site.js'

const steps = [
  { icon: MessageSquareText, title: 'Share your requirement', text: 'Call, WhatsApp or send the inquiry form with drawings, photos or a description.' },
  { icon: ClipboardCheck, title: 'Review & discussion', text: 'We go through the details with you and confirm scope, material and timeline.' },
  { icon: Hammer, title: 'Workshop execution', text: 'The job is carried out with attention to detail and kept on track.' },
  { icon: PackageCheck, title: 'Completion & handover', text: 'We keep you updated and hand over the finished work as agreed.' },
]

export default function Services() {
  const list = visibleItems(services)
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Metalwork Services in Ahmedabad"
        intro="Share your requirement and we will discuss the right way to take it forward — from fabrication and cutting to welding and custom metalwork."
        image="/images/service-fabrication.webp"
      />

      <section className="section" aria-label="Service details">
        <div className="container-x">
          <OwnerNote
            title="These service categories are proposed. Before launch, please:"
            items={[
              'Confirm which services Vidhi Industries actually offers (remove any that do not apply)',
              'Change status to "confirmed" in src/content/services.js',
              'Add details you are happy to publish: materials, typical jobs, equipment',
              'Replace each placeholder image with a real photo of that type of work',
            ]}
          />
          {list.length ? (
            <div className="mt-12 space-y-20 lg:space-y-28">
              {list.map((s, i) => (
                <article key={s.slug} id={s.slug} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div className={`relative ${i % 2 ? 'lg:order-2' : ''}`} data-reveal>

                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy shadow-lift">
                      <Img src={s.image} alt={s.alt} sizes="(min-width: 1024px) 600px, 100vw" className="h-full w-full object-cover" />
                      <ReviewTag className="absolute left-4 top-4" show={s.status !== 'confirmed'} />
                    </div>
                  </div>
                  <div data-reveal style={{ '--reveal-delay': '100ms' }}>
                    <p className="eyebrow">Service {String(i + 1).padStart(2, '0')}</p>
                    <h2 className="h-section mt-4">{s.title}</h2>
                    <p className="mt-5 text-lg font-medium leading-relaxed text-navy/80">{s.short}</p>
                    <p className="lead mt-4">{s.details}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link to={`/contact?service=${s.slug}`} className="btn-primary">
                        Discuss This Service <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href={links.whatsappWithText(`Hello Vidhi Industries, I would like to discuss ${s.title.toLowerCase()} work.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline"
                      >
                        <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState text="Our service details are being updated. Call or WhatsApp us to discuss your metalwork requirement." />
          )}
        </div>
      </section>

      <section className="section bg-mist" aria-labelledby="process-title">
        <div className="container-x">
          <SectionHeading eyebrow="How We Work" title={<span id="process-title">A Clear, Simple Process</span>} align="center" />
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="card relative p-7" data-reveal style={{ '--reveal-delay': `${i * 80}ms` }}>
                <span className="font-display text-sm font-semibold text-accent-ink">Step {i + 1}</span>
                <Icon className="mt-5 h-8 w-8 text-navy" strokeWidth={1.6} />
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaSection title="Not Sure Which Service You Need?" text="Describe your requirement and we will help you work out the right approach." />
    </>
  )
}
