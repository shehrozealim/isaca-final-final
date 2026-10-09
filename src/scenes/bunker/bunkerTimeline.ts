import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createBunkerEffects } from './bunkerAudio'
import { journalMotion, deskMotion, resetDeskMotion } from './journalMotion'

gsap.registerPlugin(ScrollTrigger)
export const BUNKER_DURATION = 344
export const panelAt = (p: number) => p < 24 ? '' : p < 104 ? 'journal' : p < 145 ? 'board' : p < 208 ? 'rules' : p < 263 ? 'prizes' : p < 310 ? 'faq' : p < 330 ? 'radio' : 'finale'
export function addDeskChoreography(t: gsap.core.Timeline) {
  journalMotion.progress = 0; journalMotion.opacity = 0; resetDeskMotion()
  t.to(journalMotion, { opacity: 1, duration: 2 }, 1)
    .to(journalMotion, { progress: .18, duration: 12, ease: 'power2.inOut' }, 2)
    .to(journalMotion, { progress: .36, duration: 10, ease: 'power2.inOut' }, 14)
    .to(journalMotion, { progress: .57, duration: 4, ease: 'power2.inOut' }, 38)
    .to(journalMotion, { progress: .77, duration: 4, ease: 'power2.inOut' }, 56)
    .to(journalMotion, { progress: .98, duration: 4, ease: 'power2.inOut' }, 74)
    .to(journalMotion, { opacity: 0, duration: 4 }, 98)
    .to(deskMotion, { drift: 1, duration: 64, ease: 'sine.inOut' }, 24)
    .to(deskMotion, { opacity: 1, duration: 6 }, 88)
    .to(deskMotion, { approach: 1, duration: 16, ease: 'power2.inOut' }, 88)
    .to(deskMotion, { mapLift: 1, duration: 10, ease: 'power2.inOut' }, 104)
    .to(deskMotion, { route: 1, duration: 10, ease: 'power1.inOut' }, 110)
    .to(deskMotion, { mapFocus: 1, duration: 8, ease: 'power2.inOut' }, 114)
    .to(deskMotion, { mapFocus: 0, mapSettle: 1, duration: 12, ease: 'power2.inOut' }, 136)
    .to(deskMotion, { folderOpacity: 1, duration: 7, ease: 'power2.inOut' }, 145)
    .to(deskMotion, { folder: 1, duration: 12, ease: 'power2.inOut' }, 152)
    .to(deskMotion, { folderPage: 1, duration: 12, ease: 'power2.inOut' }, 162)
    .to(deskMotion, { folderPage: 0, duration: 8, ease: 'power2.inOut' }, 196)
    .to(deskMotion, { folder: 0, duration: 6, ease: 'power2.inOut' }, 202)
    .to(deskMotion, { folderOpacity: 0, duration: 8, ease: 'power2.inOut' }, 204)
    .to(deskMotion, { prizeOpacity: 1, duration: 10, ease: 'power2.inOut' }, 208)
    .to(deskMotion, { prize: 1, duration: 22, ease: 'power1.inOut' }, 218)
    .to(deskMotion, { prizeOpacity: 0, duration: 8, ease: 'power2.inOut' }, 260)
    .to(deskMotion, { faqOpacity: 1, duration: 7, ease: 'power2.inOut' }, 263)
    .to(deskMotion, { faq: 1, duration: 10, ease: 'power2.inOut' }, 268)
    .to(deskMotion, { opacity: 0, duration: 8 }, 302)
    .to(deskMotion, { approach: 0, duration: 1 }, 310)
  return t
}
export function createBunkerTimeline(section: HTMLElement, viewport: HTMLElement, room: HTMLDivElement, stage: HTMLDivElement) {
  const select = gsap.utils.selector(viewport), world = gsap.utils.selector(room)
  const baseline = { scale: Number(gsap.getProperty(room, 'scaleX')), x: Number(gsap.getProperty(room, 'x')), y: Number(gsap.getProperty(room, 'y')) }
  const panels = Array.from(viewport.querySelectorAll<HTMLElement>('[data-panel]'))
  const links = Array.from(viewport.querySelectorAll<HTMLElement>('[data-chapter]'))
  const effects = createBunkerEffects()
  const sync = (p: number, active: boolean) => {
    const raw = p * BUNKER_DURATION, panel = active ? panelAt(raw) : ''
    panels.forEach(element => { const available = active && element.dataset.panel === panel; element.inert = !available; element.setAttribute('aria-hidden', String(!available)) })
    viewport.dataset.chapter = panel; viewport.dataset.mapFocus = String(deskMotion.mapFocus > .95)
    viewport.querySelector<HTMLElement>('.bunker-chapters')!.inert = !active || raw < 11
    const index = ['journal', 'board', 'rules', 'prizes', 'faq', 'radio', 'finale'].indexOf(panel)
    links.forEach((link, i) => { if (i === index) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current') })
    effects.update(p, active)
  }
  const timeline = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: () => { journalMotion.draw?.(); viewport.dataset.mapFocus = String(deskMotion.mapFocus > .95) }, scrollTrigger: {
    id: 'S03-bunker', trigger: section, start: 'top top', end: 'bottom bottom', pin: viewport, pinSpacing: false, scrub: .85, invalidateOnRefresh: true,
    onUpdate: self => sync(self.progress, self.isActive || self.progress === 1), onRefresh: self => sync(self.progress, self.isActive || self.progress === 1), onToggle: self => sync(self.progress, self.isActive || self.progress === 1),
  } })
  addDeskChoreography(timeline)
  const show = (name: string, enter: number, leave: number) => {
    timeline.fromTo(select(`[data-panel="${name}"]`), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 2, ease: 'sine.out', immediateRender: false }, enter)
    if (leave < BUNKER_DURATION) timeline.to(select(`[data-panel="${name}"]`), { opacity: 0, y: -8, duration: 2 }, leave)
  }
  show('journal', 24, 88); show('rules', 176, 196); show('prizes', 242, 260); show('faq', 280, 302); show('radio', 316, 326); show('finale', 336, 344)
  timeline.fromTo(world('.bunker-clean-plate'), { opacity: 0 }, { opacity: 1, duration: 2, immediateRender: false }, 1)
    .to(world('.bunker-clean-plate'), { opacity: 0, duration: 6 }, 302)
    .fromTo(select('.bunker-journal-shade'), { opacity: 0 }, { opacity: .96, duration: 12, immediateRender: false }, 2)
    .to(select('.bunker-journal-shade'), { opacity: 0, duration: 8 }, 302)
    .fromTo(select('.bunker-chapters'), { opacity: 0 }, { opacity: 1, duration: 3, immediateRender: false }, 11)
    .fromTo(stage.querySelector('.s02-frame'), { opacity: 1 }, { opacity: 0, duration: 10, immediateRender: false }, 2)
    .fromTo(room, baseline, { scale: baseline.scale * 1.62, x: baseline.x - innerWidth * .265, y: baseline.y + innerHeight * .025, duration: 10, ease: 'power2.inOut', immediateRender: false }, 310)
    .to(room, { scale: baseline.scale * 1.06, x: baseline.x, y: baseline.y - innerHeight * .01, duration: 10, ease: 'power2.inOut' }, 330)
    .fromTo(world('[data-object="radio"]'), { opacity: 0, scale: .94, rotation: 3 }, { opacity: 1, scale: 1.15, rotation: 0, duration: 5, immediateRender: false }, 310)
    .fromTo(world('[data-object="radio-light"]'), { opacity: 0 }, { opacity: 1, duration: 4, immediateRender: false }, 312)
    .to(world('[data-object="radio"], [data-object="radio-light"]'), { opacity: 0, duration: 3 }, 326)
    .fromTo(world('[data-object="finale"]'), { opacity: 0, rotation: -12 }, { opacity: 1, rotation: 0, duration: 6, immediateRender: false }, 330)
    .fromTo(select('.bunker-chapter-wash'), { opacity: 0 }, { opacity: 1, duration: 4, immediateRender: false }, 310)
    .to(select('.bunker-chapter-wash'), { opacity: 0, duration: 4 }, 330)
    .fromTo(select('.bunker-room-shade'), { opacity: 0 }, { opacity: .80, duration: 7, immediateRender: false }, 332)
    .fromTo(select('.bunker-progress span'), { scaleX: 0 }, { scaleX: 1, duration: BUNKER_DURATION, immediateRender: false }, 0)
  timeline.scrollTrigger?.refresh(); sync(timeline.scrollTrigger?.progress ?? 0, timeline.scrollTrigger?.isActive ?? false)
  return { timeline, dispose: () => { effects.dispose(); journalMotion.opacity = 0; journalMotion.progress = 0; resetDeskMotion(); journalMotion.draw?.() } }
}
