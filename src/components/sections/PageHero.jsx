import { Link } from '../../lib/router.jsx'
import { ChevronRight } from 'lucide-react'
import Img from '../ui/Img.jsx'

/** Compact hero for inner pages, with breadcrumb. */
export default function PageHero({ eyebrow, title, intro, image = '/images/about-workshop.webp', crumb }) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-900 pt-36 pb-20 text-white sm:pt-44 sm:pb-24">
      <Img src={image} alt="" sizes="100vw" priority className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/50" aria-hidden="true" />
      <div className="grid-lines absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      <div className="container-x animate-[riseIn_0.8s_cubic-bezier(.2,.7,.2,1)_both]">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-silver">
            <li>
              <Link to="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li aria-current="page" className="text-accent">
              {crumb || eyebrow}
            </li>
          </ol>
        </nav>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-base leading-relaxed text-silver-light/85 sm:text-lg">{intro}</p>}
      </div>
    </section>
  )
}
