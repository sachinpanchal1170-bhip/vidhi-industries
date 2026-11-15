# Vidhi Industries — Corporate Website

Premium, fully responsive website for **Vidhi Industries (વિધિ ઇન્ડસ્ટ્રિઝ)**, metal workshop in Rakhial, Ahmedabad.

**Stack:** React 19 · Vite · Tailwind CSS v4 · Lucide icons · wouter (2 KB router) — with build-time prerendering, so every page ships as real HTML with its own title, meta description, canonical URL, Open Graph tags and LocalBusiness JSON-LD.

## Quick start

```bash
npm install
cp .env.example .env      # set domain + form endpoint
npm run dev               # http://localhost:5173
npm run build             # → dist/ (static, deploy anywhere)
npm run serve             # preview dist/ like a real host (clean URLs, gzip, 404)
npm run images:sizes      # after adding/replacing photos: makes -640/-1280 sizes + manifest
npm run images            # re-render the 3D placeholder visuals (needs Playwright + Chromium)
```

## Pages
Home `/` · About `/about` · Services `/services` · Industries `/industries` · Our Work `/our-work` · Testimonials `/testimonials` · Contact `/contact` · 404 (`404.html`)

## ⚠️ Before going live — owner checklist

The site uses **only verified information**: name, Gujarati name, address, phone, WhatsApp, Google Maps link, the 5.0 Google rating and the one supplied review ("Best Working Jobs" — Sachin Panchal). Everything else is clearly marked as draft.

1. **Confirm services** — `src/content/services.js`. Remove any that don't apply; set `status: 'confirmed'` on the rest.
2. **Confirm industries** — `src/content/industries.js`, same way.
3. **Add real photos** — all current images are *3D-rendered placeholder visuals* of generic metal fabrication scenes (not photos of Vidhi Industries). Replace files in `public/images/` keeping the same names (or update paths in `src/content/*.js`), then run `npm run images:sizes`. For the gallery, add entries in `src/content/gallery.js` with `placeholder: false`. Hero, About and service images are always shown, so replace these before launch.
4. **Connect the contact form** — set `VITE_FORM_ENDPOINT` (Formspree / Web3Forms). Until then, the form validates input and offers a pre-filled **WhatsApp** message; it never shows a fake "sent" message.
5. **Set the domain** — `VITE_SITE_URL` (used in canonical URLs, sitemap.xml, robots.txt, OG tags).
6. **Switch off review mode** — `VITE_REVIEW_MODE=false`. This hides every "To be confirmed / Placeholder / Owner review" tag, and hides any item still marked `proposed` or `placeholder`. Sections with nothing confirmed fall back to a neutral "call / WhatsApp us" message.
7. Optional, once verified: add founding year, owner name, equipment, working hours, email, geo-coordinates (About page and `src/config/seo.js` schema).
8. Add new Google reviews to `src/content/testimonials.js` **exactly as written on Google** — never invent or paraphrase.

## Where things live

| What | File |
|---|---|
| Business details, links, form config, nav | `src/config/site.js` |
| Page titles, descriptions, JSON-LD | `src/config/seo.js` |
| Services / industries / gallery / reviews / values | `src/content/*.js` |
| Reusable components | `src/components/{layout,sections,ui}` |
| Pages | `src/pages` |
| Brand colours & fonts | `src/index.css` (`@theme`) |
| Logo / favicon | `src/components/ui/Logo.jsx`, `public/favicon.svg` |
| Social share image | `public/og-image.jpg` (`npm run og-image`) |

## SEO
- Unique title + meta description per page, single H1, semantic sections, alt text.
- LocalBusiness structured data with verified fields only. `aggregateRating`/`review` are deliberately **not** in the schema (Google disallows self-served review markup for local businesses, and ratings must not be hard-coded).
- `sitemap.xml` and `robots.txt` generated on build; 404 page is `noindex`.
- Target phrases used naturally in titles/copy: metal workshop in Ahmedabad, metal fabrication in Ahmedabad, metal work in Rakhial Ahmedabad, industrial metal workshop Ahmedabad, Vidhi Industries Ahmedabad.
- After launch: verify the domain in Google Search Console, submit the sitemap, and add the website URL to the Google Business Profile.

## Conversion features
Header Call Now + WhatsApp, sticky mobile Call/WhatsApp bar, floating WhatsApp button (tablet/desktop), per-service "Ask on WhatsApp" with pre-filled message, "Discuss This Service" pre-selects the service in the inquiry form, Get Directions on every CTA block, map facade with one-tap directions.

## Performance notes
- Every page is prerendered HTML with CSS inlined and the two main fonts preloaded.
- Images ship as WebP with `srcset` (640 / 1280 / original) via `src/content/image-manifest.json`.
- Google Maps loads only when requested on the homepage (facade); it auto-loads on the Contact page.
- Lighthouse (local, gzip): mobile Performance 92–94, Accessibility/Best Practices/SEO 100; desktop 100 across the board.

## Deployment
`dist/` is plain static files. Works on **Netlify**, **Cloudflare Pages**, **Vercel** (`vercel.json` included) and **Apache/cPanel** (`.htaccess` included — clean URLs, HTTPS, caching, 404).
