import PageHero from '../components/sections/PageHero.jsx'
import Gallery from '../components/sections/Gallery.jsx'
import CtaSection from '../components/sections/CtaSection.jsx'
import { OwnerNote } from '../components/ui/ReviewTag.jsx'

export default function OurWork() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Our Workshop & Metalwork"
        intro="A look inside our workshop — the environment, the processes and the finished work."
        image="/images/gallery-6.webp"
      />
      <div className="bg-mist pt-16">
        <div className="container-x">
          <OwnerNote
            title="All images below are generated placeholders. To replace them:"
            items={[
              'Add real photos to public/images/work/ (about 1600px wide, WebP or JPG)',
              'Edit src/content/gallery.js — set the new src, caption, category and alt text, and placeholder: false',
              'Placeholders are hidden automatically when review mode is switched off',
            ]}
          />
        </div>
      </div>
      <div className="[&>section]:pt-10">
        <Gallery filters withHeading={false} />
      </div>
      <CtaSection />
    </>
  )
}
