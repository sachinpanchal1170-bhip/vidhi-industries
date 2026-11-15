import PageHero from '../components/sections/PageHero.jsx'
import IndustriesGrid from '../components/sections/IndustriesGrid.jsx'
import CtaSection from '../components/sections/CtaSection.jsx'
import { OwnerNote } from '../components/ui/ReviewTag.jsx'

export default function Industries() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Industries We Serve"
        intro="Metalwork support for businesses in and around Ahmedabad. Don't see your sector? Get in touch — we are happy to discuss your requirement."
        image="/images/industry-infrastructure.webp"
      />
      <div className="container-x pt-16">
        <OwnerNote
          title="These industry categories are proposed. Before launch, please:"
          items={[
            'Confirm which sectors your customers actually come from',
            'Mark confirmed ones with status "confirmed" in src/content/industries.js',
            'Add new sectors only if you have worked with them',
          ]}
        />
      </div>
      <IndustriesGrid withHeading={false} />
      <CtaSection title="Have a Requirement From Your Industry?" />
    </>
  )
}
