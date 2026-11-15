import { Star } from 'lucide-react'

export default function Stars({ value = 5, className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${className} ${i < Math.round(value) ? 'fill-accent text-accent' : 'text-silver'}`} />
      ))}
    </span>
  )
}
