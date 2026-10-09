import { event } from '../../data/event'
import { registrationDestination } from '../../data/registration'

export default function DeskBroadcast() {
  return <aside className="desk-broadcast" aria-label="Registration broadcast" aria-hidden="true" inert>
    <img className="desk-broadcast-case" src="/s03/props/television.webp" alt="" />
    <div className="desk-broadcast-screen">
      <div className="crt-interference" aria-hidden="true" />
      <div className="crt-message"><p className="crt-channel">CH 03 / INCOMING TRANSMISSION</p><h3>JOIN<br />THE HUNT.</h3>
        <p>DJS ISACA / DJSCE, MUMBAI</p><p>{event.dateTime}<br />{event.teamSize === 'To be announced' ? 'Team details to be announced' : event.teamSize}</p>
        <a href={registrationDestination}>REGISTER FOR THE HUNT ↗</a>
        {!event.registrationUrl && <small>REGISTRATION OPENS SOON</small>}
      </div>
    </div>
  </aside>
}
