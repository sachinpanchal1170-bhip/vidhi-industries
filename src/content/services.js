/**
 * SERVICES — editable.
 * status: 'proposed'  → shown only in REVIEW_MODE, tagged "To be confirmed".
 * status: 'confirmed' → shown on the live site.
 * Replace `image` with a real workshop photo in /public/images/ when available.
 * Keep descriptions factual; do not add machine names, tolerances or
 * capacities unless the owner confirms them.
 */
export const services = [
  {
    slug: 'metal-fabrication',
    title: 'Metal Fabrication',
    status: 'proposed',
    image: '/images/service-fabrication.webp',
    alt: 'Metal fabrication work in progress at a workshop',
    short: 'Fabrication of metal parts and assemblies made to your drawings, samples or requirements.',
    details:
      'Share a drawing, a sample piece or a description of what you need. We will review the requirement, discuss material and finish, and confirm what can be fabricated in our workshop.',
  },
  {
    slug: 'metal-cutting',
    title: 'Metal Cutting',
    status: 'proposed',
    image: '/images/service-cutting.webp',
    alt: 'Sparks from metal cutting in a workshop',
    short: 'Cutting of metal sections and sheets to size as part of your job work.',
    details:
      'Tell us the material, thickness and quantity you need cut. We will confirm feasibility and timelines before the work begins.',
  },
  {
    slug: 'welding-solutions',
    title: 'Welding Solutions',
    status: 'proposed',
    image: '/images/service-welding.webp',
    alt: 'Bright welding arc on a metal joint',
    short: 'Welding and joining work for new fabrications and existing metal pieces.',
    details:
      'From joining new parts to working on existing metal items, discuss your welding requirement with us and we will advise on the right approach.',
  },
  {
    slug: 'metal-structure-work',
    title: 'Metal Structure Work',
    status: 'proposed',
    image: '/images/service-structure.webp',
    alt: 'Steel structural frame members',
    short: 'Metal frames and structural work built to the specifications you provide.',
    details:
      'Bring your structural drawings or site requirement. We will review the scope with you and confirm what we can take on.',
  },
  {
    slug: 'custom-metalwork',
    title: 'Custom Metalwork',
    status: 'proposed',
    image: '/images/service-custom.webp',
    alt: 'Custom shaped metal work',
    short: 'One-off and made-to-order metal items for specific needs.',
    details:
      'Have something specific in mind? Describe it or share a reference and we will discuss how it can be made.',
  },
  {
    slug: 'industrial-metal-components',
    title: 'Industrial Metal Components',
    status: 'proposed',
    image: '/images/service-components.webp',
    alt: 'Industrial metal components arranged on a workbench',
    short: 'Metal components for industrial use, made as per your requirement.',
    details:
      'Share component drawings, quantities and material details. We will confirm what can be produced and the expected timeline.',
  },
]
