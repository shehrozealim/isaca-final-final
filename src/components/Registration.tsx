import { copy } from '../data/content'
import { event } from '../data/event'
import { useScrollState } from '../architecture/scrollContext'
import { registrationDestination } from '../data/registration'

export function RegistrationShortcut() {
  const { state } = useScrollState()
  if (state.active.id === 'S00') return null
  return <a className="registration-shortcut" href={registrationDestination}><span aria-hidden="true">↗</span> {copy("REGISTER")} <small>{copy("THE HUNT")}</small></a>
}

export function RegistrationPage() {
  return <main className="registration-page"><p className="bunker-eyebrow">{copy("DJS ISACA / THE HUNT")}</p><h1>{copy("Your next case.")}</h1>
    <p>{copy("Build with the curious. Investigate together.")}</p>
    <dl>{[[copy("Venue"), event.venue], [copy("Date & time"), event.dateTime], [copy("Duration"), event.duration], [copy("Team size"), event.teamSize], [copy("Eligibility"), event.eligibility]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    {event.registrationUrl ? <a className="bunker-join" href={event.registrationUrl}>{copy("REGISTER FOR THE HUNT \u2197")}</a> : <p className="bunker-registration-pending">{copy("REGISTRATION OPENS SOON")}</p>}
    <a className="bunker-revisit" href="/">{copy("Return to the investigation")}</a>
  </main>
}
