import ScrollIntro from './scroll-intro/ScrollIntro'
import BunkerExperience from '../scenes/bunker/BunkerExperience'
export default function Story() {
  return <main id="scroll-story" tabIndex={-1}><ScrollIntro /><BunkerExperience /></main>
}
