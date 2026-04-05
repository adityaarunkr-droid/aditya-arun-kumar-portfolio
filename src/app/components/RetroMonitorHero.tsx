import './retro-monitor-hero.css'
import heroImg from '../../assets/amstrad-hero.png'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

type TypeStep =
  | { kind: 'type'; text: string }
  | { kind: 'pause'; ms: number }
  | { kind: 'newline' }
  | { kind: 'clearLine' }
  | { kind: 'clearScreen' }

const CRT_MESSAGES = [
  'Hi, I hope you like my profile.',
  'Looking for my resume?',
  'Download it below.',
]

function buildSteps(lines: string[], mode: 'newline' | 'overwrite') {
  const steps: TypeStep[] = []
  // small "boot" beat before typing starts (cinematic, not flashy)
  steps.push({ kind: 'pause', ms: 450 })
  for (let i = 0; i < lines.length; i += 1) {
    steps.push({ kind: 'type', text: lines[i] })
    if (i !== lines.length - 1) {
      steps.push({ kind: 'pause', ms: 650 })
      if (mode === 'newline') steps.push({ kind: 'newline' })
      if (mode === 'overwrite') steps.push({ kind: 'clearScreen' })
    }
  }
  return steps
}

function ScreenTypewriterStatic({
  lines,
  mode,
}: {
  lines: string[]
  mode: 'newline' | 'overwrite'
}) {
  const staticLines = mode === 'overwrite' ? [lines[lines.length - 1] ?? ''] : [...lines]
  return (
    <div className="rmh__terminalText rmh__terminalText--reduced">
      {staticLines.map((line, idx) => (
        <div key={idx} className="rmh__line rmh__line--typed">
          {line}
        </div>
      ))}
    </div>
  )
}

function ScreenTypewriterAnimated({
  lines,
  typingMs = 42,
  mode = 'newline',
  repeatAfterMs,
}: {
  lines: string[]
  typingMs?: number
  mode?: 'newline' | 'overwrite'
  repeatAfterMs?: number
}) {
  const steps = useMemo(() => buildSteps(lines, mode), [lines, mode])
  const [renderedLines, setRenderedLines] = useState<string[]>([''])
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    let stepIdx = 0
    let charIdx = 0
    let timeout: number | undefined
    let stopped = false

    const tick = () => {
      if (stopped) return
      const step = steps[stepIdx]
      if (!step) {
        setIsDone(true)
        if (repeatAfterMs != null && repeatAfterMs > 0) {
          timeout = window.setTimeout(() => {
            if (stopped) return
            stepIdx = 0
            charIdx = 0
            setRenderedLines([''])
            setIsDone(false)
            tick()
          }, repeatAfterMs)
        }
        return
      }

      if (step.kind === 'pause') {
        timeout = window.setTimeout(() => {
          stepIdx += 1
          tick()
        }, step.ms)
        return
      }

      if (step.kind === 'newline') {
        setRenderedLines((prev) => [...prev, ''])
        stepIdx += 1
        charIdx = 0
        timeout = window.setTimeout(tick, 220)
        return
      }

      if (step.kind === 'clearLine') {
        setRenderedLines((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = ''
          return copy
        })
        stepIdx += 1
        charIdx = 0
        timeout = window.setTimeout(tick, 240)
        return
      }

      if (step.kind === 'clearScreen') {
        setRenderedLines([''])
        stepIdx += 1
        charIdx = 0
        timeout = window.setTimeout(tick, 280)
        return
      }

      // type
      const nextChar = step.text.slice(charIdx, charIdx + 1)
      if (!nextChar) {
        stepIdx += 1
        charIdx = 0
        timeout = window.setTimeout(tick, 150)
        return
      }

      if (nextChar === '\n') {
        setRenderedLines((prev) => [...prev, ''])
        charIdx += 1
        timeout = window.setTimeout(tick, Math.max(80, typingMs))
        return
      }

      setRenderedLines((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = copy[copy.length - 1] + nextChar
        return copy
      })
      charIdx += 1
      timeout = window.setTimeout(tick, typingMs)
    }

    // Start on next tick to satisfy react-hooks/set-state-in-effect
    timeout = window.setTimeout(() => {
      setRenderedLines([''])
      setIsDone(false)
      tick()
    }, 0)

    return () => {
      stopped = true
      if (timeout) window.clearTimeout(timeout)
    }
  }, [steps, typingMs, repeatAfterMs])

  return (
    <div className="rmh__terminalText rmh__terminalText--typing">
      {renderedLines.map((line, idx) => {
        const isLast = idx === renderedLines.length - 1
        return (
          <div key={idx} className="rmh__line rmh__line--typed">
            {line}
            {isLast ? (
              <span
                className={isDone ? 'rmh__cursor rmh__cursor--idle' : 'rmh__cursor'}
              >
                ▋
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function ScreenTypewriter({
  lines,
  typingMs = 42,
  mode = 'newline',
  repeatAfterMs,
  reduceMotion,
}: {
  lines: string[]
  typingMs?: number
  mode?: 'newline' | 'overwrite'
  repeatAfterMs?: number
  reduceMotion?: boolean
}) {
  if (reduceMotion) {
    return <ScreenTypewriterStatic lines={lines} mode={mode} />
  }
  return (
    <ScreenTypewriterAnimated
      lines={lines}
      typingMs={typingMs}
      mode={mode}
      repeatAfterMs={repeatAfterMs}
    />
  )
}

export function RetroMonitorHero({ fullBleed = false }: { fullBleed?: boolean }) {
  const reduceMotion = useReducedMotion()
  const [bgReady, setBgReady] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const Root = fullBleed ? 'div' : 'section'

  useEffect(() => {
    const el = imgRef.current
    if (el?.complete && el.naturalWidth) {
      queueMicrotask(() => setBgReady(true))
    }
  }, [])

  return (
    <Root
      className={cn('rmh', fullBleed && 'rmh--fullBleed')}
      aria-label={fullBleed ? 'Résumé monitor' : undefined}
    >
      <div className="rmh__wrap rmh__wrap--image relative">
        {!bgReady ? (
          <Skeleton
            className="absolute inset-0 z-[2] min-h-[220px] w-full rounded-[27px] sm:min-h-[280px] md:min-h-[320px]"
            aria-hidden
          />
        ) : null}
        <img
          ref={imgRef}
          className={cn(
            'rmh__bg relative z-[3] transition-opacity duration-500',
            bgReady ? 'opacity-100' : 'opacity-0',
            reduceMotion && 'transition-none',
          )}
          src={heroImg}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="lazy"
          sizes="(max-width: 900px) 100vw, min(860px, 78vw)"
          onLoad={() => setBgReady(true)}
        />

        <div className="rmh__screenPlane">
          <div className="rmh__screenOverlay" aria-hidden="true">
            <div className="rmh__screenMask" />
            <div className="rmh__screenFx" />
            <div className="rmh__screenGlass" />
          </div>

          <div className="rmh__screenText" aria-label="Résumé prompt on screen">
            <ScreenTypewriter
              mode="overwrite"
              lines={CRT_MESSAGES}
              repeatAfterMs={10_000}
              reduceMotion={!!reduceMotion}
            />
          </div>
        </div>
      </div>
    </Root>
  )
}

