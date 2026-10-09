import { copy, formatCopy } from '../../data/content'
import { CanvasTexture, SRGBColorSpace } from 'three'
import { EVIDENCE_ATLAS, paintEvidencePhoto, paintEvidenceSpread } from './EvidencePhotos.mjs'

/** One supplied-derived parchment across every physical page, with crisp ink. */
export function createAncientPaper(draw: (x: CanvasRenderingContext2D, w: number, h: number) => void, redraw: () => void, study = false, variant = 0) {
  const canvas = document.createElement('canvas'); canvas.width = 1536; canvas.height = 2048
  const x = canvas.getContext('2d')!, texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace; texture.anisotropy = 8
  const image = new Image(), symbols = new Image()
  const paint = () => {
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, canvas.width, canvas.height)
    x.fillStyle = '#e5cd9e'; x.fillRect(0, 0, canvas.width, canvas.height)
    if (image.complete && image.naturalWidth) x.drawImage(image, 0, 0, canvas.width, canvas.height)
    draw(x, canvas.width, canvas.height)
    if (symbols.complete && symbols.naturalWidth) {
      if (study) paintEvidenceSpread(x, symbols, canvas.width, canvas.height, variant)
      else {
        paintEvidencePhoto(x, symbols, variant, canvas.width * .12, canvas.height * .82, canvas.width * .25, canvas.height * .10, -.035)
        paintEvidencePhoto(x, symbols, variant + 3, canvas.width * .62, canvas.height * .82, canvas.width * .25, canvas.height * .10, .035)
      }

    }
    texture.needsUpdate = true; redraw()
  }
  symbols.onload = paint; symbols.src = EVIDENCE_ATLAS
  image.onload = paint; image.src = '/s03/textures/ancient-paper.webp'; paint()
  const ready = Promise.all([image.decode(), symbols.decode()]).then(() => { paint() })
  return { texture, ready, dispose: () => { image.onload = null; symbols.onload = null; texture.dispose() } }
}

export function drawArtifactInk(x: CanvasRenderingContext2D, w: number, h: number, kind: 'cases' | 'bounty' | 'leaf' | 'faq' | 'study', index = 0) {
  x.strokeStyle = '#78553266'; x.lineWidth = 1.5; x.strokeRect(w * .065, h * .055, w * .87, h * .89)
  x.fillStyle = '#60462e'; x.font = '18px monospace'; x.fillText(copy("DJS ISACA / THE HUNT"), w * .11, h * .095)
  x.textAlign = 'right'; x.fillText(formatCopy('EXHIBIT / {number}', { number: String(index + 1).padStart(2, '0') }), w * .89, h * .095); x.textAlign = 'left'
  // Etched thorn borders and diagonal witness marks fill the perimeter, not the text.
  x.save(); x.strokeStyle = '#57362288'; x.lineWidth = 1.7
  for (const side of [.075, .925]) {
    for (let i = 0; i < 29; i++) {
      const y = h * (.14 + i * .025), px = w * side, direction = side < .5 ? 1 : -1
      x.beginPath(); x.moveTo(px, y); x.quadraticCurveTo(px + direction * 12, y + 13, px, y + 27); x.lineTo(px + direction * 15, y + 18); x.stroke()
    }
  }
  for (let i = 0; i < 9; i++) { const px = w * (.17 + i * .081); x.beginPath(); x.moveTo(px - 7, h * .13); x.lineTo(px + 7, h * .145); x.moveTo(px + 7, h * .13); x.lineTo(px - 7, h * .145); x.stroke() }
  x.restore()
  // Ink motifs stay outside the semantic reading column.
  x.save(); x.translate(w * .17, h * .78); x.rotate(-.09); x.fillStyle = '#75433499'; x.font = 'italic 21px Georgia'; x.fillText(copy("Leave nothing unexplained."), 0, 0); x.restore()
  if (kind === 'study') {
    x.save(); x.textAlign = 'center'; x.fillStyle = '#473524'; x.font = 'italic 48px Georgia'
    x.fillText(copy('FIELD OBSERVATIONS'), w * .5, h * .125)
    x.font = 'italic 27px Georgia'; x.fillText(copy('No witness stands alone.'), w * .5, h * .89); x.restore()
  }
  x.font = '16px monospace'; x.textAlign = 'center'; x.fillStyle = '#76573c'; x.fillText(kind === 'faq' ? copy("THE UNANSWERED FILES / RESEARCH NOTES") : kind === 'cases' ? copy("CHALLENGE BRIEFING / KEEP THIS FILE CLOSE") : copy("REWARD DOSSIER / BREAK THE SEAL"), w * .5, h * .93)
  x.textAlign = 'left'
}
