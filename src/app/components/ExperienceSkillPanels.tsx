import { motion, useReducedMotion } from 'framer-motion'
import './experience-skill-panels.css'

const PANELS = [
  {
    id: 'frontend',
    eyebrow: 'Interface',
    title: 'Frontend',
    impact: 'Improved page speed and user experience.',
    description:
      'I build responsive, polished frontend experiences using React, TypeScript and modern UI practices — focused on performance, clarity and usability.',
    tags: [
      'JavaScript',
      'TypeScript',
      'React',
      'HTML5',
      'CSS3',
      'Responsive UI',
      'Performance',
    ],
  },
  {
    id: 'backend',
    eyebrow: 'Platform',
    title: 'Backend & cloud',
    impact: 'Improved API performance and backend efficiency.',
    description:
      'I build scalable backend systems with ASP.NET Core, SQL Server and Azure — focusing on API performance, clean architecture and reliable delivery pipelines.',
    tags: [
      'C#',
      'ASP.NET Core',
      'SQL Server',
      'Entity Framework',
      'Azure',
      'Azure DevOps',
      'CI/CD',
    ],
  },
] as const

export function ExperienceSkillPanels() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      id="what-i-do"
      className="esp-wrap"
      aria-labelledby="what-i-do-heading"
    >
      <div className="esp-wrap__connector" aria-hidden="true" />

      <div className="esp-wrap__head">
        <p className="esp-wrap__eyebrow">From experience</p>
        <h2 id="what-i-do-heading" className="esp-wrap__title">
          What I do
        </h2>
        <p className="esp-wrap__lead">
          What I work on day to day — frontend interfaces, backend systems and
          performance-focused delivery.
        </p>
      </div>

      <div className="esp" aria-label="Skills by domain">
        <div className="esp__grid">
          {PANELS.map((panel, i) => (
            <motion.article
              key={panel.id}
              className="esp__panel"
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.06,
              }}
            >
              <span className="esp__bracket esp__bracket--tl" aria-hidden="true" />
              <span className="esp__bracket esp__bracket--tr" aria-hidden="true" />
              <span className="esp__bracket esp__bracket--bl" aria-hidden="true" />
              <span className="esp__bracket esp__bracket--br" aria-hidden="true" />

              <div className="esp__glow" aria-hidden="true" />

              <header className="esp__titleGroup">
                <p className="esp__titleEyebrow">{panel.eyebrow}</p>
                <div className="esp__titleRow">
                  <span className="esp__titleAccent" aria-hidden="true" />
                  <h3 className="esp__title">{panel.title}</h3>
                </div>
              </header>

              <div className="esp__block">
                <p className="esp__label">Description</p>
                <p className="esp__body">{panel.description}</p>
              </div>

              <p className="esp__impact" role="note">
                <span className="esp__impactLabel">Impact</span>
                {panel.impact}
              </p>

              <div className="esp__block">
                <p className="esp__label">Skillset &amp; tools</p>
                <ul
                  className="esp__tags"
                  aria-label={`${panel.title} skills`}
                >
                  {panel.tags.map((tag) => (
                    <li key={tag} className="esp__tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}
