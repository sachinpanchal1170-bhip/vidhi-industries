/**
 * GALLERY — replace placeholders with real photographs of Vidhi Industries.
 *
 * To add a real photo:
 *  1. Put the file in /public/images/work/ (WebP or JPG, ~1600px wide).
 *  2. Add an entry with placeholder: false and an accurate caption & alt.
 *
 * Entries with placeholder: true are generated illustrations. They are only
 * shown in REVIEW_MODE and are always labelled "Placeholder".
 * category must be one of `galleryCategories`.
 */
export const galleryCategories = ['Workshop', 'Metalwork Projects', 'Fabrication Process', 'Finished Products']

export const gallery = [
  { src: '/images/gallery-1.webp', category: 'Workshop', caption: 'Workshop environment', alt: 'Placeholder visual of a metal workshop interior', placeholder: true, wide: true },
  { src: '/images/gallery-2.webp', category: 'Fabrication Process', caption: 'Welding in progress', alt: 'Placeholder visual of welding sparks', placeholder: true },
  { src: '/images/gallery-3.webp', category: 'Metalwork Projects', caption: 'Structural frame work', alt: 'Placeholder visual of a steel frame', placeholder: true },
  { src: '/images/gallery-4.webp', category: 'Finished Products', caption: 'Finished metal parts', alt: 'Placeholder visual of finished metal parts', placeholder: true },
  { src: '/images/gallery-5.webp', category: 'Fabrication Process', caption: 'Cutting operation', alt: 'Placeholder visual of a metal cutting spark stream', placeholder: true },
  { src: '/images/gallery-6.webp', category: 'Workshop', caption: 'Material ready for work', alt: 'Placeholder visual of stacked metal sheets', placeholder: true },
  { src: '/images/gallery-7.webp', category: 'Metalwork Projects', caption: 'Custom metalwork', alt: 'Placeholder visual of curved custom metalwork', placeholder: true },
  { src: '/images/gallery-8.webp', category: 'Finished Products', caption: 'Components', alt: 'Placeholder visual of industrial components', placeholder: true },
]
