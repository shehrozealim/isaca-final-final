import { useSyncExternalStore } from 'react'
function useMedia(query: string) {
  return useSyncExternalStore(callback => {
    const media = window.matchMedia(query)
    media.addEventListener('change', callback)
    return () => media.removeEventListener('change', callback)
  }, () => window.matchMedia(query).matches, () => false)
}
export function usePreferences() {
  const mobile = useMedia("(max-width: 767px)")
  const systemReducedMotion = useMedia("(prefers-reduced-motion: reduce)")
  // A shareable reduced-effects path also makes the static composition reviewable.
  const reducedMotion = systemReducedMotion || new URLSearchParams(window.location.search).get('effects') === 'reduce'
  return { mobile, reducedMotion, simple: mobile || reducedMotion }
}
