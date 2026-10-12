import { siteContent } from '../../data/content'
import { ensurePageFonts, preparePageInk } from './PageTypography'

let paperReady: Promise<HTMLImageElement> | undefined
export async function createSponsorSource(portrait: boolean) {
  paperReady ??= (async () => {
    const image = new Image(); image.src = '/s03/textures/ancient-paper.webp'
    await image.decode(); return image
  })()
  const [paper, , logos] = await Promise.all([paperReady, ensurePageFonts(), Promise.all(siteContent.sponsors.partners.map(async partner => { const image = new Image(); image.src = partner.logo; await image.decode(); return image }))])
  const canvas = document.createElement('canvas')
  const w = canvas.width = portrait ? 1000 : 1600
  const h = canvas.height = portrait ? 1400 : 1000
  const x = canvas.getContext('2d')!
  x.drawImage(paper, 0, 0, w, h)
  preparePageInk(x)
  x.strokeStyle = '#6f322b65'; x.lineWidth = 2
  x.strokeRect(w * .055, h * .055, w * .89, h * .89)
  x.textAlign = 'center'; x.fillStyle = '#43251b'
  x.font = `${portrait ? 50 : 66}px "Page Serif"`
  x.fillText(siteContent.sponsors.heading, w / 2, h * .14)
  x.font = `${portrait ? 24 : 25}px "Page Antique"`
  x.fillText(siteContent.sponsors.tagline, w / 2, h * .19)

  const cellW = w * .40, cellH = h * .29
  siteContent.sponsors.partners.forEach((partner, i) => {
    const cx = w * (i % 2 ? .72 : .28), cy = h * (.365 + Math.floor(i / 2) * .34)
    x.save(); x.translate(cx, cy); x.rotate(i % 2 ? .012 : -.015)
    x.globalCompositeOperation = 'multiply'; x.globalAlpha = .86
    const radius = Math.min(cellW * .16, cellH * .22)
    x.drawImage(logos[i], -radius, -cellH * .12-radius, radius*2, radius*2)
    let size = portrait ? 45 : 52
    do { x.font = `700 ${size--}px "Page Serif"` } while (x.measureText(partner.name).width > cellW * .94 && size > 24)
    x.fillText(partner.name, 0, cellH * .30)
    x.font = `${portrait ? 32 : 30}px "Page Antique"`; x.fillText(partner.category, 0, cellH * .46)
    x.font = `italic ${portrait ? 28 : 26}px "Page Antique"`; x.fillText(partner.motto, 0, cellH * .62)
    // Tiny pigment losses give the logos a printed, worn surface rather than a sticker edge.
    x.globalCompositeOperation = 'source-over'; x.fillStyle = '#dec697'; x.globalAlpha = .28
    for (let n = 0; n < 100; n++) {
      const px = Math.sin(n * 37 + i) * radius, py = Math.cos(n * 19 + i) * radius - cellH * .12
      x.fillRect(px, py, 1.5, 1)
    }
    x.restore()
  })
  x.fillStyle = '#743d2b'; x.font = `${portrait ? 28 : 26}px "Page Antique"`
  x.fillText(siteContent.sponsors.note, w / 2, h * .925)
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Sponsor artwork unavailable')), 'image/webp', .92))
  return URL.createObjectURL(blob)
}
