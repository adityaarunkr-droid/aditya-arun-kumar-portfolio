/** Ensures SVG tab icon resolves (BASE_URL for subpath deploys) and cache-busts stale globe fallback. */
export function syncFavicon() {
  const normalized = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/')
  const href = `${normalized}favicon.svg?v=aak2`

  let link = document.getElementById('aak-favicon') as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.id = 'aak-favicon'
    link.rel = 'icon'
    link.type = 'image/svg+xml'
    document.head.prepend(link)
  }
  link.setAttribute('sizes', 'any')
  link.href = href
}
