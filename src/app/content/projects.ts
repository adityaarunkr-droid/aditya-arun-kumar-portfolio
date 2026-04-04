export type Project = {
  slug: string
  title: string
  tagline: string
  year: string
  kind: string
  color: string
  highlights: string[]
  links?: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    slug: 'imac-revival',
    title: 'iMac Revival',
    tagline: 'A playful product page with motion & shaders.',
    year: '2025',
    kind: 'Personal Project',
    color: 'from-fuchsia-300 to-sky-300',
    highlights: [
      'Rive-driven micro-interactions',
      'Custom WebGL shader accents',
      'Responsive editorial layout',
    ],
    links: [{ label: 'Live demo', href: '#' }],
  },
  {
    slug: 'nostalgia-alphabet',
    title: 'Nostalgia Alphabet',
    tagline: 'A typographic series turned into a scroll story.',
    year: '2024',
    kind: 'Personal Project',
    color: 'from-emerald-300 to-lime-200',
    highlights: ['Grid-first art direction', 'Smooth transitions', 'Downloadable assets'],
  },
  {
    slug: 'product-launch-kit',
    title: 'Product Launch Kit',
    tagline: 'A reusable system for shipping launches fast.',
    year: '2023',
    kind: 'Commercial Work',
    color: 'from-amber-200 to-rose-300',
    highlights: ['Design system components', 'Motion guidelines', 'Performance-focused build'],
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}

