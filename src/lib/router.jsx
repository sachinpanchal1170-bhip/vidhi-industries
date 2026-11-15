/**
 * Thin routing layer over wouter (~2 KB) — replaces react-router-dom to keep
 * the JavaScript bundle small. Exposes the few primitives the site uses.
 */
import { Link as WLink, useLocation as useWLocation, useSearch } from 'wouter'
import { useLocationProperty } from 'wouter/use-browser-location'

export { Router, Switch, Route } from 'wouter'
export const Link = WLink

const getHash = () => window.location.hash
const getServerHash = () => ''

/** { pathname, search, hash } — re-renders on navigation and hash changes. */
export function useLocation() {
  const [pathname] = useWLocation()
  const search = useSearch()
  const hash = useLocationProperty(getHash, getServerHash)
  return { pathname, search, hash }
}

export function useSearchParams() {
  return new URLSearchParams(useSearch())
}

const isActivePath = (pathname, to) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`))

/** Link that knows whether it points at the current page. */
export function NavLink({ to, className, children, ...rest }) {
  const [pathname] = useWLocation()
  const active = isActivePath(pathname, to)
  return (
    <WLink href={to} className={typeof className === 'function' ? className({ isActive: active }) : className} aria-current={active ? 'page' : undefined} {...rest}>
      {children}
    </WLink>
  )
}
