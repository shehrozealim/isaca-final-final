import { siteContent } from '../../data/content'
import { deskSchedule } from './deskSchedule'
const positions = [32, 128, 168, deskSchedule.prizeTitle, deskSchedule.faqStart + 13, deskSchedule.broadcastStart + 12]
export const bunkerChapters = siteContent.chapters.map((chapter, i) => ({ ...chapter, at: positions[i] / deskSchedule.duration }))
