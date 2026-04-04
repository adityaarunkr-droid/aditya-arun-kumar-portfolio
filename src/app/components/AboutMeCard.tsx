import './about-me-card.css'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import profileImg from '../../assets/profile-aditya.png'

/** Idle CSS float only on mouse-style devices; touch uses finger-driven tilt instead. */
function usePointerFineHover() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setOk(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return ok
}

export function AboutMeCard() {
  const [photoReady, setPhotoReady] = useState(false)
  const photoRef = useRef<HTMLImageElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const [tiltStyle, setTiltStyle] = useState<CSSProperties | undefined>(undefined)
  const reduceMotion = useReducedMotion()
  const pointerFineHover = usePointerFineHover()
  const tiltEnabled = !reduceMotion
  const useIdleFloat = pointerFineHover && tiltEnabled

  useEffect(() => {
    const el = photoRef.current
    if (el?.complete && el.naturalWidth) {
      queueMicrotask(() => setPhotoReady(true))
    }
  }, [])

  const applyTilt = useCallback((clientX: number, clientY: number) => {
    const el = sceneRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = Math.max(-1, Math.min(1, (clientX - cx) / (rect.width / 2)))
    const dy = Math.max(-1, Math.min(1, (clientY - cy) / (rect.height / 2)))
    const glareX = 50 + dx * 40
    const glareY = 50 + dy * 40
    const vars = {
      '--ltm-glare-x': `${glareX}%`,
      '--ltm-glare-y': `${glareY}%`,
    } as CSSProperties
    setTiltStyle({
      transform: `rotateX(${-dy * 16}deg) rotateY(${dx * 22}deg)`,
      transition: 'transform 0.08s ease-out',
      ...vars,
    })
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!tiltEnabled) return
      if (e.pointerType === 'mouse' && e.buttons !== 0) return
      applyTilt(e.clientX, e.clientY)
    },
    [applyTilt, tiltEnabled],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!tiltEnabled) return
      if (e.pointerType === 'touch' || e.pointerType === 'pen') {
        e.currentTarget.setPointerCapture(e.pointerId)
        applyTilt(e.clientX, e.clientY)
      }
    },
    [applyTilt, tiltEnabled],
  )

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!tiltEnabled) return
      if (e.pointerType !== 'mouse') return
      if (e.currentTarget.hasPointerCapture(e.pointerId)) return
      setTiltStyle(undefined)
    },
    [tiltEnabled],
  )

  const endTouchTilt = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return
    if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    } catch {
      /* ignore */
    }
    setTiltStyle(undefined)
  }, [tiltEnabled])

  return (
    <div className="amc" role="region" aria-label="Professional profile and digital pass">
      <div className="amc__grid">
        <div className="amc__left">
          <p className="amc__label">Professional</p>
          <h2 className="amc__title">
            Full‑Stack Engineer <span className="amc__titleAccent">Aditya Arun Kumar</span>
          </h2>
          <p className="amc__desc">
            I build clean, high-performance web products — from scalable backend APIs to
            polished responsive interfaces. I care about motion, speed and the small
            details that make products feel premium.
          </p>

          <div className="amc__miniTimeline" aria-label="Career timeline">
            <div className="amc__miniRail" aria-hidden="true" />

            <motion.div
              className="amc__miniRow amc__miniRow--education"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10, filter: 'blur(5px)' }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="amc__miniDot" aria-hidden="true" />
              <div className="amc__miniBody">
                <div className="amc__miniTop">
                  <span className="amc__miniKicker">Education</span>
                  <span className="amc__miniDate">Aug 17 - July 21</span>
                </div>
                <div className="amc__miniTitle">
                  Bachelor of Engineering in Information Science
                </div>
                <div className="amc__miniMeta">
                  Sir M Visvesvaraya Institute Of Technology
                </div>
                <div className="amc__miniDesc">
                  Winner of Hackathon 2019 and recipient of Competitive Programming Award.
                </div>
              </div>
            </motion.div>

            <motion.div
              className="amc__miniRow amc__miniRow--experience"
              initial={reduceMotion ? undefined : { opacity: 0, y: 10, filter: 'blur(5px)' }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            >
              <div className="amc__miniDot" aria-hidden="true" />
              <div className="amc__miniBody">
                <div className="amc__miniTop">
                  <span className="amc__miniKicker">Experience</span>
                  <span className="amc__miniDate">2021 – Now</span>
                </div>
                <div className="amc__miniTitle">LTM Bengaluru</div>
                <div className="amc__miniDesc">
                  Built React + ASP.NET Core solutions, improving platform performance by 20%
                  and increasing user engagement by 30%.
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="amc__right">
          <div
            ref={sceneRef}
            className={cn('amc__scene', !useIdleFloat && 'amc__scene--staticTouch')}
            onPointerDown={tiltEnabled ? handlePointerDown : undefined}
            onPointerMove={tiltEnabled ? handlePointerMove : undefined}
            onPointerLeave={tiltEnabled ? handlePointerLeave : undefined}
            onPointerUp={tiltEnabled ? endTouchTilt : undefined}
            onPointerCancel={tiltEnabled ? endTouchTilt : undefined}
          >
            <div
              className={cn('amc__wrapper', tiltStyle && 'amc__wrapper--tilt')}
              style={tiltStyle}
              aria-label="Digital pass card"
            >
              <div className="amc__lanyard" aria-hidden="true">
                <div className="amc__lanyardClip" />
                <div className="amc__lanyardString" />
              </div>

              <div className="ltm">
                <div className="ltm__card" role="group" aria-label="LTM ID card">
                  <div className="ltm__header">
                    <div className="ltm__brandRow">
                      <div className="ltm__ltBadge">
                        <div className="ltm__ltEmblem" aria-hidden="true">
                          L&amp;T
                        </div>
                        <div className="ltm__ltText">
                          A Larsen &amp; Toubro
                          <br />
                          Group Company
                        </div>
                      </div>
                      <div className="ltm__brand" aria-hidden="true">
                        LTM
                      </div>
                    </div>
                    <div className="ltm__fullName">Aditya Arun Kumar</div>
                  </div>

                  <div className="ltm__stripe" aria-hidden="true" />

                  <div className="relative w-full">
                    {!photoReady ? (
                      <Skeleton
                        className="absolute inset-0 z-[1] min-h-[200px] w-full rounded-none"
                        aria-hidden
                      />
                    ) : null}
                    <img
                      ref={photoRef}
                      className={cn(
                        'ltm__photo relative z-[2] transition-opacity duration-500',
                        photoReady ? 'opacity-100' : 'opacity-0',
                      )}
                      src={profileImg}
                      alt="Aditya Arun Kumar"
                      width={536}
                      height={400}
                      decoding="async"
                      loading="lazy"
                      onLoad={() => setPhotoReady(true)}
                    />
                  </div>

                  <div className="ltm__info">
                    <div className="ltm__row">
                      <div className="ltm__label">Status</div>
                      <div className="ltm__value">
                        <span className="ltm__statusDot" aria-hidden="true" />
                        Active
                      </div>
                    </div>
                    <div className="ltm__divider" aria-hidden="true" />
                    <div className="ltm__row">
                      <div className="ltm__label">Specialty</div>
                      <div className="ltm__value">
                        <span className="ltm__tag">React</span>
                        <span className="ltm__tag">ASP.NET Core</span>
                        <span className="ltm__tag">MS SQL</span>
                      </div>
                    </div>
                  </div>

                  <div className="ltm__barBlack" aria-hidden="true" />
                  <div className="ltm__barOrange" aria-hidden="true" />

                  <div className="ltm__glare" aria-hidden="true" />
                </div>
              </div>

              <div className="amc__chip amc__chip1" aria-hidden="true">
                <span className="amc__chipDot amc__chipDot1" /> UI polish
              </div>
              <div className="amc__chip amc__chip2" aria-hidden="true">
                <span className="amc__chipDot amc__chipDot2" /> APIs & systems
              </div>
              <div className="amc__chip amc__chip3" aria-hidden="true">
                <span className="amc__chipDot amc__chipDot3" /> Performance
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

