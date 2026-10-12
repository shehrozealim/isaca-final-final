import { copy } from './data/content'
import { lazy, Suspense, useState } from 'react'
import { ScrollProvider } from './architecture/ScrollProvider'
import Story from './components/Story'
import DevelopmentHud from './components/DevelopmentHud'
import ShutterTransition from './components/shutter-transition/ShutterTransition'
import './App.css'
import { RegistrationPage, RegistrationShortcut } from './components/Registration'
const World = lazy(() => import('./components/World'))
export default function App() {
  const [rotationDismissed, setRotationDismissed] = useState(false)
  if (window.location.pathname.replace(/\/$/, '') === '/register') return <RegistrationPage />
  return <ScrollProvider>
    <a className="skip-link" href="#scroll-story">{copy("Skip to content")}</a>
    <Suspense fallback={null}><World /></Suspense>
    <ShutterTransition />
    <Story />
    <RegistrationShortcut />
    {!rotationDismissed && <aside className="rotate-prompt" aria-label={copy('Rotate device')}>
      <span aria-hidden="true">↻</span><p>{copy('Rotate your phone for the best experience')}</p>
      <small>{copy('Use landscape mode to explore the full table.')}</small>
      <button onClick={() => setRotationDismissed(true)}>{copy('Continue in portrait')}</button>
    </aside>}
    {import.meta.env.DEV && new URLSearchParams(window.location.search).get('debug') === '1' && <DevelopmentHud />}
  </ScrollProvider>
}
