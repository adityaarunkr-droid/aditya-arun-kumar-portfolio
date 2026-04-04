import { motion, useTransform, type MotionValue } from 'framer-motion'

type Props = {
  scrollYProgress: MotionValue<number>
}

export function AboutScrollyOverlay({ scrollYProgress }: Props) {
  const s1Opacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.3],
    [1, 1, 0]
  )
  const s1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-6%'])

  /* Leading [0,0] stops Framer extrapolating negative opacity before the first keyframe. */
  const s2Opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.3, 0.42, 0.55],
    [0, 0, 1, 1, 0]
  )
  const s2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-11%'])

  /* Right column: hidden at top; fades in only after ~half the scroll runway. */
  const s3Opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.56, 0.68, 0.82, 0.94],
    [0, 0, 1, 1, 1, 0]
  )
  const s3Y = useTransform(scrollYProgress, [0, 1], ['0%', '-16%'])

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      <motion.div
        className="absolute inset-0 flex items-center justify-center px-6"
        style={{ opacity: s1Opacity, y: s1Y }}
      >
        <div className="text-center">
          <h2 className="about-intro__heroName text-balance">
            Aditya<span className="about-intro__heroDot">.</span>
          </h2>
          <p className="about-intro__heroRole mt-4 md:mt-5">
            Full Stack Engineer
          </p>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-end justify-start pl-3 pr-6 pb-[clamp(80px,15vh,180px)] md:pl-8 md:pr-16 md:pb-[clamp(96px,17vh,200px)] lg:pl-12 lg:pr-24"
        style={{ opacity: s2Opacity, y: s2Y }}
      >
        <div className="max-w-xl">
          <p className="font-['Syne',system-ui,sans-serif] text-3xl font-semibold leading-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl">
            I turn ideas into{' '}
            <span className="bg-gradient-to-r from-lime-300 to-emerald-400 bg-clip-text text-transparent">
              scalable products.
            </span>
          </p>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-end px-6 text-right md:px-16 lg:px-24"
        style={{ opacity: s3Opacity, y: s3Y }}
      >
        <div className="max-w-xl flex flex-col items-end gap-10 pt-14 md:gap-12 md:pt-20">
          <p className="font-['Syne',system-ui,sans-serif] text-3xl font-semibold leading-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl">
            Bridging design
            <br />
            and engineering.
          </p>
          <p className="font-['Syne',system-ui,sans-serif] text-3xl font-semibold leading-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl">
            From prototype
            <br />
            to production.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
