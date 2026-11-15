import { Phone } from 'lucide-react'
import { WhatsAppIcon } from '../ui/Icons.jsx'
import { links } from '../../config/site.js'

/** Sticky call / WhatsApp bar on small screens — the two fastest ways to reach the workshop. */
export default function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-white/95 backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom)]">
      <a href={links.tel} className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-navy">
        <Phone className="h-4 w-4 text-accent" /> Call Now
      </a>
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 border-l border-line bg-navy py-3.5 text-sm font-semibold text-white"
      >
        <WhatsAppIcon className="h-4 w-4" /> WhatsApp
      </a>
    </div>
  )
}
