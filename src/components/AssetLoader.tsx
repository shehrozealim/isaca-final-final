import { useEffect, useState } from 'react'
import { usePreferences } from '../architecture/preferences'
import { useScrollState } from '../architecture/scrollContext'
import { siteContent } from '../data/content'
import { prepareBunkerAssets, useBunkerAssets, waitForBunkerRender } from '../scenes/bunker/bunkerAssets'
import { ensurePageFonts } from '../scenes/bunker/PageTypography'
import './AssetLoader.css'

export default function AssetLoader() {
  const assets = useBunkerAssets()
  const { reducedMotion } = usePreferences()
  const { lockScroll } = useScrollState()
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [slow, setSlow] = useState(false)
  const text = siteContent.loading

  useEffect(() => {
    let disposed = false
    const unlock = lockScroll()
    document.documentElement.dataset.loading = 'true'
    const timeout = window.setTimeout(() => { if (!disposed) setSlow(true) }, 45000)
    const video = document.querySelector<HTMLVideoElement>('[data-intro-video]')
    let detach = () => {}
    const film = reducedMotion || !video ? Promise.resolve() : new Promise<void>((resolve, reject) => {
      const loaded = () => resolve()
      const error = () => reject(new Error('Intro video unavailable'))
      video.addEventListener('loadeddata', loaded, { once: true })
      video.addEventListener('error', error, { once: true })
      detach = () => { video.removeEventListener('loadeddata', loaded); video.removeEventListener('error', error) }
      if (video.readyState >= 2) resolve()
      if (video.error) error()
    })
    // Model and texture promises include the first shader compilation, so the
    // loading screen cannot disappear while a blank desk is still compiling.
    void Promise.all([film, ensurePageFonts(), prepareBunkerAssets(),
      reducedMotion ? Promise.resolve(true) : waitForBunkerRender(),
    ]).then((results) => {
      if (disposed) return
      if (!results[3]) { setFailed(true); return }
      setReady(true)
      delete document.documentElement.dataset.loading
      unlock()
    }).catch(() => { if (!disposed) setFailed(true) })
    return () => {
      disposed = true; clearTimeout(timeout); detach(); unlock()
      delete document.documentElement.dataset.loading
    }
  }, [lockScroll, reducedMotion])

  const progress = Math.min(92, Math.round(assets.loaded / assets.total * 92))
  useEffect(() => {
    const controller = (window as Window & { D3COYLoader?: { setProgress: (value: number) => void } }).D3COYLoader
    controller?.setProgress(ready ? 100 : progress)
    if (ready) document.getElementById('loader')?.remove()
  }, [ready, progress])
  const lighter = () => {
    const url = new URL(location.href)
    url.searchParams.set('effects', 'reduce')
    location.replace(url)
  }
  if (ready || (!failed && !slow)) return null
  return <div className="asset-loader" role="status" aria-live="polite">
    <div className="asset-loader-card"><p>{failed ? text.failed : text.slow}</p>
      {failed && <button onClick={() => location.reload()}>{text.retry}</button>}
      <button onClick={lighter}>{text.simple}</button>
    </div>
  </div>
}
