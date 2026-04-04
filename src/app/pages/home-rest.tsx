import { lazy, Suspense } from 'react'
import { AboutMeCard } from '../components/AboutMeCard'
import { ContactProfileLinks } from '../components/ContactProfileLinks'
import { HomeEndBookmark } from '../components/HomeEndBookmark'
import { RetroMonitorHero } from '../components/RetroMonitorHero'
import { SkeletonContactForm, SkeletonExperiencePanels } from '@/components/ui/skeleton'

const Contact2 = lazy(() =>
  import('@/components/ui/contact-2').then((m) => ({ default: m.Contact2 })),
)

const ExperienceSkillPanels = lazy(() =>
  import('../components/ExperienceSkillPanels').then((m) => ({
    default: m.ExperienceSkillPanels,
  })),
)

/** Below-the-fold home sections — lazy-loaded with Suspense for faster first paint. */
export function HomeRest() {
  return (
    <>
      <section id="experience" className="content-section experience-section">
        <p className="content-section__label">Career</p>
        <h2 className="content-section__title">Experience</h2>
        <p className="content-section__lead">
          The story behind what I ship — a clean, timeline-driven snapshot of education and
          hands-on impact.
        </p>
        <AboutMeCard />
        <Suspense fallback={<SkeletonExperiencePanels />}>
          <ExperienceSkillPanels />
        </Suspense>
      </section>

      <section id="resume" className="resume-page-section">
        <div className="content-section resume-details resume-page-section__intro">
          <h2 className="content-section__title">Resume</h2>
        </div>

        <div className="resume-page-section__tv" aria-label="Résumé visual">
          <div className="hero-section hero-section--resume">
            <div className="hero-content hero-content--resume">
              <h2 className="hero-title hero-title--resume">
                <span className="title-word pdf">The PDF</span>
                <span className="title-word version">version</span>
                <span className="title-word of">of</span>
                <span className="title-word me">me.</span>
              </h2>

              <div className="tv-scene">
                <div className="hero-media">
                  <div className="hero-glow" aria-hidden="true" />
                  <RetroMonitorHero fullBleed />
                </div>
              </div>

              <div className="resume-page-section__cta">
                <a
                  href="/AdityaArunKumar_Resume.pdf"
                  download="AdityaArunKumar_Resume.pdf"
                  className="resume-page-section__ctaBtn"
                >
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="content-section">
        <p className="content-section__label">Contact</p>
        <h2 className="content-section__title">Get in touch</h2>
        <p className="content-section__lead">
          Have a project, opportunity, or question in mind? Send a message and I&apos;ll get
          back to you soon.
        </p>
        <ContactProfileLinks />
        <Suspense fallback={<SkeletonContactForm className="mt-2" />}>
          <Contact2 email="adityaarunkr@gmail.com" />
        </Suspense>
      </section>

      <HomeEndBookmark />
    </>
  )
}
