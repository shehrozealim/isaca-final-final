const cutouts = new WeakMap<HTMLImageElement, HTMLCanvasElement>()
export function paintTimelineSticker(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  if (!image.naturalWidth) return
  let cutout = cutouts.get(image)
  if (!cutout) {
    cutout = document.createElement('canvas');cutout.width=image.naturalWidth;cutout.height=image.naturalHeight
    const ink=cutout.getContext('2d')!;ink.drawImage(image,0,0)
    const pixels=ink.getImageData(0,0,cutout.width,cutout.height),data=pixels.data
    // Isolate the photographed taped paper while retaining its dark contact edge.
    const r=data[0],g=data[1],b=data[2]
    for(let i=0;i<data.length;i+=4){
      if(Math.abs(data[i]-r)+Math.abs(data[i+1]-g)+Math.abs(data[i+2]-b)<38)data[i+3]=0
    }
    ink.putImageData(pixels,0,0);cutouts.set(image,cutout)
  }
  ctx.save();ctx.shadowColor='#21120955';ctx.shadowBlur=3;ctx.shadowOffsetY=3
  ctx.drawImage(cutout,x,y,width,height);ctx.restore()
}
