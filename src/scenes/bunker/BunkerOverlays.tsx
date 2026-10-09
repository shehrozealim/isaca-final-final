import type { ReactNode } from 'react'
import { event } from '../../data/event'
import { bunkerChapters } from './bunkerChapters'
import { BunkerSeal } from './BunkerFinale'
function FactList({ entries, pending }: { entries: readonly unknown[]; pending: string }) {
  if (!entries.length) return pending ? <p className="bunker-pending">{pending}</p> : null
  return <ul className="bunker-facts">{entries.map((entry, i) => <li key={i}>{typeof entry === 'object' && entry !== null ? Object.entries(entry).map(([key, value]) => <p key={key}><span>{key}</span> {String(value)}</p>) : String(entry)}</li>)}</ul>
}
function FAQContent() {
  if (event.faq.length) return <FactList entries={event.faq} pending="" />
  return <div className="bunker-faq-entries">
    <details><summary>Where does the trail lead?</summary><p>{event.venue}, Vile Parle West, Mumbai.</p></details>
    <details><summary>When does the hunt begin?</summary><p>The date and schedule will be announced by DJS ISACA.</p></details>
    <details><summary>How do I join?</summary><p>{event.registrationUrl ? <a href={event.registrationUrl}>Register for THE HUNT</a> : 'Registration opens soon. The link will appear in the final dossier.'}</p></details>
  </div>
}
function Panel({ name, id, kicker, title, children, side = 'right' }: { name: string; id?: string; kicker: string; title: string; children: ReactNode; side?: string }) {
  return <article className={`bunker-panel bunker-panel--${side}`} data-panel={name} id={id} aria-labelledby={`bunker-${name}-title`}>
    {name === 'finale' && <div className="bunker-mobile-seal" aria-hidden="true"><BunkerSeal /></div>}
    <p className="bunker-eyebrow">{kicker}</p><h3 id={`bunker-${name}-title`}>{title}</h3>{children}
    <span className="bunker-panel-number" aria-hidden="true">DJS / ISACA / CASE 03</span>
  </article>
}
export default function BunkerOverlays({ navigate }: { navigate: (id: string) => void }) {
  return <>
    <div className="bunker-room-shade" aria-hidden="true" /><div className="bunker-chapter-wash" aria-hidden="true" />
    <div className="bunker-journal-shade" aria-hidden="true" /><div className="bunker-map-shade" aria-hidden="true" /><div id="bunker-canvas-slot" />
    <div className="bunker-cinematic-runway" aria-hidden="true" />
    <div className="bunker-mobile-document" data-readout="rules" aria-hidden="true"><p className="bunker-eyebrow">THE SEALED CASES</p><h3>Problem statements.</h3><p>The official cases will be released by DJS ISACA.</p><span className="bunker-ink-stamp">AWAITING DECLASSIFICATION</span></div>
    <div className="bunker-mobile-document" data-readout="prizes" aria-hidden="true"><p className="bunker-eyebrow">THE SEAL IS BROKEN</p><h3>Prize pool.</h3><p className="bunker-prize-value">To be announced</p><p>The official bounty will be announced by DJS ISACA.</p></div>
    <div className="bunker-mobile-document" data-readout="faq" aria-hidden="true"><p className="bunker-eyebrow">FROM THE ARCHIVE</p><h3>Unanswered questions.</h3><FAQContent /></div>
    <nav className="bunker-chapters" aria-label="Bunker chapters">{bunkerChapters.map((chapter, i) => <a key={chapter.id} href={`#${chapter.id}`} data-chapter={i} onClick={e => { e.preventDefault(); navigate(chapter.id) }}><span>0{i + 1}</span>{chapter.title}</a>)}</nav>
    <div className="bunker-panels">
      <Panel name="board" id="bunker-about" kicker="01 / THE DESTINATION" title="Follow the evidence.">
        <img className="bunker-static-map" src="/s03/map/djsce-investigation.svg" alt="Investigation map marking Dwarkadas J. Sanghvi College of Engineering in Vile Parle West" />
        <p className="bunker-lede">An investigation in ideas. A hackathon for the curious.</p>
        <p>Enter THE HUNT with DJS ISACA. Bring your questions, work together, and turn an idea into something you can put to the test.</p>
        <h4>Choose your trail</h4><FactList entries={event.tracks} pending="Tracks will be revealed in the next briefing." />
        <div className="bunker-destination"><span>THE DESTINATION / LOCATION CONFIRMED</span><strong>Dwarkadas J. Sanghvi<br />College of Engineering</strong><p>U-15, JVPD Scheme, Bhaktivedanta Swami Marg,<br />Vile Parle West, Mumbai 400056.</p><a href="https://www.google.com/maps/search/?api=1&amp;query=Dwarkadas+J.+Sanghvi+College+of+Engineering+Mumbai" target="_blank" rel="noreferrer">OPEN DIRECTIONS</a></div>
      </Panel>
      <Panel name="journal" id="bunker-details" kicker="02 / EVENT DETAILS" title="Your field briefing.">
        <p className="bunker-lede">Keep the essentials close.</p>
        <details className="bunker-reading-facts"><summary>Event essentials +</summary><dl className="bunker-details">{[['Date & time', event.dateTime], ['Duration', event.duration], ['Venue', event.venue], ['Team size', event.teamSize], ['Eligibility', event.eligibility]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></details>
      </Panel>
      <Panel name="rules" id="bunker-archive" kicker="THE SEALED CASES / FILE 04" title="Problem statements.">
        <FactList entries={event.problemStatements} pending="The official cases will be released by DJS ISACA." />
        <span className="bunker-ink-stamp">AWAITING DECLASSIFICATION</span>
        <details className="bunker-case-rules"><summary>Rules of the investigation +</summary><FactList entries={event.rules} pending="Official rules will be published with the problem statements." /></details>
      </Panel>
      <Panel name="prizes" id="bunker-prizes" kicker="THE SEAL IS BROKEN / REWARD DOSSIER" title="Prize pool." side="left">
        <p className="bunker-prize-value">{event.prizes.length ? 'The rewards await.' : 'To be announced'}</p>
        <FactList entries={event.prizes} pending="The official bounty will be announced by DJS ISACA." />
      </Panel>
      <Panel name="faq" id="bunker-faq" kicker="FROM THE ARCHIVE / FILE 06" title="Unanswered questions." side="left"><FAQContent /></Panel>
      <Panel name="radio" id="bunker-allies" kicker="05 / THE FREQUENCY" title="You’re not alone." side="left">
        <h4>The council / Judges</h4><FactList entries={event.judges} pending="Judge dossiers will be released soon." />
        <h4>Our allies / Sponsors</h4><FactList entries={event.sponsors} pending="Sponsor announcements are on their way." />
        <h4>Establish contact</h4><FactList entries={event.contacts} pending="Organizer contact details will be published here." /><FactList entries={event.socialLinks} pending="" />
      </Panel>
      <Panel name="finale" id="S10" kicker="06 / YOUR NEXT CASE" title="JOIN THE HUNT." side="center">
        <p className="bunker-lede">The evidence brought you here.<br />The next move is yours.</p>
        {event.registrationUrl ? <a className="bunker-join" href={event.registrationUrl}>REGISTER FOR THE HUNT</a> : <p className="bunker-registration-pending">REGISTRATION OPENS SOON</p>}
        <p className="bunker-margin-note">{event.title}</p><a className="bunker-revisit" href="#bunker-about" onClick={e => { e.preventDefault(); navigate('bunker-about') }}>Revisit the case files</a>
      </Panel>
    </div><div className="bunker-progress" aria-hidden="true"><span /></div>
  </>
}
