export default function SectionHeading({ eyebrow, title, intro, align = 'left', tone = 'dark', as: H = 'h2', className = '' }) {
  const center = align === 'center'
  const light = tone === 'light'
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`} data-reveal>
      {eyebrow && <p className={`eyebrow ${center ? 'justify-center' : ''}`}>{eyebrow}</p>}
      <H className={`h-section mt-4 ${light ? 'text-white' : ''}`}>{title}</H>
      {intro && <p className={`lead mt-5 ${light ? 'text-silver-light/80' : ''}`}>{intro}</p>}
    </div>
  )
}
