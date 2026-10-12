import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createBunkerEffects } from './bunkerAudio'
import { journalMotion, deskMotion, resetDeskMotion } from './journalMotion'

import { deskSchedule as schedule, casePageCount, faqPageCount, caseStride, caseRead } from './deskSchedule'
gsap.registerPlugin(ScrollTrigger)
export const BUNKER_DURATION = schedule.duration
export const panelAt = (p: number) => p < 24 ? '' : p < 104 ? 'journal' : p < 145 ? 'board' : p < schedule.prizeStart ? 'rules' : p < schedule.faqStart ? 'prizes' : p < schedule.broadcastStart ? 'faq' : 'broadcast'
export function addDeskChoreography(t: gsap.core.Timeline) {
  journalMotion.progress = 0; journalMotion.closing = 0; journalMotion.opacity = 0; resetDeskMotion()
  // Mobile uses this same absolute schedule, including the final room reading hold.
  t.to({}, { duration: schedule.duration }, 0)
  t.to(journalMotion, { opacity: 1, duration: 2 }, 1)
    .to(journalMotion, { progress: .18, duration: 12, ease: 'power2.inOut' }, 2)
    .to(journalMotion, { progress: .36, duration: 10, ease: 'power2.inOut' }, 14)
    .to(journalMotion, { progress: .57, duration: 4, ease: 'power2.inOut' }, 38)
    .to(journalMotion, { progress: .77, duration: 4, ease: 'power2.inOut' }, 56)
    .to(journalMotion, { progress: .98, duration: 4, ease: 'power2.inOut' }, 74)
    .to(journalMotion, { closing: 1, duration: 6, ease: 'power2.inOut' }, 82)
    .to(deskMotion, { drift: 1, duration: 64, ease: 'sine.inOut' }, 24)
    .to(deskMotion, { opacity: 1, duration: 6 }, 88)
    .to(deskMotion, { approach: 1, duration: 16, ease: 'power2.inOut' }, 88)
    .to(deskMotion, { mapLift: 1, duration: 10, ease: 'power2.inOut' }, 104)
    .to(deskMotion, { route: 1, duration: 10, ease: 'power1.inOut' }, 110)
    .to(deskMotion, { mapFocus: 1, duration: 8, ease: 'power2.inOut' }, 114)
    .to(deskMotion, { mapFocus: 0, mapSettle: 1, duration: 12, ease: 'power2.inOut' }, 136)
    .to(deskMotion, { folderOpacity: 1, duration: 5, ease: 'power2.inOut' }, 145)
    .to(deskMotion, { folder: 1, duration: 8, ease: 'power2.inOut' }, 150)
    .to(deskMotion, { folderPage: 1, duration: 8, ease: 'power2.inOut' }, 156)
    .to(deskMotion, { folderTurn: 1, duration: 10, ease: 'power2.inOut' }, 174)
    .to(deskMotion, { folderPage: 0, folder: 0, folderOpacity: 0, duration: 12, ease: 'power2.inOut' }, schedule.caseEnd)
    .to(deskMotion, { prizeOpacity: 1, duration: 10, ease: 'power2.inOut' }, schedule.prizeStart)
    .to(deskMotion, { prize: 1, duration: 40, ease: 'power1.inOut' }, schedule.prizeStart + 10)
    .to(deskMotion, { prizeOpacity: 0, prize: 0, duration: 8, ease: 'power2.inOut' }, schedule.prizeEnd)
    .to(deskMotion, { faqOpacity: 1, duration: 8, ease: 'power2.inOut' }, schedule.faqStart)
    .to(deskMotion, { faq: 1, duration: 12, ease: 'power2.inOut' }, schedule.faqStart + 18)
    .to(deskMotion, { faq: 0, duration: 5, ease: 'power2.inOut' }, schedule.faqEnd)
    .to(deskMotion, { faqOpacity: 0, duration: 3, ease: 'power2.inOut' }, schedule.faqEnd + 5)
    .to(deskMotion, { broadcast: 1, duration: 6, ease: 'power2.inOut' }, schedule.broadcastStart)
  for (let i = 1; i < casePageCount; i++) t.to(deskMotion, { folderTurn: i + 1, duration: 10, ease: 'power2.inOut' }, caseRead + 14 + (i - 1) * caseStride)
  for (let i = 1; i < faqPageCount; i++) t.to(deskMotion, { faq: i + 1, duration: 12, ease: 'power2.inOut' }, schedule.faqRead + 24 + (i - 1) * 34)
  return t
}
export function createBunkerTimeline(section: HTMLElement, viewport: HTMLElement, room: HTMLDivElement) {
  const select = gsap.utils.selector(viewport), world = gsap.utils.selector(room)
  const panels = Array.from(viewport.querySelectorAll<HTMLElement>('[data-panel]'))
  const links = Array.from(viewport.querySelectorAll<HTMLElement>('[data-chapter]'))
  const effects = createBunkerEffects()
  const sync = (p: number, active: boolean) => {
    const raw = p * BUNKER_DURATION, panel = active ? panelAt(raw) : ''
    panels.forEach(element => { const available = active && element.dataset.panel === panel; element.inert = !available; element.setAttribute('aria-hidden', String(!available)) })
    viewport.dataset.chapter = panel; viewport.dataset.mapFocus = String(deskMotion.mapFocus > .95)
    viewport.querySelector<HTMLElement>('.bunker-chapters')!.inert = !active
    const index = ['journal', 'board', 'rules', 'prizes', 'faq', 'broadcast'].indexOf(panel)
    links.forEach((link, i) => { if (i === index) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current') })
    effects.update(p, active)
  }
  const timeline = gsap.timeline({ defaults: { ease: 'none' }, onUpdate: () => { journalMotion.draw?.(); syncDocumentAccessibility(viewport); viewport.dataset.mapFocus = String(deskMotion.mapFocus > .95) }, scrollTrigger: {
    id: 'S03-bunker', trigger: section, start: 'top top', end: 'bottom bottom', pin: viewport, pinSpacing: false, scrub: .85, invalidateOnRefresh: true,
    onUpdate: self => sync(self.progress, self.isActive || self.progress === 1), onRefresh: self => sync(self.progress, self.isActive || self.progress === 1), onToggle: self => sync(self.progress, self.isActive || self.progress === 1),
  } })
  addDeskChoreography(timeline)
  const show = (name: string, enter: number, leave: number) => {
    timeline.fromTo(select(`[data-panel="${name}"]`), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 2, ease: 'sine.out', immediateRender: false }, enter)
    if (leave < BUNKER_DURATION) timeline.to(select(`[data-panel="${name}"]`), { opacity: 0, y: -8, duration: 2 }, leave)
  }
  show('journal', 24, 88); show('rules', 164, schedule.caseEnd); show('prizes', schedule.prizeRead, schedule.prizeEnd); show('faq', schedule.faqStart + 10, schedule.faqEnd)
  addDocumentChoreography(timeline, viewport)
  timeline.fromTo(select('.desk-broadcast'), { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.out' }, schedule.broadcastStart + 6)
  timeline.fromTo(world('.bunker-clean-plate'), { opacity: 0 }, { opacity: 1, duration: 2, immediateRender: false }, 1)
    .fromTo(select('.bunker-journal-shade'), { opacity: 0 }, { opacity: .96, duration: 12, immediateRender: false }, 2)
    .fromTo(select('.bunker-progress span'), { scaleX: 0 }, { scaleX: 1, duration: BUNKER_DURATION, immediateRender: false }, 0)
  timeline.scrollTrigger?.refresh(); sync(timeline.scrollTrigger?.progress ?? 0, timeline.scrollTrigger?.isActive ?? false)
  return { timeline, dispose: () => { effects.dispose(); journalMotion.opacity = 0; journalMotion.progress = 0; resetDeskMotion(); journalMotion.draw?.() } }
}

export function addDocumentChoreography(t: gsap.core.Timeline, scope: HTMLElement) {
  const page = (selector: string, start: number, end: number) => {
    const nodes = Array.from(scope.querySelectorAll(selector)).filter(node => !scope.closest('.bunker-experience--simple') || node.closest('.bunker-mobile-document'))
    t.fromTo(nodes, { opacity: 0 }, { opacity: 1, duration: 2, immediateRender: false }, start)
      .to(nodes, { opacity: 0, duration: 2 }, end)
  }
  page('[data-case-cover]', 164, 173)
  for (let i = 0; i < casePageCount; i++) page(`[data-case-page="${i}"]`, caseRead + i * caseStride, i + 1 === casePageCount ? schedule.caseEnd : caseRead + 13 + i * caseStride)
  page('[data-faq-cover]', schedule.faqStart + 10, schedule.faqStart + 17)
  for (let i = 0; i < faqPageCount; i++) page(`[data-faq-page="${i}"]`, schedule.faqRead + i * 34, i + 1 === faqPageCount ? schedule.faqEnd : schedule.faqRead + 23 + i * 34)
}
export function syncDocumentAccessibility(scope: HTMLElement) {
  const broadcast = scope.querySelector<HTMLElement>('.desk-broadcast')
  if (broadcast) {
    const staticPath = !!scope.closest('.bunker-experience--reduced')
    const visible = staticPath || Number(gsap.getProperty(broadcast, 'opacity')) > .8
    broadcast.inert = !visible; broadcast.setAttribute('aria-hidden', String(!visible))
  }
  scope.querySelectorAll<HTMLElement>('.document-leaf').forEach(el => {
    if (scope.closest('.bunker-experience--simple') && !el.closest('.bunker-mobile-document')) return
    const visible = Number(gsap.getProperty(el, 'opacity')) > .8
    el.inert = !visible; el.setAttribute('aria-hidden', String(!visible))
  })
}
