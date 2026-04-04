import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { SkeletonCanvasSequence } from '@/components/ui/skeleton'
import {
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion'
import {
  ATLAS_META_URL,
  atlasSliceForIndex,
  isAtlasMeta,
  type SequenceAtlasMeta,
} from '../lib/atlas'
import { FRAME_COUNT, getFrameSrc } from '../lib/sequence'

type Props = {
  scrollYProgress: MotionValue<number>
  reduceMotion: boolean | null
  className?: string
}

/** Cover-fit a slice of an atlas strip into the canvas viewport. */
function drawImageCoverSlice(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  cw: number,
  ch: number
) {
  const ir = sw / sh
  const cr = cw / ch
  let dw: number
  let dh: number
  let ox: number
  let oy: number

  if (ir > cr) {
    dh = ch
    dw = ch * ir
    ox = (cw - dw) / 2
    oy = 0
  } else {
    dw = cw
    dh = cw / ir
    ox = 0
    oy = (ch - dh) / 2
  }

  ctx.drawImage(img, sx, sy, sw, sh, ox, oy, dw, dh)
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  const iw = img.naturalWidth || img.width
  const ih = img.naturalHeight || img.height
  if (!iw || !ih) return

  const ir = iw / ih
  const cr = cw / ch
  let dw: number
  let dh: number
  let ox: number
  let oy: number

  if (ir > cr) {
    dh = ch
    dw = ch * ir
    ox = (cw - dw) / 2
    oy = 0
  } else {
    dw = cw
    dh = cw / ir
    ox = 0
    oy = (ch - dh) / 2
  }

  ctx.drawImage(img, ox, oy, dw, dh)
}

export function AboutScrollyCanvas({
  scrollYProgress,
  reduceMotion,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const atlasMetaRef = useRef<SequenceAtlasMeta | null>(null)
  const frameIndexRef = useRef(0)
  const frameCountRef = useRef(FRAME_COUNT)

  const [ready, setReady] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const resizeAndDraw = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const { clientWidth: w, clientHeight: h } = wrap
    if (!w || !h) return

    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
    ctx.fillStyle = '#121212'
    ctx.fillRect(0, 0, w, h)

    const meta = atlasMetaRef.current
    const imgs = framesRef.current
    const fc = frameCountRef.current
    const idx = Math.min(fc - 1, Math.max(0, frameIndexRef.current))

    if (meta && imgs[0]?.complete && imgs[0].naturalWidth) {
      const { sx, sy } = atlasSliceForIndex(meta, idx)
      drawImageCoverSlice(ctx, imgs[0], sx, sy, meta.frameWidth, meta.frameHeight, w, h)
      return
    }

    const img = imgs[idx]
    if (img?.complete && img.naturalWidth) {
      drawImageCover(ctx, img, w, h)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadMultiFrames = () => {
      const images: HTMLImageElement[] = []
      let loaded = 0
      const fc = FRAME_COUNT
      frameCountRef.current = fc

      const onOne = (ok: boolean, index: number) => {
        if (ok && !cancelled) {
          /* ok */
        } else if (!cancelled) {
          setLoadError((prev) => prev ?? `Failed to load ${getFrameSrc(index)}`)
        }
        loaded += 1
        if (loaded === fc && !cancelled) {
          framesRef.current = images
          setReady(true)
          requestAnimationFrame(resizeAndDraw)
        }
      }

      for (let i = 0; i < fc; i++) {
        const img = new Image()
        img.decoding = 'async'
        img.src = getFrameSrc(i)
        const idx = i
        img.onload = () => onOne(true, idx)
        img.onerror = () => onOne(false, idx)
        images.push(img)
      }
    }

    ;(async () => {
      try {
        const res = await fetch(ATLAS_META_URL, { cache: 'no-store' })
        if (cancelled) return
        if (!res.ok) {
          loadMultiFrames()
          return
        }
        const json: unknown = await res.json()
        if (!isAtlasMeta(json)) {
          loadMultiFrames()
          return
        }
        const meta = json
        const atlasUrl = `/sequence/${meta.image}`
        const head = await fetch(atlasUrl, { method: 'HEAD', cache: 'no-store' }).catch(() => null)
        if (cancelled) return
        if (head && !head.ok && head.status !== 405) {
          loadMultiFrames()
          return
        }

        const img = new Image()
        img.decoding = 'async'
        img.src = atlasUrl
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error('atlas image'))
        })
        if (cancelled) return

        atlasMetaRef.current = meta
        frameCountRef.current = meta.frameCount
        framesRef.current = [img]
        setReady(true)
        requestAnimationFrame(resizeAndDraw)
      } catch {
        if (!cancelled) loadMultiFrames()
      }
    })()

    return () => {
      cancelled = true
    }
  }, [resizeAndDraw])

  useEffect(() => {
    if (!ready) return
    const ro = new ResizeObserver(() => resizeAndDraw())
    if (wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', resizeAndDraw)
    resizeAndDraw()
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', resizeAndDraw)
    }
  }, [ready, resizeAndDraw])

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reduceMotion) return
    const fc = frameCountRef.current
    const idx = Math.min(fc - 1, Math.max(0, Math.floor(p * fc)))
    if (idx === frameIndexRef.current) return
    frameIndexRef.current = idx
    resizeAndDraw()
  })

  useEffect(() => {
    if (!ready) return
    const fc = frameCountRef.current
    const p = reduceMotion ? 0 : scrollYProgress.get()
    frameIndexRef.current = Math.min(fc - 1, Math.max(0, Math.floor(p * fc)))
    resizeAndDraw()
  }, [ready, reduceMotion, scrollYProgress, resizeAndDraw])

  return (
    <div
      ref={wrapRef}
      className={`relative h-full w-full overflow-hidden bg-[#121212] ${className ?? ''}`}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full object-cover"
        aria-hidden
      />
      {!ready && !loadError && (
        <SkeletonCanvasSequence className="absolute inset-0 z-[1] bg-[#121212]" />
      )}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#121212] px-6 text-center text-sm text-red-400">
          {loadError}
        </div>
      )}
    </div>
  )
}
