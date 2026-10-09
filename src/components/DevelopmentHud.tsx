import { copy } from '../data/content'
import { useScrollState } from '../architecture/scrollContext'
import { usePreferences } from '../architecture/preferences'
export default function DevelopmentHud() {
  const { state } = useScrollState()
  const { mobile, reducedMotion } = usePreferences()
  return <aside className={`hud${state.active.id === 'S00' ? ' hud--intro' : ''}`} aria-label={copy("Development scroll diagnostics")}>
    <strong>{copy("Development HUD")}</strong>
    <div>{copy("Global:")} {state.global.toFixed(4)}</div>
    <div>{copy("Active:")} {state.active.id} {copy("·")} {state.active.title}</div>
    <div>{copy("Local:")} {state.local.toFixed(4)}</div>
    <div>{mobile ? copy("Mobile fallback") : copy("Desktop")}{reducedMotion ? copy(" · Reduced motion") : ''}</div>
  </aside>
}
