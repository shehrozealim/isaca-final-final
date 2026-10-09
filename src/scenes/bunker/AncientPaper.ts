import { CanvasTexture, SRGBColorSpace } from 'three'

/** One supplied-derived parchment across every physical page, with crisp ink. */
export function createAncientPaper(draw: (x: CanvasRenderingContext2D, w: number, h: number) => void, redraw: () => void) {
  const canvas = document.createElement('canvas'); canvas.width = 1152; canvas.height = 1536
  const x = canvas.getContext('2d')!, texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4
  const image = new Image()
  const paint = () => {
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, canvas.width, canvas.height)
    x.fillStyle = '#e5cd9e'; x.fillRect(0, 0, canvas.width, canvas.height)
    if (image.complete && image.naturalWidth) x.drawImage(image, 0, 0, canvas.width, canvas.height)
    draw(x, canvas.width, canvas.height); texture.needsUpdate = true; redraw()
  }
  image.onload = paint; image.src = '/s03/textures/ancient-paper.webp'; paint()
  return { texture, dispose: () => { image.onload = null; texture.dispose() } }
}

export function drawArtifactInk(x: CanvasRenderingContext2D, w: number, h: number, kind: 'cases' | 'bounty' | 'leaf' | 'faq', index = 0) {
  x.strokeStyle = '#78553266'; x.lineWidth = 1.5; x.strokeRect(w * .065, h * .055, w * .87, h * .89)
  x.fillStyle = '#60462e'; x.font = '18px monospace'; x.fillText('DJS ISACA / THE HUNT', w * .11, h * .095)
  x.textAlign = 'right'; x.fillText(`EXHIBIT / 0${index + 1}`, w * .89, h * .095); x.textAlign = 'left'
  // Ink motifs stay outside the semantic reading column.
  x.save(); x.translate(w * .83, h * .865); x.strokeStyle = '#54402b77'; x.lineWidth = 2
  for (const r of [34, 46, 60]) { x.beginPath(); x.arc(0, 0, r, 0, Math.PI * 2); x.stroke() }
  x.beginPath(); for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * 4 * Math.PI / 5; const px = Math.cos(a) * 42, py = Math.sin(a) * 42; if (i) x.lineTo(px, py); else x.moveTo(px, py) } x.stroke(); x.restore()
  x.save(); x.translate(w * .17, h * .87); x.rotate(-.09); x.fillStyle = '#75433499'; x.font = 'italic 21px Georgia'; x.fillText('Leave nothing unexplained.', 0, 0); x.restore()
  // A faint, original thorn-and-eye study belongs to the margin of each dossier.
  if (kind !== 'leaf') {
    x.save(); x.translate(w * .18, h * .74); x.rotate(-.12); x.strokeStyle = '#623d2866'; x.lineWidth = 2
    x.beginPath(); x.moveTo(-42, 0); x.quadraticCurveTo(0, -34, 42, 0); x.quadraticCurveTo(0, 34, -42, 0); x.stroke()
    x.beginPath(); x.arc(0, 0, 13, 0, Math.PI * 2); x.stroke()
    for (let i = 0; i < 7; i++) { const y = 32 + i * 10; x.beginPath(); x.moveTo(0, y - 14); x.lineTo(0, y); x.lineTo(i % 2 ? 16 : -16, y - 12); x.stroke() }
    x.restore()
  }
  if (kind === 'leaf') {
    x.fillStyle = '#453421'; x.font = 'italic 60px Georgia'; x.fillText(['The seal remembers.', 'Follow the markings.', 'Do not lose the thread.'][index % 3], w * .12, h * .22)
    x.strokeStyle = '#4b382455'; x.lineWidth = 2
    for (let i = 0; i < 15; i++) { x.beginPath(); x.moveTo(w * .12, h * .32 + i * 39); x.lineTo(w * (i % 3 ? .78 : .63), h * .32 + i * 39); x.stroke() }
    x.save(); x.translate(w * .51, h * .6); x.strokeStyle = '#443b2c'; x.globalAlpha = .35
    // Anatomical moth specimen rather than a generic Halloween icon.
    for (const side of [-1, 1]) for (let i = 0; i < 11; i++) { x.beginPath(); x.ellipse(side * 120, 0, 70 + i * 4, 110 + i * 3, side * .55, 0, Math.PI * 2); x.stroke() }
    x.beginPath(); x.ellipse(0, 20, 15, 120, 0, 0, Math.PI * 2); x.stroke(); x.restore()
  }
  x.font = '16px monospace'; x.textAlign = 'center'; x.fillStyle = '#76573c'; x.fillText(kind === 'faq' ? 'THE UNANSWERED FILES / RESEARCH NOTES' : kind === 'cases' ? 'CHALLENGE BRIEFING / KEEP THIS FILE CLOSE' : 'REWARD DOSSIER / BREAK THE SEAL', w * .5, h * .93)
  x.textAlign = 'left'
}
