import { event } from '../../data/event'
export const casePageCount = Math.max(1, event.problemStatements.length)
export const faqPageCount = Math.max(1, Math.ceil(event.faq.length / 3))
const caseEnd = 220 + (casePageCount - 1) * 34
const prizeStart = caseEnd + 12, prizeEnd = prizeStart + 58
const faqStart = prizeEnd + 6, faqRead = faqStart + 36
const faqEnd = faqRead + 26 + (faqPageCount - 1) * 34
export const deskSchedule = { caseEnd, prizeStart, prizeRead: prizeStart + 34, prizeEnd, faqStart, faqRead, faqEnd, broadcastStart: faqEnd + 8, roomReturn: faqEnd + 34, finaleStart: faqEnd + 48, duration: faqEnd + 62, mobileDuration: faqEnd + 62 }
