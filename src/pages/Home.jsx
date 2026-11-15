import Hero from '../components/sections/Hero.jsx'
import Intro from '../components/sections/Intro.jsx'
import ServicesGrid from '../components/sections/ServicesGrid.jsx'
import WhyChooseUs from '../components/sections/WhyChooseUs.jsx'
import Gallery from '../components/sections/Gallery.jsx'
import IndustriesGrid from '../components/sections/IndustriesGrid.jsx'
import Testimonials from '../components/sections/Testimonials.jsx'
import CtaSection from '../components/sections/CtaSection.jsx'
import ContactSection from '../components/sections/ContactSection.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <ServicesGrid />
      <WhyChooseUs />
      <Gallery limit={5} />
      <IndustriesGrid />
      <div className="border-t border-line" />
      <Testimonials />
      <CtaSection />
      <ContactSection />
    </>
  )
}
