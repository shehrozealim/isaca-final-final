import { event } from '../data/event'
import { useScrollState } from '../architecture/scrollContext'
import { registrationDestination } from '../data/registration'

export function RegistrationShortcut() {
  const { state } = useScrollState()
  if (state.active.id === 'S00') return null
  return <a className="registration-shortcut" href={registrationDestination}><span aria-hidden="true">↗</span> REGISTER <small>THE HUNT</small></a>
}

export function RegistrationPage() {
  return <main className="registration-page"><p className="bunker-eyebrow">DJS ISACA / THE HUNT</p><h1>Your next case.</h1>
    <p>Build with the curious. Investigate together.</p>
    <dl>{[['Venue', event.venue], ['Date & time', event.dateTime], ['Duration', event.duration], ['Team size', event.teamSize], ['Eligibility', event.eligibility]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {event.registrationUrl ? <a className="bunker-join" href={event.registrationUrl}>REGISTER FOR THE HUNT ↗</a> : <p className="bunker-registration-pending">REGISTRATION OPENS SOON</p>}
    <a className="bunker-revisit" href="/">Return to the investigation</a>
  </main>
}
