import manifest from '../../data/page-art.json'

type Art = { src: string; ink: boolean; invert?: boolean }
const catalog: Record<string, Art> = manifest
const images = new Map<string, HTMLImageElement | HTMLCanvasElement>()
let pending: Promise<void> | undefined
/** Shared decoded sources and extracted ink, reused across all canvas textures. */
export function prepareSuppliedArt() {
  return pending ??= Promise.all(Object.entries(catalog).map(async ([name, art]) => {
    const image = new Image(); image.src = art.src; await image.decode()
    if (!art.ink) { images.set(name, image); return }
    const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight
    const ctx = canvas.getContext('2d')!; ctx.drawImage(image, 0, 0)
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < pixels.data.length; i += 4) {
      const light = pixels.data[i]*.2126 + pixels.data[i+1]*.7152 + pixels.data[i+2]*.0722
      pixels.data[i+3] = Math.round(Math.max(0,Math.min(1,art.invert ? light/190 : ((name.startsWith('symbols-2')?182:230)-light)/170))*235)
      pixels.data[i] = 48; pixels.data[i+1] = 35; pixels.data[i+2] = 27
    }
    ctx.putImageData(pixels,0,0);images.set(name,canvas)
  })).then(() => {})
}
/** Contained artwork: preserve proportions and reserve the caller's text-free rectangle. */
export function paintSuppliedArt(x: CanvasRenderingContext2D, name: string, left: number, top: number, width: number, height: number, angle=0) {
  const image = images.get(name); const art = catalog[name]
  if (!image || !art || width<8 || height<8) return
  const inset = art.ink ? 0 : Math.min(width,height)*.035
  const scale = Math.min((width-inset*2)/image.width,(height-inset*2)/image.height)
  const w=image.width*scale,h=image.height*scale
  x.save();x.translate(left+width/2,top+height/2);x.rotate(angle)
  if (!art.ink) {
    x.shadowColor='#2a150c75';x.shadowBlur=width*.018;x.shadowOffsetY=height*.012
    x.fillStyle='#dfd0ad';x.fillRect(-w/2-inset,-h/2-inset,w+inset*2,h+inset*2)
    x.shadowColor='transparent';x.filter='sepia(.18) saturate(.72) contrast(1.06)'
  } else { x.globalCompositeOperation='multiply';x.globalAlpha=.9 }
  x.drawImage(image,-w/2,-h/2,w,h);x.filter='none'
  if (!art.ink) {
    x.strokeStyle='#57402d77';x.lineWidth=Math.max(.6,width/700);x.strokeRect(-w/2,-h/2,w,h)
    x.globalAlpha=.54;x.fillStyle='#b69b65';x.fillRect(-w*.15,-h/2-inset*1.4,w*.3,inset*1.4)
  }
  x.restore()
}
export function paintSuppliedStudy(x: CanvasRenderingContext2D, variant: number, w: number, h: number) {
  const layouts: Record<number,[string,string]> = {
    0:['pic-5','symbols-3-4'],1:['ghosts-3','symbols-3-5'],2:['ghosts-2','symbols-3-6'],3:['ghosts-1','symbols-3-7'],
    12:['pic-1','symbols-3-8'],13:['symbols-3','symbols-3-9'],25:['symbols-2','symbols-3-10'],100:['symbols-2-7','symbols-3-11'],
  }
  const pair=layouts[variant] ?? ['symbols-2-8','symbols-2-6']
  paintSuppliedArt(x,pair[0],w*.13,h*.17,w*.74,h*.46,-.018)
  paintSuppliedArt(x,pair[1],w*.29,h*.65,w*.42,h*.20,.025)
}
