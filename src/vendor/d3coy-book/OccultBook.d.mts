import type { Group, PerspectiveCamera, Vector3 } from 'three'
export interface JournalEvent {
  name: string; organizer: string; about: string[]; timelineStatus: string
  timeline: { time: string; title: string; detail: string }[]
  domainsStatus: string; domains: { title: string; detail: string }[]
  prizePool: string; venue: string; date: string; duration: string
  registrationUrl: string; registrationLabel: string
}
export function createOccultBook(options: { pageCount?: number; event: JournalEvent; onTextureReady?: () => void }): {
  group: Group; ready: Promise<void>; setView(camera: PerspectiveCamera): void
  setRestPose(center: Vector3, scale: number, mobile: boolean): void
  setProgress(value: number): void; setClosing(value: number): void; update(delta: number): void; dispose(): void
}
