/**
 * Background ambient audio — swap the file anytime.
 *
 * Add your loop to: public/audio/ambient-loop.mp3
 * (Supported: mp3, ogg, m4a — set path + MIME if you change format.)
 */
export const AMBIENT_AUDIO_PUBLIC_PATH = '/audio/ambient-loop.mp3' as const

/** Master level when “on” (~16%). */
export const AMBIENT_TARGET_VOLUME = 0.16

/** Fade duration when toggling sound (ms). */
export const AMBIENT_FADE_MS = 900

const STORAGE_KEY = 'portfolio_ambient_user_muted'

/** `true` = user turned sound off; stays off on return visits. */
export function readAmbientMutedPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function writeAmbientMutedPreference(muted: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false')
  } catch {
    /* private mode / blocked */
  }
}
