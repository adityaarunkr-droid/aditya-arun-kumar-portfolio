import { motion, useReducedMotion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

export function MotionPage({ children }: PropsWithChildren) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y: 12, filter: 'blur(6px)' }
      }
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={
        reduceMotion ? undefined : { opacity: 0, y: -10, filter: 'blur(6px)' }
      }
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

