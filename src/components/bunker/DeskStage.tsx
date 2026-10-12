import { useLayoutEffect, useRef } from 'react'
import BunkerBackground from './BunkerBackground'
import { publishBunkerBackground, releaseBunkerBackground } from './bunkerBackgroundState'
import './DeskStage.css'
export default function DeskStage() {
  const stage = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const surface = stage.current!
    const image = surface.querySelector<HTMLImageElement>('.s02-bunker')!
    let disposed = false
    publishBunkerBackground(surface, 'opening')
    void image.decode().then(() => { if (!disposed) publishBunkerBackground(surface, 'ready') }).catch(() => {})
    return () => { disposed = true; releaseBunkerBackground(surface) }
  }, [])
  return <div ref={stage} className="desk-stage" data-open="1" aria-hidden="true"><BunkerBackground /><div className="s02-dust-light" /><div className="s02-forward-spill" /></div>
}
