import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './app/layout/Layout'
import { RouteFallback } from './app/components/RouteFallback'

const HomePage = lazy(() =>
  import('./app/pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const WorkPage = lazy(() =>
  import('./app/pages/WorkPage').then((m) => ({ default: m.WorkPage })),
)
const ProjectPage = lazy(() =>
  import('./app/pages/ProjectPage').then((m) => ({ default: m.ProjectPage })),
)
const AboutPage = lazy(() =>
  import('./app/pages/AboutPage').then((m) => ({ default: m.AboutPage })),
)
const ContactPage = lazy(() =>
  import('./app/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const NotFoundPage = lazy(() =>
  import('./app/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

export default function App() {
  const location = useLocation()

  return (
    <Layout>
      <Suspense key={location.pathname} fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<ProjectPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
