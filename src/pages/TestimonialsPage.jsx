import PageHero from '../components/sections/PageHero.jsx'
import Testimonials from '../components/sections/Testimonials.jsx'
import CtaSection from '../components/sections/CtaSection.jsx'

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="What Our Customers Say"
        intro="Genuine feedback from our customers on Google."
        image="/images/gallery-2.webp"
      />
      <div className="pt-4">
        <Testimonials withHeading={false} />
      </div>
      <CtaSection title="Worked With Us Before?" text="We would be grateful if you shared your experience on Google — it helps other customers find us." />
    </>
  )
}
