import { copy, siteContent } from '../../data/content'
import { event } from '../../data/event'
import { registrationDestination } from '../../data/registration'

export default function DeskBroadcast() {
  return <aside className="desk-broadcast" id="bunker-broadcast" aria-label={copy("Event broadcast")} aria-hidden="true" inert>
    <img className="desk-broadcast-case" src="/s03/props/television.webp" alt="" />
    <div className="desk-broadcast-screen">
      <div className="crt-interference" aria-hidden="true" />
      <div className="crt-message"><p className="crt-channel">{copy('CH 03 / INCOMING TRANSMISSION')}</p><h3>{event.title}</h3>
        <p>{event.title}</p><p>{event.venue}</p><p>{event.dateTime}<br />{event.teamSize === 'To be announced' ? copy('Team details to be announced') : event.teamSize}</p>
        <address className="crt-contact"><h4>{siteContent.contact.heading}</h4><a className="crt-email" href={`mailto:${siteContent.contact.email}`}>{siteContent.contact.email}</a><span>{siteContent.contact.instagram}</span><small>{siteContent.contact.note}</small></address>
        <a className="crt-register" href={registrationDestination}>{copy('REGISTER FOR THE HUNT ↗')}</a>
        {!event.registrationUrl && <small>{copy('REGISTRATION OPENS SOON')}</small>}
      </div>
    </div>
  </aside>
}
