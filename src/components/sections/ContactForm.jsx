import { useEffect, useId, useState } from 'react'
import { useSearchParams } from '../../lib/router.jsx'
import { Send, Loader2, CheckCircle2, AlertTriangle, Info, Phone } from 'lucide-react'
import { WhatsAppIcon } from '../ui/Icons.jsx'
import { form as formConfig, links } from '../../config/site.js'
import { services } from '../../content/services.js'
import { visibleItems } from '../../lib/content.js'

const initial = { name: '', phone: '', email: '', service: '', details: '', company_website: '' }

export function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please enter your full name.'
  else if (v.name.trim().length < 2) e.name = 'Name looks too short.'

  const digits = v.phone.replace(/[^\d]/g, '').replace(/^(91|0)(?=\d{10}$)/, '')
  if (!v.phone.trim()) e.phone = 'Please enter your phone number.'
  else if (!/^[6-9]\d{9}$/.test(digits)) e.phone = 'Enter a valid 10-digit Indian mobile number.'

  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email address.'

  if (!v.service) e.service = 'Please choose a service (or “Other / Not sure”).'

  if (!v.details.trim()) e.details = 'Please describe your requirement.'
  else if (v.details.trim().length < 15) e.details = 'Please add a little more detail (at least 15 characters).'
  return e
}

const buildWhatsAppText = (v) => {
  const lines = [
    'Hello Vidhi Industries, I would like to make an inquiry.',
    '',
    `Name: ${v.name.trim()}`,
    `Phone: ${v.phone.trim()}`,
  ]
  if (v.email.trim()) lines.push(`Email: ${v.email.trim()}`)
  lines.push(`Service: ${v.service}`, `Details: ${v.details.trim()}`)
  return lines.join('\n')
}

export default function ContactForm() {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  // idle | submitting | success | error | unconfigured
  const [status, setStatus] = useState('idle')
  const params = useSearchParams()
  const serviceParam = params.get('service')
  const uid = useId()
  const serviceOptions = [...visibleItems(services).map((s) => s.title), 'Other / Not sure']

  // Pre-select service from ?service=slug
  useEffect(() => {
    const match = services.find((s) => s.slug === serviceParam)
    if (match && serviceOptions.includes(match.title)) setValues((v) => ({ ...v, service: match.title }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceParam])

  const onChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    if (touched[e.target.name]) setErrors(validate(next))
    if (status === 'error' || status === 'unconfigured') setStatus('idle')
  }
  // Validate on blur only once something was typed — avoids layout shift
  // (and a missed click) when a user tabs/clicks past an empty field.
  const onBlur = (e) => {
    if (!e.target.value.trim()) return
    setTouched((t) => ({ ...t, [e.target.name]: true }))
    setErrors(validate(values))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({ name: true, phone: true, email: true, service: true, details: true })
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    // Honeypot: silently ignore bots
    if (values.company_website) return

    // Not configured (or Web3Forms without its access key) → offer WhatsApp instead
    if (!formConfig.endpoint || (/web3forms\.com/.test(formConfig.endpoint) && !formConfig.accessKey)) {
      setStatus('unconfigured')
      return
    }

    setStatus('submitting')
    try {
      const email = values.email.trim()
      const subject = `New website inquiry: ${values.service} (${values.name.trim()})`
      const isWeb3Forms = /web3forms\.com/.test(formConfig.endpoint)
      // Field names understood by Web3Forms and Formspree (both send these to the owner's inbox)
      const payload = {
        ...(isWeb3Forms ? { access_key: formConfig.accessKey, subject, from_name: 'Vidhi Industries Website' } : { _subject: subject }),
        Name: values.name.trim(),
        Phone: values.phone.trim(),
        ...(email ? { email } : {}), // used as reply-to so the owner can reply directly
        Service: values.service,
        'Project details': values.details.trim(),
        Page: typeof window !== 'undefined' ? window.location.href : '',
      }
      const res = await fetch(formConfig.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success === false) throw new Error(data.message || `Request failed (${res.status})`)
      setStatus('success')
      setValues(initial)
      setTouched({})
    } catch (err) {
      console.warn('Contact form submission failed:', err)
      setStatus('error')
    }
  }

  const fieldProps = (name) => ({
    id: `${uid}-${name}`,
    name,
    value: values[name],
    onChange,
    onBlur,
    'aria-invalid': touched[name] && errors[name] ? 'true' : 'false',
    'aria-describedby': touched[name] && errors[name] ? `${uid}-${name}-err` : undefined,
  })
  const Err = ({ name }) =>
    touched[name] && errors[name] ? (
      <p id={`${uid}-${name}-err`} className="mt-1.5 text-sm text-red-600">
        {errors[name]}
      </p>
    ) : null
  const Label = ({ name, children, optional }) => (
    <label htmlFor={`${uid}-${name}`} className="mb-2 block text-sm font-semibold text-navy">
      {children} {optional ? <span className="font-normal text-muted">(optional)</span> : <span className="text-accent-ink" aria-hidden="true">*</span>}
    </label>
  )

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-8" role="status">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        <h3 className="text-2xl font-semibold">Thank you — your inquiry has been sent.</h3>
        <p className="text-muted">We will get back to you on the phone number you provided. For urgent work, please call us directly.</p>
        <div className="flex flex-wrap gap-3">
          <a href={links.tel} className="btn-primary">
            <Phone className="h-4 w-4" /> Call Now
          </a>
          <button type="button" className="btn-outline" onClick={() => setStatus('idle')}>
            Send another inquiry
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" aria-label="Inquiry form">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label name="name">Full Name</Label>
          <input type="text" autoComplete="name" className="field" placeholder="Your full name" {...fieldProps('name')} />
          <Err name="name" />
        </div>
        <div>
          <Label name="phone">Phone Number</Label>
          <input type="tel" inputMode="tel" autoComplete="tel" className="field" placeholder="98XXXXXXXX" {...fieldProps('phone')} />
          <Err name="phone" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label name="email" optional>
            Email Address
          </Label>
          <input type="email" autoComplete="email" className="field" placeholder="you@company.com" {...fieldProps('email')} />
          <Err name="email" />
        </div>
        <div>
          <Label name="service">Service Required</Label>
          <select className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235b6672%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_14px_center] bg-no-repeat pr-10" {...fieldProps('service')}>
            <option value="">Select a service</option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Err name="service" />
        </div>
      </div>
      <div>
        <Label name="details">Project Details</Label>
        <textarea
          rows={5}
          className="field resize-y"
          placeholder="Describe the work — material, sizes, quantity, drawings available, timeline…"
          {...fieldProps('details')}
        />
        <Err name="details" />
      </div>

      {/* Honeypot (hidden from people) */}
      <div className="hidden" aria-hidden="true">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={values.company_website} onChange={onChange} />
        </label>
      </div>

      {status === 'unconfigured' && (
        <div className="rounded-lg border border-accent/40 bg-accent/10 p-5 text-sm" role="alert">
          <p className="flex items-center gap-2 font-semibold text-navy">
            <Info className="h-4 w-4 text-accent" /> Online form delivery is not set up yet
          </p>
          <p className="mt-1.5 text-ink/80">
            Your inquiry has <strong>not</strong> been sent. Your details are ready — send them to us on WhatsApp in one tap, or
            call us.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={links.whatsappWithText(buildWhatsAppText(values))} target="_blank" rel="noopener noreferrer" className="btn-navy">
              <WhatsAppIcon className="h-4 w-4" /> Send via WhatsApp
            </a>
            <a href={links.tel} className="btn-outline">
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm" role="alert">
          <p className="flex items-center gap-2 font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4" /> Sorry, your inquiry could not be sent.
          </p>
          <p className="mt-1.5 text-ink/80">Please try again, or reach us directly on WhatsApp or by phone.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={links.whatsappWithText(buildWhatsAppText(values))} target="_blank" rel="noopener noreferrer" className="btn-navy">
              <WhatsAppIcon className="h-4 w-4" /> Send via WhatsApp
            </a>
            <a href={links.tel} className="btn-outline">
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Fields marked <span className="text-accent-ink">*</span> are required. We use your details only to respond to your inquiry.
        </p>
        <button type="submit" className="btn-primary shrink-0 px-7 py-3.5 disabled:opacity-70" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send Inquiry <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
