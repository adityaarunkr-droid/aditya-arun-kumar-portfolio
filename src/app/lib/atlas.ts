/** Written by `npm run build:atlas` next to `atlas.webp`. */
export type SequenceAtlasMeta =
  | {
      version: 1
      image: string
      layout: 'horizontal'
      frameCount: number
      frameWidth: number
      frameHeight: number
    }
  | {
      version: 2
      image: string
      layout: 'grid'
      cols: number
      frameCount: number
      frameWidth: number
      frameHeight: number
    }

export const ATLAS_META_URL = '/sequence/atlas.json' as const

export function isAtlasMeta(x: unknown): x is SequenceAtlasMeta {
  if (!x || typeof x !== 'object') return false
  const o = x as Record<string, unknown>
  if (o.version === 1 && o.layout === 'horizontal') {
    return (
      typeof o.image === 'string' &&
      typeof o.frameCount === 'number' &&
      typeof o.frameWidth === 'number' &&
      typeof o.frameHeight === 'number'
    )
  }
  if (o.version === 2 && o.layout === 'grid') {
    return (
      typeof o.image === 'string' &&
      typeof o.cols === 'number' &&
      typeof o.frameCount === 'number' &&
      typeof o.frameWidth === 'number' &&
      typeof o.frameHeight === 'number'
    )
  }
  return false
}

export function atlasSliceForIndex(meta: SequenceAtlasMeta, index: number): { sx: number; sy: number } {
  const { frameWidth: fw, frameHeight: fh } = meta
  if (meta.layout === 'horizontal') {
    return { sx: index * fw, sy: 0 }
  }
  const col = index % meta.cols
  const row = Math.floor(index / meta.cols)
  return { sx: col * fw, sy: row * fh }
}
