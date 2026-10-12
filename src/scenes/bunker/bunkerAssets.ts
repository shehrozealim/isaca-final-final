import { prepareSuppliedArt } from './SuppliedPageArt'
import { useSyncExternalStore } from 'react'
import { BUNKER_IMAGE } from '../../components/bunker/bunkerBackgroundState'
import { createSponsorSource } from './SponsorArtwork'
const listeners = new Set<() => void>()
let state = { loaded: 0, total: 1, ready: false, error: false }
let preparation: Promise<void> | undefined
const maps = { landscape: '', portrait: '' }
const update = (next: Partial<typeof state>) => { state = { ...state, ...next }; for (const listener of listeners) listener() }
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } }
export const useBunkerAssets = () => useSyncExternalStore(subscribe, () => state)
export const getMapSource = (portrait = false) => maps[portrait ? 'portrait' : 'landscape']
const decode = async (src: string) => { const image = new Image(); image.src = src; await image.decode(); update({ loaded: state.loaded + 1 }) }
export function prepareBunkerAssets(retry = false): Promise<void> {
  if (preparation && !retry) return preparation
  update({ loaded: 0, error: false, ready: false })
  const images = [BUNKER_IMAGE,
    ...['timeline-sticker.avif','gothic-cover.webp','ancient-paper.webp','ancient-folder.webp','ancient-wax.webp','desk-wood-real.webp','bunker-table-cleared.webp'].map(name => '/s03/textures/' + name),
    '/s03/board/case-board.webp', ...['television'].map(name => `/s03/props/${name}.webp`)]
  update({ total: images.length + 3 })
  preparation = Promise.all([
    ...images.map(decode),
    prepareSuppliedArt(),
    ...(['landscape', 'portrait'] as const).map(async name => {
      if (maps[name]) URL.revokeObjectURL(maps[name])
      maps[name] = await createSponsorSource(name === 'portrait')
      await decode(maps[name])
    }),
    document.fonts.ready.then(() => update({ loaded: state.loaded + 1 })),
  ]).then(() => { update({ ready: true }) }).catch((error: unknown) => { update({ error: true }); preparation = undefined; throw error })
  return preparation
}
let finishRender: (success: boolean) => void = () => {}
const rendered = new Promise<boolean>(resolve => { finishRender = resolve })
export const signalBunkerRenderReady = (success = true) => finishRender(success)
export const waitForBunkerRender = () => rendered

