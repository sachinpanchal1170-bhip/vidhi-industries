import { useEffect } from 'react'
import { useLocation } from '../../lib/router.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import MobileActionBar from './MobileActionBar.jsx'
import FloatingWhatsApp from './FloatingWhatsApp.jsx'
import { useReveal } from '../../hooks/useReveal.js'
import { applySeo } from '../../lib/seo-client.js'
import { routesMeta } from '../../config/seo.js'

function useScrollManagement() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // wait a frame so the target section is rendered
      requestAnimationFrame(() => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])
}

export default function Layout({ children }) {
  const { pathname } = useLocation()
  useScrollManagement()
  useReveal()
  useEffect(() => {
    applySeo(pathname, !routesMeta[pathname])
  }, [pathname])

  return (
    <>
      <Header />
      <main id="main">
        {children}
      </main>
      <Footer />
      <MobileActionBar />
      <FloatingWhatsApp />
    </>
  )
}
