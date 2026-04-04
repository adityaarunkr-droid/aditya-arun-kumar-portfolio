/**
 * Scroll-linked hero canvas: PNG frames under `public/sequence/`.
 * Naming: `frame_NNN_delay-{FRAME_DELAY_SUFFIX}.png` (see `getFrameSrc`).
 * If the folder is empty, `AboutScrollyCanvas` falls back to a static gradient.
 */
export const FRAME_INDEX_START = 0
/** Last frame index inclusive (e.g. `frame_094` → 95 frames). */
export const FRAME_INDEX_END = 94

/** Part after `delay-` in the filename, e.g. `0.055s` → `…_delay-0.055s.png` */
export const FRAME_DELAY_SUFFIX = '0.055s' as const

export const FRAME_COUNT = FRAME_INDEX_END - FRAME_INDEX_START + 1

export function getFrameSrc(index: number): string {
  const clamped = Math.min(Math.max(0, index), FRAME_COUNT - 1)
  const n = String(FRAME_INDEX_START + clamped).padStart(3, '0')
  return `/sequence/frame_${n}_delay-${FRAME_DELAY_SUFFIX}.png`
}
