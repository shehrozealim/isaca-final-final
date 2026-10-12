import { paintSuppliedArt, paintSuppliedStudy, prepareSuppliedArt } from './SuppliedPageArt'
import { ensurePageFonts, preparePageInk } from './PageTypography'
import { event } from '../../data/event'
import { copy, formatCopy } from '../../data/content'
import { CanvasTexture, SRGBColorSpace } from 'three'

/** One supplied-derived parchment across every physical page, with crisp ink. */
export function createAncientPaper(draw: (x: CanvasRenderingContext2D, w: number, h: number) => void, redraw: () => void, study = false, variant = 0, plain = false) {
  const canvas = document.createElement('canvas'); canvas.width = study ? 1024 : 1536; canvas.height = study ? 1365 : 2048
  const x = canvas.getContext('2d')!, texture = new CanvasTexture(canvas)
  preparePageInk(x)
  texture.colorSpace = SRGBColorSpace; texture.anisotropy = 8
  const image = new Image()
  let disposed = false
  const paint = () => {
    if (disposed) return
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, canvas.width, canvas.height)
    x.fillStyle = '#e5cd9e'; x.fillRect(0, 0, canvas.width, canvas.height)
    if (image.complete && image.naturalWidth) x.drawImage(image, 0, 0, canvas.width, canvas.height)
    draw(x, canvas.width, canvas.height)
    if (!plain && study) paintSuppliedStudy(x, variant, canvas.width, canvas.height)
    texture.needsUpdate = true; redraw()
  }
  image.src = '/s03/textures/ancient-paper.webp'
  const ready = Promise.all([ensurePageFonts(), image.decode(), prepareSuppliedArt()]).then(paint)
  paint()
  return { texture, ready, dispose: () => { disposed = true; texture.dispose() } }
}

export function drawArtifactInk(x: CanvasRenderingContext2D, w: number, h: number, kind: 'cases' | 'bounty' | 'leaf' | 'faq' | 'study', index = 0) {
  x.strokeStyle = '#78553266'; x.lineWidth = 1.5; x.strokeRect(w * .065, h * .055, w * .87, h * .89)
  x.fillStyle = '#60462e'; x.font = '18px "Page Antique"'; x.fillText(copy("DJS ISACA / THE HUNT"), w * .11, h * .095)
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
  if (kind !== 'study' && kind !== 'cases' && kind !== 'faq') { x.save(); x.translate(w * .17, h * .78); x.rotate(-.09); x.fillStyle = '#75433499'; x.font = 'italic 21px "Page Antique"'; x.fillText(copy("Leave nothing unexplained."), 0, 0); x.restore() }
  if (kind === 'study') {
    x.save(); x.textAlign = 'center'; x.fillStyle = '#473524'; x.font = 'italic 700 48px "Page Serif"'
    x.fillText(copy('FIELD OBSERVATIONS'), w * .5, h * .125)
    x.font = 'italic 27px "Page Antique"'; x.fillText(copy('No witness stands alone.'), w * .5, h * .89); x.restore()
  }
  x.font = '16px "Page Antique"'; x.textAlign = 'center'; x.fillStyle = '#76573c'; x.fillText(kind === 'faq' ? copy("THE UNANSWERED FILES / RESEARCH NOTES") : kind === 'cases' ? copy("CHALLENGE BRIEFING / KEEP THIS FILE CLOSE") : copy("REWARD DOSSIER / BREAK THE SEAL"), w * .5, h * .93)
  x.textAlign = 'left'
  if (kind === 'cases' || kind === 'faq') {
    const left = w * .16, width = w * .68
    let y = h * .18
    const write = (text: string, size: number, lineHeight: number, heading = false) => {
      x.font = `${heading ? 700 : 400} ${size}px "${heading ? 'Page Serif' : 'Page Antique'}", Georgia, serif`
      x.fillStyle = heading ? '#422319' : '#3d2b1d'
      let row = ''
      for (const word of text.split(' ')) {
        const next = row ? row + ' ' + word : word
        if (x.measureText(next).width > width && row) { x.fillText(row, left, y); y += lineHeight; row = word }
        else row = next
      }
      if (row) { x.fillText(row, left, y); y += lineHeight }
    }
    if (index === 0) {
      x.textAlign = 'center'; x.fillStyle = '#492a1c'
      const title = kind === 'cases' ? copy('Problem statements.') : copy('FAQ')
      x.font = '700 108px "Page Serif", Georgia, serif'
      let size=108
      while(x.measureText(title).width>width && size>58) x.font=`700 ${--size}px "Page Serif", Georgia, serif`
      x.fillText(title,w*.5,h*.24)
      paintSuppliedArt(x,kind==='cases'?'symbols-1-0':'symbols-1-1',w*.20,h*.30,w*.60,h*.38)
      x.font='46px "Page Antique", Georgia, serif'
      x.fillText(kind==='cases'?copy('The sealed cases.'):copy('The unanswered files.'),w*.5,h*.76)
      x.font='28px "Event Blood", Georgia, serif';x.fillStyle='#814331'
      x.fillText(kind==='cases'?copy('CHALLENGE DOSSIER'):copy('FROM THE ARCHIVE'),w*.5,h*.85)
      x.textAlign='left'
    } else if (kind === 'cases') {
      const brief = event.problemStatements[index - 1]
      if (brief) {
        write(brief.title, 61, 77, true); y += 26
        write(brief.description, 48, 66); y += 34
        if(brief.objective){ write(copy('The objective'),46,62,true); y+=8;write(brief.objective,48,66);y+=30 }
        if(brief.deliverables){ write(copy('Bring back evidence'),46,62,true); y+=8;brief.deliverables.forEach(item=>{write('• '+item,46,64);y+=8}) }
        if(y<h*.78) paintSuppliedArt(x,`symbols-3-${index-1}`,w*.24,y+18,w*.52,h*.82-y-18)
        x.font='27px "Page Antique", Georgia, serif'; x.fillStyle='#74513a'
        x.fillText(copy('Official rules will be published with the problem statements.'),left,h*.86,width)
      }
    } else {
      event.faq.slice((index-1)*3,index*3).forEach(entry=>{
        write(entry.question,64,78,true);y+=12;write(entry.answer,52,72);y+=32
      })
      if(y<h*.87) paintSuppliedArt(x,'symbols-3-3',w*.25,y+10,w*.50,h*.88-y-10)
    }
  }
}




