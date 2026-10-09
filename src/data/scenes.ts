import { siteContent } from './content'
export const scenes = [
  { id: 'S00', ...siteContent.scenes[0], start: 0, end: .08 },
  { id: 'S01', ...siteContent.scenes[1], start: .08, end: .23 },
  { id: 'S02', ...siteContent.scenes[2], start: .23, end: .34 },
  { id: 'S03', ...siteContent.scenes[3], start: .34, end: 1 },
] as const
export type Scene = typeof scenes[number]
export const clamp = (value: number) => Math.min(1, Math.max(0, value))
export const localProgress = (progress: number, scene: Scene) => clamp((progress - scene.start) / (scene.end - scene.start))
export function getScrollState(progress: number) {
  const global = clamp(progress)
  const index = scenes.findIndex(scene => global < scene.end)
  const active = scenes[index < 0 ? scenes.length - 1 : index]
  return { global, active, local: localProgress(global, active) }
}
