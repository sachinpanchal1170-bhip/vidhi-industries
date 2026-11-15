import { REVIEW_MODE } from '../config/site.js'

/** Items shown on the site: confirmed always, proposed only in REVIEW_MODE. */
export const visibleItems = (items) => items.filter((i) => i.status === 'confirmed' || REVIEW_MODE)

/** Gallery images: real photos always, placeholders only in REVIEW_MODE. */
export const visibleImages = (images) => images.filter((i) => !i.placeholder || REVIEW_MODE)
