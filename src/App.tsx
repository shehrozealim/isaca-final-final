import { copy } from './data/content'
import { lazy, Suspense } from 'react'
import { ScrollProvider } from './architecture/ScrollProvider'
import { scenes } from './data/scenes'
import Story from './components/Story'
import DevelopmentHud from './components/DevelopmentHud'
import ShutterTransition from './components/shutter-transition/ShutterTransition'
import './App.css'
import { RegistrationPage, RegistrationShortcut } from './components/Registration'
const World = lazy(() => import('./components/World'))
export default function App() {
  if (window.location.pathname.replace(/\/$/, '') === '/register') return <RegistrationPage />
  return <ScrollProvider>
    <a className="skip-link" href="#scroll-story">{copy("Skip to content")}</a>
    <Suspense fallback={null}><World /></Suspense>
    <ShutterTransition />
    <header><details><summary>{copy("Hunter’s Journal")}</summary><nav aria-label={copy("Scenes")}>{scenes.map(scene => <a key={scene.id} href={`#${scene.id}`}>{scene.id} {scene.title}</a>)}</nav></details></header>
    <Story />
    <RegistrationShortcut />
    {import.meta.env.DEV && new URLSearchParams(window.location.search).get('debug') === '1' && <DevelopmentHud />}
  </ScrollProvider>
}
