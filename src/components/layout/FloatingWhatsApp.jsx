import { WhatsAppIcon } from '../ui/Icons.jsx'
import { links } from '../../config/site.js'

/** Desktop/tablet floating WhatsApp button (mobile uses the bottom action bar). */
export default function FloatingWhatsApp() {
  return (
    <a
      href={links.whatsappWithText('Hello Vidhi Industries, I would like to discuss a metalwork requirement.')}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-[#11743c] py-3 pl-3 pr-3 text-white shadow-[0_12px_30px_-10px_rgb(0_0_0/0.5)] ring-4 ring-white/70 transition-all duration-300 hover:pr-5 md:flex"
      aria-label="Chat with Vidhi Industries on WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
        Chat on WhatsApp
      </span>
    </a>
  )
}
