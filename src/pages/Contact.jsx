import PageHero from '../components/sections/PageHero.jsx'
import ContactSection from '../components/sections/ContactSection.jsx'

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let's Discuss Your Metalwork Requirement"
        intro="Call, WhatsApp or send an inquiry. You are also welcome to visit our workshop in Rakhial, Ahmedabad."
        image="/images/service-welding.webp"
      />
      <div className="[&>section]:pt-16">
        <ContactSection withHeading={false} autoLoadMap />
      </div>
    </>
  )
}
