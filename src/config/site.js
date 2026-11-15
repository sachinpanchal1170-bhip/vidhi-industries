/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — single source of truth
 * ─────────────────────────────────────────────────────────────
 *  Everything in `business` below is VERIFIED information supplied
 *  by the business. Do not add capabilities, machinery, certifications,
 *  client names or years of experience here unless the owner confirms them.
 */

/**
 * REVIEW MODE
 * true  → content marked `status: 'proposed'` (services, industries) and
 *         placeholder images are shown, each with a small "To be confirmed"
 *         / "Placeholder" tag so the owner can review the draft site.
 * false → ONLY items marked `status: 'confirmed'` and real photographs are
 *         shown. Sections with nothing confirmed show a neutral fallback.
 *
 * Set VITE_REVIEW_MODE=false in .env for the public launch once content
 * has been confirmed.
 */
export const REVIEW_MODE = (import.meta.env?.VITE_REVIEW_MODE ?? 'true') !== 'false'

/** Production domain — used for canonical URLs, sitemap and Open Graph. */
export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://www.vidhiindustries.com').replace(/\/$/, '')

export const business = {
  name: 'Vidhi Industries',
  nameGujarati: 'વિધિ ઇન્ડસ્ટ્રિઝ',
  category: 'Metal Workshop',
  tagline: 'Precision in Metal. Excellence in Every Detail.',

  phoneDisplay: '+91 98253 42853',
  phoneE164: '+919825342853',
  whatsappNumber: '919825342853',

  address: {
    line1: '11, Shreenathji Estate',
    line2: 'Panna Estate Road, Soni Ni Chal',
    locality: 'Rakhial',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380023',
    country: 'India',
    countryCode: 'IN',
  },

  mapsUrl: 'https://maps.app.goo.gl/cfW9ZD8fNnDBJHYQ7',

  google: {
    rating: 5.0, // as shown on Google Business Profile
    reviewsUrl: 'https://maps.app.goo.gl/cfW9ZD8fNnDBJHYQ7',
  },
}

export const fullAddress = [
  business.address.line1,
  business.address.line2,
  business.address.locality,
  `${business.address.city}, ${business.address.state} ${business.address.postalCode}`,
].join(', ')

// Pre-built links used across the site
export const links = {
  tel: `tel:${business.phoneE164}`,
  whatsapp: `https://wa.me/${business.whatsappNumber}`,
  whatsappWithText: (text) => `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(text)}`,
  directions: business.mapsUrl,
  // Keyless Google Maps embed based on the verified address
  mapEmbed: `https://www.google.com/maps?q=${encodeURIComponent(
    `Vidhi Industries, ${fullAddress}, India`,
  )}&output=embed`,
}

/**
 * CONTACT FORM INTEGRATION
 * Set VITE_FORM_ENDPOINT to a form service URL that accepts JSON POSTs, e.g.
 *   Formspree:  https://formspree.io/f/xxxxxxx
 *   Web3Forms:  https://api.web3forms.com/submit  (+ VITE_FORM_ACCESS_KEY)
 * If not set, the form validates input and offers to send the inquiry via
 * WhatsApp instead — it never shows a fake "sent" message.
 */
export const form = {
  endpoint: import.meta.env?.VITE_FORM_ENDPOINT || '',
  accessKey: import.meta.env?.VITE_FORM_ACCESS_KEY || '',
}

export const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Industries', to: '/industries', mobileOnly: true },
  { label: 'Our Work', to: '/our-work' },
  { label: 'Testimonials', to: '/testimonials', mobileOnly: true },
  { label: 'Contact', to: '/contact' },
]
