import { Phone } from 'lucide-react'
import { WhatsAppIcon } from '../ui/Icons.jsx'
import { links } from '../../config/site.js'

/** Neutral fallback when a section has no confirmed content yet. */
export default function EmptyState({ text }) {
  return (
    <div className="card mt-12 flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-xl text-[15px] text-muted">{text}</p>
      <div className="flex flex-wrap gap-3">
        <a href={links.tel} className="btn-primary">
          <Phone className="h-4 w-4" /> Call Now
        </a>
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-navy">
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </div>
  )
}
