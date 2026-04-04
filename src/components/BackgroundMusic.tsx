import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import {
  AMBIENT_AUDIO_PUBLIC_PATH,
  AMBIENT_FADE_MS,
  AMBIENT_TARGET_VOLUME,
  readAmbientMutedPreference,
  writeAmbientMutedPreference,
} from '@/config/ambientAudio'
import { cn } from '@/lib/utils'

type BackgroundMusicContextValue = {
  userMuted: boolean
  playbackBlocked: boolean
  isAudible: boolean
  loadError: boolean
  toggle: () => void
}

const BackgroundMusicContext = createContext<BackgroundMusicContextValue | null>(null)

function useBackgroundMusic(): BackgroundMusicContextValue | null {
  return useContext(BackgroundMusicContext)
}

export function BackgroundMusicProvider({ children }: PropsWithChildren) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeRafRef = useRef<number | null>(null)

  const [userMuted, setUserMuted] = useState(() => readAmbientMutedPreference())
  const [playbackBlocked, setPlaybackBlocked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audible, setAudible] = useState(false)
  const [loadError, setLoadError] = useState(false)

  const cancelFade = useCallback(() => {
    if (fadeRafRef.current != null) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }
  }, [])

  const fadeVolume = useCallback(
    (from: number, to: number, onComplete?: () => void) => {
      const el = audioRef.current
      if (!el) return
      cancelFade()
      const start = performance.now()
      el.volume = from
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / AMBIENT_FADE_MS)
        const eased = t * t * (3 - 2 * t)
        el.volume = from + (to - from) * eased
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(step)
        } else {
          fadeRafRef.current = null
          onComplete?.()
        }
      }
      fadeRafRef.current = requestAnimationFrame(step)
    },
    [cancelFade],
  )

  const pauseAfterFadeOut = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    const from = el.volume
    fadeVolume(from, 0, () => {
      el.pause()
      setIsPlaying(false)
      setAudible(false)
    })
  }, [fadeVolume])

  const beginPlayback = useCallback(async (): Promise<boolean> => {
    const el = audioRef.current
    if (!el || el.error) return false
    try {
      el.volume = 0
      const p = el.play()
      if (p !== undefined) await p
      setIsPlaying(true)
      setPlaybackBlocked(false)
      fadeVolume(0, AMBIENT_TARGET_VOLUME, () => setAudible(true))
      return true
    } catch {
      setPlaybackBlocked(true)
      setIsPlaying(false)
      setAudible(false)
      return false
    }
  }, [fadeVolume])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const onError = () => {
      setLoadError(true)
      setIsPlaying(false)
      setAudible(false)
      setPlaybackBlocked(false)
    }
    el.addEventListener('error', onError)

    const attemptStart = async () => {
      if (readAmbientMutedPreference()) {
        el.volume = 0
        el.pause()
        setIsPlaying(false)
        setAudible(false)
        setPlaybackBlocked(false)
        return
      }
      el.volume = 0
      try {
        const p = el.play()
        if (p !== undefined) await p
        setIsPlaying(true)
        setPlaybackBlocked(false)
        fadeVolume(0, AMBIENT_TARGET_VOLUME, () => setAudible(true))
      } catch {
        setPlaybackBlocked(true)
        setIsPlaying(false)
        setAudible(false)
      }
    }

    const onCanPlay = () => {
      void attemptStart()
    }

    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      void attemptStart()
    } else {
      el.addEventListener('canplay', onCanPlay, { once: true })
    }

    return () => {
      el.removeEventListener('error', onError)
      el.removeEventListener('canplay', onCanPlay)
      cancelFade()
      el.pause()
    }
  }, [cancelFade, fadeVolume])

  const toggle = useCallback(() => {
    if (loadError) return

    if (userMuted) {
      setUserMuted(false)
      writeAmbientMutedPreference(false)
      void beginPlayback()
      return
    }

    if (playbackBlocked) {
      void beginPlayback()
      return
    }

    if (isPlaying) {
      setUserMuted(true)
      writeAmbientMutedPreference(true)
      pauseAfterFadeOut()
      return
    }

    void beginPlayback()
  }, [loadError, userMuted, playbackBlocked, isPlaying, beginPlayback, pauseAfterFadeOut])

  const value = useMemo<BackgroundMusicContextValue>(
    () => ({
      userMuted,
      playbackBlocked,
      isAudible: audible && isPlaying && !userMuted,
      loadError,
      toggle,
    }),
    [userMuted, playbackBlocked, audible, isPlaying, loadError, toggle],
  )

  return (
    <BackgroundMusicContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={AMBIENT_AUDIO_PUBLIC_PATH}
        loop
        playsInline
        preload="metadata"
        className="hidden"
        aria-hidden
      />
      {children}
    </BackgroundMusicContext.Provider>
  )
}

export function BackgroundMusicToggle({ className }: { className?: string }) {
  const ctx = useBackgroundMusic()

  if (!ctx) return null

  const { userMuted, playbackBlocked, isAudible, loadError, toggle } = ctx

  if (loadError) {
    if (!import.meta.env.DEV) return null
    const hint =
      'Ambient sound: add public/audio/ambient-loop.mp3 (see src/config/ambientAudio.ts).'
    return (
      <button
        type="button"
        disabled
        aria-label={hint}
        title={hint}
        className={cn(
          'fixed bottom-[max(5rem,env(safe-area-inset-bottom,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))] z-[1001]',
          'flex h-11 min-h-[44px] min-w-[44px] cursor-not-allowed items-center justify-center rounded-full',
          'border border-zinc-200/80 bg-white/60 opacity-50 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/50',
          'sm:bottom-6 sm:right-6 md:bottom-8 md:right-8',
          className,
        )}
      >
        <VolumeX className="h-5 w-5 text-zinc-500 dark:text-zinc-500" aria-hidden strokeWidth={1.75} />
      </button>
    )
  }

  const off = userMuted || playbackBlocked || !isAudible
  const label = userMuted
    ? 'Sound off'
    : playbackBlocked
      ? 'Sound — click to enable (browser blocked autoplay)'
      : isAudible
        ? 'Sound on'
        : 'Sound off'

  return (
    <button
      type="button"
      onClick={() => toggle()}
      aria-label={label}
      aria-pressed={isAudible}
      title={label}
      className={cn(
        'fixed bottom-[max(5rem,env(safe-area-inset-bottom,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))] z-[1001]',
        'flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full',
        'border border-zinc-300/90 bg-white/90 shadow-md backdrop-blur-md transition',
        'hover:scale-[1.05] active:scale-[0.98]',
        'dark:border-white/12 dark:bg-zinc-950/75 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        'sm:bottom-6 sm:right-6 md:bottom-8 md:right-8',
        className,
      )}
    >
      {off ? (
        <VolumeX className="h-5 w-5 text-zinc-600 dark:text-zinc-300" aria-hidden strokeWidth={1.75} />
      ) : (
        <Volume2 className="h-5 w-5 text-zinc-700 dark:text-zinc-200" aria-hidden strokeWidth={1.75} />
      )}
    </button>
  )
}
