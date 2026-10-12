let preparation: Promise<string> | undefined

/** Download the short film once, before scroll seeking can request late ranges. */
export function prepareIntroMedia() {
  if (preparation) return preparation
  const mobile = window.matchMedia('(max-width: 1024px)').matches
  preparation = fetch(`/media/intro-scroll${mobile ? '-mobile' : ''}.mp4`, { cache: 'force-cache' })
    .then(response => {
      if (!response.ok) throw new Error('Intro film unavailable')
      return response.blob()
    })
    .then(blob => URL.createObjectURL(blob))
    .catch(error => { preparation = undefined; throw error })
  return preparation
}
