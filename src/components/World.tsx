import { copy } from '../data/content'
import { signalBunkerRenderReady } from '../scenes/bunker/bunkerAssets'
import { Component, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Canvas } from '@react-three/fiber'
import { usePreferences } from '../architecture/preferences'
import { useBunkerBackground } from './bunker/bunkerBackgroundState'
import JournalScene from '../scenes/bunker/JournalScene'

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { signalBunkerRenderReady(false); return { failed: true } }
  render() { return this.state.failed ? <p className="fallback">{copy("3D unavailable. All sections remain accessible below.")}</p> : this.props.children }
}
export default function World() {
  const { mobile, reducedMotion } = usePreferences()
  const background = useBunkerBackground()
  if (!reducedMotion && ['opening', 'ready'].includes(background.phase)) {
    const canvas = <div className="world journal-world" aria-hidden="true">
      <CanvasBoundary><Canvas shadows={!mobile && navigator.hardwareConcurrency > 4} frameloop="demand" dpr={[1, mobile || navigator.hardwareConcurrency <= 4 ? 1.25 : 1.5]} camera={{ position: [0, 0, 12], fov: 38 }}
        gl={{ alpha: true, antialias: true }}><JournalScene mobile={mobile} /></Canvas></CanvasBoundary>
    </div>
    const slot = document.getElementById('bunker-canvas-slot')
    return slot ? createPortal(canvas, slot) : canvas
  }
  return null
}
