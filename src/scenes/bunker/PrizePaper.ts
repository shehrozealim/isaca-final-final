import { paintSuppliedArt, prepareSuppliedArt } from './SuppliedPageArt'
import { ensurePageFonts, preparePageInk } from './PageTypography'
import { CanvasTexture, SRGBColorSpace } from 'three'
import { copy } from '../../data/content'
import { event } from '../../data/event'

/** Ink and typography share the actual parchment surface, never a floating overlay. */
export function createPrizePaper(index: number, redraw: () => void) {
  const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 2048
  const x = canvas.getContext('2d')!, texture = new CanvasTexture(canvas)
  preparePageInk(x)
  texture.colorSpace = SRGBColorSpace; texture.anisotropy = 8
  const paper = new Image(), trophy = new Image()
  let disposed = false
  const titlePage = index < 0
  const award = event.prizes[index] ?? { place: copy(['First place', 'Second place', 'Third place'][index]), amount: copy('To be announced') }
  const paint = () => {
    if (disposed) return
    x.clearRect(0, 0, 1536, 2048); x.fillStyle = '#dfc89b'; x.fillRect(0, 0, 1536, 2048)
    if (paper.naturalWidth) x.drawImage(paper, 0, 0, 1536, 2048)
    x.strokeStyle = '#70523677'; x.lineWidth = 3; x.strokeRect(100, 108, 1336, 1832)
    x.textAlign = 'center'; x.fillStyle = '#493521'
    const fit = (text: string, size: number, y: number, width = 1200) => {
      do { x.font = `${index < 0 ? 400 : 700} ${size--}px "${index < 0 ? 'Event Horror' : 'Page Serif'}"` } while (x.measureText(text).width > width && size > 28)
      x.fillText(text, 768, y)
    }
    x.font = '30px "Page Antique"'; x.fillText(copy('DJS ISACA / THE HUNT'), 768, 195)
    if (index === -2) {
      x.strokeStyle='#79503633';x.lineWidth=2
      paintSuppliedArt(x,'symbols-1-3',230,400,1076,1260)
      texture.needsUpdate=true;redraw();return
    }
    if (titlePage) {
      x.strokeStyle='#79503688';x.lineWidth=3
      x.beginPath();x.moveTo(350,780);x.lineTo(1186,780);x.moveTo(350,1220);x.lineTo(1186,1220);x.stroke()
      paintSuppliedArt(x,'symbols-1-2',400,280,736,490)
      fit(copy('Prize Pool'),180,1060)
      paintSuppliedArt(x,'symbols-2-4',490,1430,556,225)
      x.font='40px "Page Antique"';x.fillText(copy('The rewards await.'),768,1380)
      x.font='30px "Page Antique"';x.fillText(copy('Break the seal. Turn the page.'),768,1700)
      texture.needsUpdate=true;redraw();return
    }
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
    x.font = '28px "Page Antique"'; x.fillStyle = '#70523b'; x.fillText(copy('SAMPLE BOUNTY / FOR PREVIEW ONLY'), 768, 1865)
    texture.needsUpdate = true; redraw()
  }
  paper.src = '/s03/textures/ancient-paper.webp'; if (!titlePage) trophy.src = `/s03/props/3d/trophy-${index + 1}.webp`; paint()
  const ready = Promise.all([ensurePageFonts(), prepareSuppliedArt(), paper.decode(), titlePage ? Promise.resolve() : trophy.decode()]).then(paint)
  return { texture, ready, dispose() { disposed=true;texture.dispose() } }
}
