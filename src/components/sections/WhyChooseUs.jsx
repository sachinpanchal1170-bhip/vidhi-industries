import { Gem, Ruler, Smile, MessageSquare } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'
import { values } from '../../content/values.js'

const icons = { Gem, Ruler, Smile, MessageSquare }

export default function WhyChooseUs() {
  return (
    <section className="on-dark section relative overflow-hidden bg-navy text-white" aria-labelledby="why-title">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Why Choose Us"
          tone="light"
          title={<span id="why-title">Why Businesses Choose Vidhi Industries</span>}
          intro="Straightforward values that guide how we work with every customer."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => {
            const Icon = icons[v.icon]
            return (
              <article
                key={v.title}
                className="group relative bg-navy p-8 transition duration-300 hover:bg-navy-700"
                data-reveal
                style={{ '--reveal-delay': `${i * 80}ms` }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/15 text-accent transition group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-8 text-lg font-semibold text-white">{v.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-silver">{v.text}</p>
                <span className="absolute right-6 top-8 font-display text-sm text-white/20">0{i + 1}</span>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
