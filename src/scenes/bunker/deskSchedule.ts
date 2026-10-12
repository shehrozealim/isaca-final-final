import { event } from '../../data/event'
export const casePageCount = Math.max(1, event.problemStatements.length)
export const faqPageCount = Math.max(1, Math.ceil(event.faq.length / 3))
export const caseStride = 24
export const caseRead = 184
const caseEnd = caseRead + 23 + (casePageCount - 1) * caseStride
const prizeStart = caseEnd + 12, prizeEnd = prizeStart + 76
const faqStart = prizeEnd + 6, faqRead = faqStart + 36
const faqEnd = faqRead + 26 + (faqPageCount - 1) * 34
export const deskSchedule = { caseEnd, prizeStart, prizeTitle: prizeStart + 18, prizeRead: prizeStart + 52, prizeEnd, faqStart, faqRead, faqEnd, broadcastStart: faqEnd + 8, roomReturn: faqEnd + 34, duration: faqEnd + 34, mobileDuration: faqEnd + 34 }
