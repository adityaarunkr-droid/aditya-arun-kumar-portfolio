import { motion, useReducedMotion } from 'framer-motion'
import './experience-timeline.css'

type TimelineItem = {
  kind: 'Education' | 'Experience'
  title: string
  org: string
  date: string
  description: string
}

const ITEMS: TimelineItem[] = [
  {
    kind: 'Education',
    title: 'Bachelor of Engineering in Information Science',
    org: 'Sir M Visvesvaraya Institute Of Technology',
    date: 'Aug 17 - July 21',
    description:
      'Winner of Hackathon 2019 and recipient of Competitive Programming Award.',
  },
  {
    kind: 'Experience',
    title: 'Software Engineer',
    org: 'LTM Bengaluru',
    date: '2021 – Now',
    description:
      'Building and enhancing enterprise-grade frontend applications using React and scalable backend solutions with ASP.NET Core. Played a key role in designing and improving platform performance by 20% and driving a 30% increase in user engagement.',
  },
]

export function ExperienceTimeline() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="xt" aria-label="Education and experience timeline">
      <div className="xt__head">
        <p className="xt__eyebrow">Timeline</p>
        <h3 className="xt__title">The path so far</h3>
      </div>

      <div className="xt__timeline" aria-hidden="true">
        <div className="xt__rail" />
      </div>

      <div className="xt__list">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.kind}
            className="xt__row"
            initial={reduceMotion ? undefined : { opacity: 0, y: 18, filter: 'blur(6px)' }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.08,
            }}
          >
            <div className="xt__left">
              <div className="xt__kicker">{item.kind}</div>
              <div className="xt__h">{item.title}</div>
              <div className="xt__org">{item.org}</div>
            </div>

            <div className="xt__mid">
              <div className="xt__dot" aria-hidden="true" />
              <div className="xt__date">{item.date}</div>
            </div>

            <div className="xt__right">
              <p className="xt__desc">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

