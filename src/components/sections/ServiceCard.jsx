import { Link } from '../../lib/router.jsx'
import { ArrowUpRight } from 'lucide-react'
import Img from '../ui/Img.jsx'
import ReviewTag from '../ui/ReviewTag.jsx'

export default function ServiceCard({ service, index = 0 }) {
  return (
    <article
      className="group card relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lift"
      data-reveal
      style={{ '--reveal-delay': `${(index % 3) * 80}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
        <Img
          src={service.image}
          alt={service.alt} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute bottom-4 left-5 font-display text-sm font-semibold text-white/80">
          {String(index + 1).padStart(2, '0')}
        </span>
        <ReviewTag className="absolute right-3 top-3" show={service.status !== 'confirmed'} />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-xl font-semibold">{service.title}</h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{service.short}</p>
        <Link
          to={`/services#${service.slug}`}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition group-hover:text-accent-ink"
        >
          Learn More<span className="sr-only"> about {service.title}</span>
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-accent transition duration-500 group-hover:scale-x-100" aria-hidden="true" />
    </article>
  )
}
