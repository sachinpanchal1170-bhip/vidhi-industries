import { HardHat, Factory, Cog, Building2 } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import ReviewTag from '../ui/ReviewTag.jsx'
import Img from '../ui/Img.jsx'
import EmptyState from './EmptyState.jsx'
import { industries } from '../../content/industries.js'
import { visibleItems } from '../../lib/content.js'

const icons = { HardHat, Factory, Cog, Building2 }

export default function IndustriesGrid({ headingAs = 'h2', withHeading = true }) {
  const list = visibleItems(industries)
  const CardHeading = withHeading ? 'h3' : 'h2'
  return (
    <section className={withHeading ? 'section' : 'pt-10 pb-20 sm:pb-24'} aria-label="Industries we serve">
      <div className="container-x">
        {withHeading && (
          <SectionHeading
            as={headingAs}
            eyebrow="Industries"
            title="Industries We Serve"
            intro="We support businesses and individuals with metalwork requirements across sectors in and around Ahmedabad."
          />
        )}
        {list.length ? (
          <div className={`${withHeading ? 'mt-14' : ''} grid gap-5 sm:grid-cols-2 lg:grid-cols-4`}>
            {list.map((ind, i) => {
              const Icon = icons[ind.icon] || Cog
              return (
                <article
                  key={ind.title}
                  className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-card"
                  data-reveal
                  style={{ '--reveal-delay': `${i * 80}ms` }}
                >
                  <Img src={ind.image} alt="" sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/60 to-navy-900/10" aria-hidden="true" />
                  <ReviewTag className="absolute left-4 top-4" show={ind.status !== 'confirmed'}>Proposed</ReviewTag>
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur transition group-hover:border-accent group-hover:bg-accent">
                    <Icon className="h-6 w-6" />
                  </span>
                  <CardHeading className="mt-5 text-xl font-semibold text-white">{ind.title}</CardHeading>
                  <p className="mt-2 text-sm leading-relaxed text-silver-light/80">{ind.text}</p>
                </article>
              )
            })}
          </div>
        ) : (
          <EmptyState text="Whatever your industry, call or WhatsApp us to discuss your metalwork requirement." />
        )}
      </div>
    </section>
  )
}
