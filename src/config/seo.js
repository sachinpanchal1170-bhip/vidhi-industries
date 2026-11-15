import { SITE_URL, business, fullAddress, links } from './site.js'

/** Per-route SEO. Used by the client <Seo> component AND the build-time prerenderer. */
export const routesMeta = {
  '/': {
    title: 'Vidhi Industries | Metal Workshop in Rakhial, Ahmedabad',
    description:
      'Vidhi Industries is a metal workshop in Rakhial, Ahmedabad. Discuss your metal fabrication and metalwork requirements — call +91 98253 42853 or WhatsApp us.',
  },
  '/about': {
    title: 'About Vidhi Industries | Metal Workshop Ahmedabad',
    description:
      'Learn about Vidhi Industries (વિધિ ઇન્ડસ્ટ્રિઝ), a quality-focused metal workshop at Shreenathji Estate, Rakhial, Ahmedabad, Gujarat.',
  },
  '/services': {
    title: 'Metalwork Services in Ahmedabad | Vidhi Industries',
    description:
      'Metal fabrication and metalwork services from Vidhi Industries, an industrial metal workshop in Rakhial, Ahmedabad. Share your requirement today.',
  },
  '/industries': {
    title: 'Industries We Serve | Vidhi Industries, Ahmedabad',
    description:
      'Metalwork support for businesses in and around Ahmedabad. See the sectors Vidhi Industries works with and discuss your project requirement.',
  },
  '/our-work': {
    title: 'Our Work & Workshop Gallery | Vidhi Industries Ahmedabad',
    description:
      'See the workshop and metalwork gallery of Vidhi Industries, a metal workshop in Rakhial, Ahmedabad. Call or WhatsApp +91 98253 42853 to discuss your job.',
  },
  '/testimonials': {
    title: 'Customer Reviews | Vidhi Industries – Rated 5.0 on Google',
    description:
      'Read what customers say about Vidhi Industries, metal workshop in Rakhial, Ahmedabad. Rated 5.0 on Google.',
  },
  '/contact': {
    title: 'Contact Vidhi Industries | Metal Work in Rakhial, Ahmedabad',
    description:
      'Contact Vidhi Industries at 11, Shreenathji Estate, Panna Estate Road, Rakhial, Ahmedabad 380023. Call or WhatsApp +91 98253 42853 or send an inquiry.',
  },
  404: {
    title: 'Page Not Found | Vidhi Industries',
    description: 'The page you are looking for could not be found.',
    noindex: true,
  },
}

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`

/**
 * LocalBusiness structured data — VERIFIED fields only.
 * aggregateRating/review are intentionally omitted: Google does not allow
 * self-served review markup for LocalBusiness, and ratings must never be
 * hard-coded. Add `geo`, `openingHours`, `email`, `logo` once confirmed.
 */
export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#business`,
  name: business.name,
  alternateName: business.nameGujarati,
  description: `${business.name} is a metal workshop in Rakhial, Ahmedabad, Gujarat.`,
  url: `${SITE_URL}/`,
  telephone: business.phoneE164,
  image: OG_IMAGE,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${business.address.line1}, ${business.address.line2}, ${business.address.locality}`,
    addressLocality: business.address.city,
    addressRegion: business.address.state,
    postalCode: business.address.postalCode,
    addressCountry: business.address.countryCode,
  },
  hasMap: links.directions,
  sameAs: [links.directions],
  areaServed: { '@type': 'City', name: 'Ahmedabad' },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: business.phoneE164,
    contactType: 'customer service',
    areaServed: 'IN',
  },
})

export const fullAddressText = fullAddress

const crumbLabels = {
  '/about': 'About Us',
  '/services': 'Services',
  '/industries': 'Industries We Serve',
  '/our-work': 'Our Work',
  '/testimonials': 'Testimonials',
  '/contact': 'Contact Us',
}

/** All JSON-LD blocks for a route. */
export function structuredData(pathname) {
  const blocks = [localBusinessSchema()]
  if (pathname === '/') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: business.name,
      alternateName: business.nameGujarati,
      url: `${SITE_URL}/`,
      inLanguage: 'en-IN',
      publisher: { '@id': `${SITE_URL}/#business` },
    })
  } else if (crumbLabels[pathname]) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: crumbLabels[pathname], item: `${SITE_URL}${pathname}` },
      ],
    })
  }
  return blocks
}

/** Build the head tags as an HTML string (for prerendering). */
export function headTags(pathname) {
  const meta = routesMeta[pathname] || routesMeta[404]
  const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.noindex
      ? '<meta name="robots" content="noindex, follow" />'
      : `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${business.name}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Vidhi Industries — metal workshop in Rakhial, Ahmedabad" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<meta name="geo.region" content="IN-GJ" />`,
    `<meta name="geo.placename" content="Ahmedabad" />`,
  ]
  if (!meta.noindex) {
    for (const block of structuredData(pathname))
      tags.push(`<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`)
  }
  return tags.join('\n    ')
}
