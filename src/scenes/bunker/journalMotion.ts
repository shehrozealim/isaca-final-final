// GSAP owns scroll choreography; the shared canvas reads without React renders.
export const journalMotion: { progress: number; opacity: number; draw?: () => void } = { progress: 0, opacity: 0 }
export const deskMotion = { opacity: 0, approach: 0, mapLift: 0, route: 0, prize: 0, prizeOpacity: 0, drift: 0, mapFocus: 0,
  mapSettle: 0, folderOpacity: 0, folder: 0, folderPage: 0, faqOpacity: 0, faq: 0 }
export function resetDeskMotion() { Object.keys(deskMotion).forEach(key => { deskMotion[key as keyof typeof deskMotion] = 0 }) }
