import { CanvasTexture, SRGBColorSpace } from 'three'
import { copy } from '../../data/content'
import { event } from '../../data/event'

/** Ink and typography share the actual parchment surface, never a floating overlay. */
export function createPrizePaper(index: number, redraw: () => void) {
  const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 2048
  const x = canvas.getContext('2d')!, texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace; texture.anisotropy = 8
  const paper = new Image(), trophy = new Image()
  const award = event.prizes[index] ?? { place: copy(['First place', 'Second place', 'Third place'][index]), amount: copy('To be announced') }
  const paint = () => {
    x.clearRect(0, 0, 1536, 2048); x.fillStyle = '#dfc89b'; x.fillRect(0, 0, 1536, 2048)
    if (paper.naturalWidth) x.drawImage(paper, 0, 0, 1536, 2048)
    x.strokeStyle = '#70523677'; x.lineWidth = 3; x.strokeRect(100, 108, 1336, 1832)
    x.textAlign = 'center'; x.fillStyle = '#493521'
    const fit = (text: string, size: number, y: number, width = 1200) => {
      do { x.font = `${size--}px Georgia` } while (x.measureText(text).width > width && size > 28)
      x.fillText(text, 768, y)
    }
    x.font = '30px monospace'; x.fillText(copy('DJS ISACA / THE HUNT'), 768, 195)
    fit(copy('Prize pool.'), 82, 315)
    fit(award.place, 104, 470)
    if (trophy.naturalWidth) {
      x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = .86
      // White source paper disappears into the parchment; the original pen marks remain.
      const scale = Math.min(740 / trophy.naturalWidth, 922 / trophy.naturalHeight)
      const w = trophy.naturalWidth * scale, h = trophy.naturalHeight * scale
      x.drawImage(trophy, 768 - w / 2, 600 + (922 - h) / 2, w, h)
      x.globalAlpha = .035; x.drawImage(trophy, 770 - w / 2, 603 + (922 - h) / 2, w, h); x.restore()
      // Small graphite transfer marks stay outside the lettering and trophy silhouette.
      x.save(); x.strokeStyle = '#59442b30'; x.lineWidth = 2
      for (let i = 0; i < 12; i++) { const y = 690 + i * 61; x.beginPath(); x.moveTo(230, y); x.lineTo(265 + (i % 3) * 11, y + 8); x.stroke() }
      x.restore()
    }
    fit(award.amount, 148, 1740)
    x.font = '28px monospace'; x.fillStyle = '#70523b'; x.fillText(copy('SAMPLE BOUNTY / FOR PREVIEW ONLY'), 768, 1865)
    texture.needsUpdate = true; redraw()
  }
  paper.onload = trophy.onload = paint
  paper.src = '/s03/textures/ancient-paper.webp'; trophy.src = `/s03/props/3d/trophy-${index + 1}.webp`; paint()
  const ready = Promise.all([paper.decode(), trophy.decode(), document.fonts.ready]).then(paint)
  return { texture, ready, dispose() { paper.onload = trophy.onload = null; texture.dispose() } }
}
