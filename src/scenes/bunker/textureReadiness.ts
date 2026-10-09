import { DefaultLoadingManager } from 'three'

let loading = false
const waiting = new Set<() => void>()
DefaultLoadingManager.onStart = () => { loading = true }
DefaultLoadingManager.onLoad = () => { loading = false; waiting.forEach(resolve => resolve()); waiting.clear() }
/** TextureLoader's actual GPU-source images, in addition to the decoded preload cache. */
export function waitForThreeTextures() {
  return loading ? new Promise<void>(resolve => waiting.add(resolve)) : Promise.resolve()
}
