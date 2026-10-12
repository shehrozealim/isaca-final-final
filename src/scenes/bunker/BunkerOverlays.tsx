import { copy } from '../../data/content'
import { getMapSource, useBunkerAssets } from './bunkerAssets'
import { deskSchedule } from './deskSchedule'
import { siteContent } from '../../data/content'
import type { ReactNode } from 'react'
import { event } from '../../data/event'
import { bunkerChapters } from './bunkerChapters'
import DeskBroadcast from './DeskBroadcast'
import { usePreferences } from '../../architecture/preferences'
function FactList({ entries, pending }: { entries: readonly unknown[]; pending: string }) {
  if (!entries.length) return pending ? <p className="bunker-pending">{pending}</p> : null
  return <ul className="bunker-facts">{entries.map((entry, i) => <li key={i}>{typeof entry === 'object' && entry !== null ? Object.entries(entry).map(([key, value]) => <p key={key}><span>{key}</span> {String(value)}</p>) : String(entry)}</li>)}</ul>
}
function CasePages() {
  const count = Math.max(1, event.problemStatements.length)
  return <>
    <div className="document-leaf document-cover" data-case-cover><h3>{copy("Problem statements.")}</h3><p>{copy("The sealed cases.")}</p><span className="bunker-ink-stamp">{copy("CHALLENGE DOSSIER")}</span></div>
    {Array.from({ length: count }, (_, index) => <div className="document-leaf" data-case-page={index} key={index}>
      <p className="bunker-eyebrow">{copy("CASE BRIEFING")}</p>
      {event.problemStatements.length ? event.problemStatements.slice(index, index + 1).map(statement => <section className="printed-answer case-brief" key={statement.title}><h4>{statement.title}</h4><p>{statement.description}</p>{statement.objective && <><h5>{copy('The objective')}</h5><p>{statement.objective}</p></>}{statement.deliverables && <><h5>{copy('Bring back evidence')}</h5><ul>{statement.deliverables.map(item => <li key={item}>{item}</li>)}</ul></>}</section>) : <><h3>{copy("The cases are still sealed.")}</h3><p>{copy("The official cases will be released by DJS ISACA.")}</p><span className="bunker-ink-stamp">{copy("AWAITING DECLASSIFICATION")}</span></>}
      <p className="bunker-document-rules">{copy("Official rules will be published with the problem statements.")}</p>
      <FactList entries={event.rules} pending={""} />
    </div>)}
  </>
}
function PrizePlacements() {
  return <><dl className="prize-placements">{event.prizes.map(prize => <div key={prize.place}><dt>{prize.place}</dt><dd>{prize.amount}</dd></div>)}</dl><p className="prize-sample-note">{copy('SAMPLE BOUNTY / FOR PREVIEW ONLY')}</p></>
}
function FAQPages() {
  const count = Math.max(1, Math.ceil(event.faq.length / 3))
  return <>
    <div className="document-leaf document-cover" data-faq-cover><p className="bunker-eyebrow">{copy("FROM THE ARCHIVE")}</p><h3>{copy("FAQ")}</h3><p>{copy("The unanswered files.")}</p></div>
    {Array.from({ length: count }, (_, index) => <div className="document-leaf" data-faq-page={index} key={index}>
      <p className="bunker-eyebrow">{copy("QUESTIONS &amp; ANSWERS")}</p>
      {event.faq.slice(index * 3, index * 3 + 3).map(entry => <section className="printed-answer" key={entry.question}><h4>{entry.question}</h4><p>{entry.answer}</p></section>)}
    </div>)}
  </>
}
function Panel({ name, id, kicker, title, children, side = 'right' }: { name: string; id?: string; kicker: string; title: string; children: ReactNode; side?: string }) {
  return <article className={`bunker-panel bunker-panel--${side}`} data-panel={name} id={id} aria-labelledby={`bunker-${name}-title`}>
    <p className="bunker-eyebrow">{kicker}</p><h3 id={`bunker-${name}-title`} className={name === 'rules' || name === 'faq' ? 'bunker-accessible-title' : undefined}>{title}</h3>{children}
    <span className="bunker-panel-number" aria-hidden="true">{copy("DJS / ISACA / CASE 03")}</span>
  </article>
}
export default function BunkerOverlays({ navigate }: { navigate: (id: string) => void }) {
  useBunkerAssets()
  const { mobile } = usePreferences()
  return <>
    <div className="bunker-room-shade" aria-hidden="true" /><div className="bunker-chapter-wash" aria-hidden="true" />
    <div className="bunker-journal-shade" aria-hidden="true" /><div className="bunker-map-shade" aria-hidden="true" /><div id="bunker-canvas-slot" />
    <div className="bunker-cinematic-runway" style={{ height: `${deskSchedule.mobileDuration * 5.76}svh` }} aria-hidden="true" />
    <div className="bunker-mobile-document" data-readout="rules" aria-hidden="true"><CasePages /></div>
    <div className="bunker-mobile-document" data-readout="prizes" aria-hidden="true"><p className="bunker-eyebrow">{copy("THE SEAL IS BROKEN")}</p><h3>{copy("Prize pool.")}</h3><p className="bunker-prize-value">{siteContent.journal.prizePool}</p><PrizePlacements /></div>
    <div className="bunker-mobile-document" data-readout="faq" aria-hidden="true"><FAQPages /></div>
    <nav className="bunker-chapters" aria-label={copy("Bunker chapters")}>{bunkerChapters.map((chapter, i) => <a key={chapter.id} href={`#${chapter.id}`} data-chapter={i} onClick={e => { e.preventDefault(); navigate(chapter.id) }}><span>{copy("0")}{i + 1}</span>{chapter.title}</a>)}</nav>
    <div className="bunker-panels">
      <Panel name="board" id="bunker-about" kicker={siteContent.sponsors.eyebrow} title={siteContent.sponsors.heading}>
        <img className="bunker-static-map" src={getMapSource(mobile) || undefined} alt="" aria-hidden="true" />
        <div className="sponsor-transcript"><p>{siteContent.sponsors.tagline}</p><ul>{siteContent.sponsors.partners.map(partner => <li key={partner.name}>{partner.name}</li>)}</ul></div>
      </Panel>
      <Panel name="journal" id="bunker-details" kicker={copy("02 / EVENT DETAILS")} title={copy("Your field briefing.")}>
        <p className="bunker-lede">{copy("Keep the essentials close.")}</p>
        <details className="bunker-reading-facts"><summary>{copy("Event essentials +")}</summary><dl className="bunker-details">{[[copy("Date & time"), event.dateTime], [copy("Duration"), event.duration], [copy("Venue"), event.venue], [copy("Team size"), event.teamSize], [copy("Eligibility"), event.eligibility]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></details>
      </Panel>
      <Panel name="rules" id="bunker-archive" kicker={copy("THE SEALED CASES / FILE 04")} title={copy("Problem statements.")}><CasePages /></Panel>
      <Panel name="prizes" id="bunker-prizes" kicker={copy("THE SEAL IS BROKEN / REWARD DOSSIER")} title={copy("Prize pool.")} side="left">
        <p className="bunker-prize-value">{siteContent.journal.prizePool}</p>
        <PrizePlacements />
      </Panel>
      <Panel name="faq" id="bunker-faq" kicker={copy("FROM THE ARCHIVE / FILE 06")} title={copy("FAQ")} side="left"><FAQPages /></Panel>

    </div><DeskBroadcast /><div className="bunker-progress" aria-hidden="true"><span /></div>
  </>
}
