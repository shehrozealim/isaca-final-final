import { siteContent } from './content'
export const event = siteContent.event as Omit<typeof siteContent.event, 'problemStatements' | 'tracks' | 'prizes' | 'schedule' | 'rules'> & {
  problemStatements: { title: string; description: string; objective?: string; deliverables?: string[] }[]
  tracks: string[]; prizes: { place: string; amount: string }[]; schedule: string[]; rules: string[]
}
