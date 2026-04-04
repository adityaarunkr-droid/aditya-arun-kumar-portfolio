import './profile-avatar-3d.css'
import type { MouseEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import profileImg from '../../assets/profile-aditya.png'

const MAX_RX = 5.5
const MAX_RY = 8.5
const MAX_SCALE = 1.018
const LERP = 0.11
const IDLE_AFTER_MS = 2200
const MAX_EYE_PX = 2.4
const IDLE_RX_AMP = 0.42
const IDLE_RY_AMP = 0.38
const IDLE_Y_AMP = 1.8

type Target = { rx: number; ry: number; sc: number; ex: number; ey: number }

export function ProfileAvatar3D() {
  const [imgReady, setImgReady] = useState(false)
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const eyeRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<Target>({ rx: 0, ry: 0, sc: 1, ex: 0, ey: 0 })
  const currentRef = useRef<Target>({ rx: 0, ry: 0, sc: 1, ex: 0, ey: 0 })
  const idleRef = useRef(false)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const rafRef = useRef<number>(0)

  const bumpIdleTimer = useCallback(() => {
    idleRef.current = false
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      idleRef.current = true
    }, IDLE_AFTER_MS)
  }, [])

  const handleMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return
      const el = rootRef.current
      if (!el) return
      bumpIdleTimer()
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)))
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)))
      const t = targetRef.current
      t.rx = -ny * MAX_RX
      t.ry = nx * MAX_RY
      t.sc = MAX_SCALE
      t.ex = nx * MAX_EYE_PX
      t.ey = ny * (MAX_EYE_PX * 0.85)
    },
    [reduceMotion, bumpIdleTimer]
  )

  const handleLeave = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleRef.current = true
    const t = targetRef.current
    t.rx = 0
    t.ry = 0
    t.sc = 1
    t.ex = 0
    t.ey = 0
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    idleRef.current = true

    const tick = () => {
      const cur = currentRef.current
      const tgt = targetRef.current

      cur.rx += (tgt.rx - cur.rx) * LERP
      cur.ry += (tgt.ry - cur.ry) * LERP
      cur.sc += (tgt.sc - cur.sc) * LERP
      cur.ex += (tgt.ex - cur.ex) * LERP * 1.15
      cur.ey += (tgt.ey - cur.ey) * LERP * 1.15

      let rx = cur.rx
      let ry = cur.ry
      const t = performance.now() / 1000

      if (idleRef.current) {
        rx += Math.sin(t * 0.85) * IDLE_RX_AMP
        ry += Math.cos(t * 0.7) * IDLE_RY_AMP
      }

      const stage = stageRef.current
      const eyes = eyeRef.current
      if (stage) {
        const ty = idleRef.current ? Math.sin(t * 1.1) * IDLE_Y_AMP : 0
        stage.style.transform =
          `perspective(1000px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) ` +
          `scale3d(${cur.sc.toFixed(4)}, ${cur.sc.toFixed(4)}, 1) translateY(${ty.toFixed(2)}px)`
      }
      if (eyes) {
        eyes.style.transform =
          `translate(calc(-50% + ${cur.ex.toFixed(2)}px), calc(-50% + ${cur.ey.toFixed(2)}px))`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [reduceMotion])

  useEffect(() => {
    const el = imgRef.current
    if (el?.complete && el.naturalWidth) {
      queueMicrotask(() => setImgReady(true))
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={cn('pa3d', !reduceMotion && 'pa3d--interactive')}
      onMouseMove={reduceMotion ? undefined : handleMove}
      onMouseLeave={reduceMotion ? undefined : handleLeave}
    >
      <div className="pa3d__glow" aria-hidden="true" />
      <div className="pa3d__halo" aria-hidden="true" />
      <div className="pa3d__rim" aria-hidden="true" />

      <div ref={stageRef} className="pa3d__stage">
        <div className="pa3d__inner">
          <div className="pa3d__frame">
            {!imgReady ? (
              <Skeleton
                className="absolute inset-0 z-[2] rounded-[23px]"
                aria-hidden
              />
            ) : null}
            <img
              ref={imgRef}
              src={profileImg}
              alt="Aditya Arun Kumar"
              className={cn(
                'pa3d__img relative z-[3] transition-opacity duration-500',
                imgReady ? 'opacity-100' : 'opacity-0',
              )}
              width={640}
              height={800}
              decoding="async"
              onLoad={() => setImgReady(true)}
            />
            {!reduceMotion ? (
              <div className="pa3d__eyes" aria-hidden="true">
                <div ref={eyeRef} className="pa3d__gaze">
                  <span className="pa3d__glint pa3d__glint--l" />
                  <span className="pa3d__glint pa3d__glint--r" />
                </div>
              </div>
            ) : null}
            <div className="pa3d__sheen" aria-hidden="true" />
            <div className="pa3d__vignette" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
