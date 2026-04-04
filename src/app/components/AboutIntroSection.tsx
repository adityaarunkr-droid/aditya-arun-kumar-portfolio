import './about-intro-section.css'
import { motion, useReducedMotion, useScroll } from 'framer-motion'
import { useRef } from 'react'
import { AboutScrollyCanvas } from './AboutScrollyCanvas'
import { AboutScrollyOverlay } from './AboutScrollyOverlay'
import { HeroVisitorCounter } from './HeroVisitorCounter'

const easeLux = [0.16, 1, 0.3, 1] as const

const storyContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.06 },
  },
}

const storyItem = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easeLux },
  },
}

/**
 * Scroll canvas + story — lives inside `#home` as a continuation of the hero (no About label).
 */
export function AboutIntroSection() {
  const reduceMotion = useReducedMotion()
  const scrollyRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: scrollyRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div className="about-intro">
      <div className="about-intro__heroBleed">
        <div
          ref={scrollyRef}
          className="relative h-[500vh] w-full"
        >
          <div className="sticky top-0 h-[100dvh] min-h-[100svh] w-full overflow-hidden bg-zinc-100 dark:bg-[#121212]">
            <AboutScrollyCanvas
              scrollYProgress={scrollYProgress}
              reduceMotion={reduceMotion}
            />
            <AboutScrollyOverlay scrollYProgress={scrollYProgress} />
            <HeroVisitorCounter />
          </div>
        </div>
      </div>

      <div className="about-intro__stack">
        <motion.div
          className="about-intro__story"
          variants={storyContainer}
          initial={reduceMotion ? false : 'hidden'}
          whileInView={reduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p className="about-intro__storyLead" variants={storyItem}>
            Engineer, builder and detail‑obsessed maker — I turn fuzzy ideas into products
            that feel fast, clear and a little cinematic.
          </motion.p>
          <motion.p variants={storyItem}>
            Most of my time goes into the web: APIs, databases and interfaces people
            actually want to use. I care about motion, performance and small interactions
            that make a screen feel alive….
          </motion.p>
          <motion.p variants={storyItem}>
            If it&apos;s thoughtful, well‑crafted and built to scale, I&apos;m probably
            interested. :)
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
