import { Quote, ArrowUpRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import Stars from '../ui/Stars.jsx'
import { GoogleIcon } from '../ui/Icons.jsx'
import { business } from '../../config/site.js'
import { testimonials } from '../../content/testimonials.js'

/** Shows ONLY genuine Google reviews from src/content/testimonials.js. */
export default function Testimonials({ withHeading = true }) {
  return (
    <section className="section relative overflow-hidden" aria-label="Customer testimonials">
      <div className="container-x">
        {withHeading && (
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Customers Say"
            intro="Genuine feedback from customers on our Google Business Profile."
          />
        )}
        {!withHeading && <h2 className="sr-only">Google rating and reviews</h2>}
        <div className={`${withHeading ? 'mt-14' : ''} grid gap-6 lg:grid-cols-12 lg:gap-8`}>
          {/* Rating summary */}
          <div className="card relative overflow-hidden p-8 lg:col-span-5" data-reveal>
            <div className="flex items-center gap-3">
              <GoogleIcon className="h-7 w-7" />
              <span className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted">Google Rating</span>
            </div>
            <div className="mt-8 flex items-end gap-4">
              <span className="font-display text-7xl font-semibold leading-none text-navy">{business.google.rating.toFixed(1)}</span>
              <span className="pb-2">
                <Stars value={business.google.rating} className="h-5 w-5" />
                <span className="mt-1 block text-sm text-muted">out of 5 on Google</span>
              </span>
            </div>
            <p className="mt-6 text-[15px] leading-relaxed text-muted">
              Read all reviews of {business.name} on Google, or share your own experience of working with us.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={business.google.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-navy">
                Read Reviews on Google <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href={business.google.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Write a Review
              </a>
            </div>
          </div>

          {/* Reviews */}
          <div className="grid gap-6 lg:col-span-7">
            {testimonials.map((t, i) => (
              <figure
                key={t.author + i}
                className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-navy p-8 text-white shadow-lift sm:p-10"
                data-reveal
                style={{ '--reveal-delay': '100ms' }}
              >
                <Quote className="absolute -right-2 -top-2 h-32 w-32 text-white/5" aria-hidden="true" />
                <Stars value={t.rating} className="h-5 w-5" />
                <blockquote className="mt-6 font-display text-3xl font-medium leading-snug text-white sm:text-4xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent font-display text-lg font-semibold text-white" aria-hidden="true">
                    {t.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{t.author}</span>
                    <span className="flex items-center gap-1.5 text-sm text-silver">
                      <GoogleIcon className="h-3.5 w-3.5" /> Google review
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
