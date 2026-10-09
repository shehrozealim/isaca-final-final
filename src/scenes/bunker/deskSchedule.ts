import { event } from '../../data/event'
export const casePageCount = Math.max(1, event.problemStatements.length)
export const faqPageCount = Math.max(1, Math.ceil(event.faq.length / 3))
const caseEnd = 220 + (casePageCount - 1) * 34
const prizeStart = caseEnd + 12, prizeEnd = prizeStart + 58
const faqStart = prizeEnd + 6, faqRead = faqStart + 36
const faqEnd = faqRead + 26 + (faqPageCount - 1) * 34
export const deskSchedule = { caseEnd, prizeStart, prizeRead: prizeStart + 34, prizeEnd, faqStart, faqRead, faqEnd, finaleStart: faqEnd + 12, duration: faqEnd + 26, mobileDuration: faqEnd + 11 }
