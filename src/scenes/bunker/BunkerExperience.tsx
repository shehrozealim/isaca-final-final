import { copy } from '../../data/content'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBunkerBackground } from '../../components/bunker/bunkerBackgroundState'
import { usePreferences } from '../../architecture/preferences'
import { useScrollState } from '../../architecture/scrollContext'
import BunkerWorld from './BunkerWorld'
import BunkerOverlays from './BunkerOverlays'
import { bunkerChapters } from './bunkerChapters'
import { createBunkerTimeline, addDeskChoreography, BUNKER_DURATION, panelAt } from './bunkerTimeline'
import './BunkerExperience.css'
import { deskSchedule } from './deskSchedule'
import { addDocumentChoreography, syncDocumentAccessibility } from './bunkerTimeline'
import { journalMotion, deskMotion, resetDeskMotion } from './journalMotion'

export default function BunkerExperience() {
  const background = useBunkerBackground()
  const { simple, mobile, reducedMotion } = usePreferences()
  const { state, scrollTo } = useScrollState()
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const master = useRef<ReturnType<typeof createBunkerTimeline> | null>(null)
  const mobileMaster = useRef<gsap.core.Timeline | null>(null)
  const pendingChapter = useRef<string | null>(null)
  const [artReady, setArtReady] = useState(false)
  const active = state.active.id === 'S03'

  useEffect(() => {
    if (!background.room) return
    let cancelled = false
    // Decode the real mounted sprites during S02, before opacity reveals can
    // trigger an asynchronous first paint. Never reload/decode the bunker plate.
    const images = Array.from(background.room.querySelectorAll<HTMLImageElement>('.bunker-object img, .bunker-clean-plate'))
    void Promise.all(images.map(image => image.decode())).then(() => {
      if (!cancelled) setArtReady(true)
    }).catch((error: unknown) => {
      if (!cancelled) { console.warn('Bunker detail image unavailable', error); setArtReady(true) }
    })
    return () => { cancelled = true }
  }, [background.room])

  const navigate = useCallback((id: string, animate = true) => {
    const chapter = bunkerChapters.find(item => item.id === id)
    if (!chapter) return
    if (background.phase !== 'ready') {
      pendingChapter.current = id
      const shutter = document.getElementById('S02')
      if (shutter) scrollTo(shutter.offsetTop + 2)
      return
    }
    const trigger = master.current?.timeline.scrollTrigger ?? mobileMaster.current?.scrollTrigger
    const element = document.getElementById(id)
    let destination: number
    if (trigger) destination = trigger.start + (trigger.end - trigger.start) * chapter.at * (mobile ? BUNKER_DURATION / deskSchedule.mobileDuration : 1)
    else if (simple && element) destination = element.getBoundingClientRect().top + window.scrollY - 32
    else { pendingChapter.current = id; return }
    const duration = animate && !reducedMotion ? Math.min(8, Math.max(2.2, Math.abs(destination - window.scrollY) / innerHeight * .22)) : 0
    scrollTo(destination, { duration })
    if (location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
    requestAnimationFrame(() => {
      if (element) { element.tabIndex = -1; element.focus({ preventScroll: true }) }
    })
  }, [background.phase, simple, mobile, reducedMotion, scrollTo])

  useEffect(() => {
    const handoff = () => { if (section.current) scrollTo(section.current.offsetTop) }
    window.addEventListener('hunt:s02-complete', handoff)
    return () => window.removeEventListener('hunt:s02-complete', handoff)
  }, [scrollTo])

  useEffect(() => {
    // Preserve the existing intro's #S10 link and chapter deep links. A cold
    // entry first runs S02, then seeks within the same retained surface.
    const intercept = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null
      const id = link?.getAttribute('href')?.slice(1)
      if (id && bunkerChapters.some(chapter => chapter.id === id)) {
        event.preventDefault()
        // Lenis's delegated window click handler does not honor defaultPrevented.
        // Intercept only S03 chapter links before that automatic anchor seek.
        event.stopPropagation()
        navigate(id)
      }
    }
    const hash = (animate = true) => {
      const id = location.hash.slice(1)
      if (bunkerChapters.some(chapter => chapter.id === id)) navigate(id, animate)
      else if (id === 'S03') {
        const destination = background.phase === 'ready' ? section.current : document.getElementById('S02')
        if (destination) scrollTo(destination.offsetTop + (background.phase === 'ready' ? 0 : 2))
      }
    }
    document.addEventListener('click', intercept, true)
    const hashChanged = () => hash()
    window.addEventListener('hashchange', hashChanged)
    // The initial fragment can arrive before React creates its destination,
    // so there may be no native hashchange or automatic anchor scroll.
    const initialHash = requestAnimationFrame(() => hash(false))
    return () => { cancelAnimationFrame(initialHash); document.removeEventListener('click', intercept, true); window.removeEventListener('hashchange', hashChanged) }
  }, [navigate, background.phase, scrollTo])

  useEffect(() => {
    if (active && background.phase === 'unavailable') {
      const id = location.hash.slice(1)
      if (bunkerChapters.some(chapter => chapter.id === id)) pendingChapter.current = id
      const shutter = document.getElementById('S02')
      if (shutter) scrollTo(shutter.offsetTop + 2)
    }
  }, [active, background.phase, scrollTo])

  useLayoutEffect(() => {
    const root = section.current
    const screen = viewport.current
    const { room, surface } = background
    if (!root || !screen || !room || !surface || background.phase !== 'ready' || !artReady) return
    if (simple) {
      const broadcast = screen.querySelector<HTMLElement>('.desk-broadcast')
      if (broadcast && reducedMotion) { broadcast.inert = false; broadcast.setAttribute('aria-hidden', 'false') }
      screen.querySelectorAll<HTMLElement>('[data-panel]').forEach(panel => { panel.inert = false; panel.removeAttribute('aria-hidden') })
      const nav = screen.querySelector<HTMLElement>('.bunker-chapters')
      if (nav) nav.inert = false
      ScrollTrigger.refresh()
      let mobileJournal: gsap.core.Timeline | undefined
      if (mobile && !reducedMotion) {
        const runway = screen.querySelector<HTMLElement>('.bunker-cinematic-runway')!
        mobileJournal = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: () => {
          journalMotion.draw?.(); syncDocumentAccessibility(screen); screen.dataset.mapFocus = String(deskMotion.mapFocus > .95)
          screen.querySelectorAll<HTMLElement>('[data-readout]').forEach(el => {
            const visible = Number(gsap.getProperty(el, 'opacity')) > .9
            el.inert = !visible; el.setAttribute('aria-hidden', String(!visible))
          })
        }, scrollTrigger: {
          trigger: runway, start: 'top top', end: 'bottom bottom', scrub: .85,
          onUpdate: self => {
            screen.dataset.cinematic = String(self.isActive)
            screen.dataset.chapter = self.isActive ? panelAt(self.progress * deskSchedule.mobileDuration) : ''
          },
        } })
        mobileMaster.current = mobileJournal
        addDeskChoreography(mobileJournal)
        addDocumentChoreography(mobileJournal, screen)
        mobileJournal.fromTo(broadcast, { opacity: 0, x: 24, scale: .85 }, { opacity: 1, x: 0, scale: 1, duration: 6, ease: 'power2.out' }, deskSchedule.broadcastStart)
          .to(broadcast, { opacity: 0, duration: 8 }, deskSchedule.roomReturn)
        mobileJournal.fromTo(room.querySelector('.bunker-clean-plate'), { opacity: 0 }, { opacity: 1, duration: 2 }, 1)
          .to(room.querySelector('.bunker-clean-plate'), { opacity: 0, duration: 12 }, deskSchedule.roomReturn)
          .fromTo(screen.querySelector('.bunker-journal-shade'), { opacity: 0 }, { opacity: .96, duration: 12 }, 2)
          .to(screen.querySelector('.bunker-journal-shade'), { opacity: 0, duration: 12 }, deskSchedule.roomReturn)
        for (const [name, at, end] of [['rules', 174, deskSchedule.caseEnd], ['prizes', deskSchedule.prizeRead, deskSchedule.prizeEnd], ['faq', deskSchedule.faqStart + 10, deskSchedule.faqEnd]] as const) {
          const readout = screen.querySelector(`[data-readout="${name}"]`)
          mobileJournal.fromTo(readout, { opacity: 0 }, { opacity: 1, duration: 2 }, at).to(readout, { opacity: 0, duration: 2 }, end)
        }
        mobileJournal.scrollTrigger?.refresh()
      }
      if (pendingChapter.current) { const id = pendingChapter.current; pendingChapter.current = null; navigate(id) }
      return () => {
        delete screen.dataset.mapFocus; delete screen.dataset.cinematic; delete screen.dataset.chapter
        mobileJournal?.scrollTrigger?.kill(); mobileJournal?.kill(); mobileMaster.current = null
        screen.querySelectorAll<HTMLElement>('[data-readout]').forEach(el => { el.style.opacity = '0'; el.inert = true; el.setAttribute('aria-hidden', 'true') })
        journalMotion.opacity = 0; resetDeskMotion(); journalMotion.draw?.()
      }
    }
    const context = gsap.context(() => { master.current = createBunkerTimeline(root, screen, room, surface) }, root)
    if (pendingChapter.current) { const id = pendingChapter.current; pendingChapter.current = null; navigate(id) }
    return () => { master.current?.dispose(); context.revert(); master.current = null }
  }, [background, simple, mobile, reducedMotion, navigate, artReady])

  useLayoutEffect(() => {
    if (viewport.current) viewport.current.inert = !active || background.phase !== 'ready'
  }, [active, background.phase])

  return <section ref={section} id="S03" className={`bunker-experience${simple ? ' bunker-experience--simple' : ''}${reducedMotion ? ' bunker-experience--reduced' : ''}`}
    style={simple ? undefined : { height: `${deskSchedule.duration * 5.76}svh` }} aria-labelledby="S03-title" data-ready={background.phase === 'ready'}>
    <h2 id="S03-title" className="bunker-accessible-title">{copy("The Bunker — DJS ISACA: The Hunt")}</h2>
    <BunkerWorld background={background} />
    <div ref={viewport} className="bunker-viewport" aria-hidden={!active || background.phase !== 'ready'}>
      <BunkerOverlays navigate={navigate} />
    </div>
  </section>
}
