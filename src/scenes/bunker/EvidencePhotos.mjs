/** Original photographic evidence atlas, shared by the diary and physical files. */
export const EVIDENCE_ATLAS = '/s03/textures/evidence-photos.webp';
const graphiteCache = new WeakMap();
export const SKETCH_ATLAS = '/s03/props/field-sketches.webp';

export function paintFieldSketch(ctx, atlas, index, x, y, width, height) {
  if (!atlas.complete || !atlas.naturalWidth) return;
  const n = ((index % 4) + 4) % 4, w = atlas.naturalWidth / 2, h = atlas.naturalHeight / 2;
  let variants=graphiteCache.get(atlas); if(!variants){variants=[];graphiteCache.set(atlas,variants)}
  if(!variants[n]){
    const ink=document.createElement('canvas');ink.width=w;ink.height=h;const pen=ink.getContext('2d');
    pen.drawImage(atlas,(n%2)*w,Math.floor(n/2)*h,w,h,0,0,w,h);const data=pen.getImageData(0,0,w,h);
    for(let i=0;i<data.data.length;i+=4){const lum=data.data[i]*.2126+data.data[i+1]*.7152+data.data[i+2]*.0722;
      data.data[i+3]*=Math.max(0,Math.min(1,(210-lum)/130));data.data[i]=58;data.data[i+1]=43;data.data[i+2]=28}
    pen.putImageData(data,0,0);variants[n]=ink
  }
  ctx.save(); ctx.translate(x,y); ctx.globalCompositeOperation='multiply'; ctx.globalAlpha=.80;
  ctx.drawImage(variants[n],0,0,width,height);
  // A faint offset graphite transfer breaks the clean digital edge.
  ctx.globalAlpha=.08; ctx.drawImage(variants[n],1.2,1.6,width,height);
  for(let i=0;i<12;i++){
    const px=width*(.14+((i*37+n*13)%73)/100),py=height*(.15+((i*29+n*17)%69)/100);
    const smudge=ctx.createRadialGradient(px,py,0,px,py,width*.055);
    smudge.addColorStop(0,'#30251b22');smudge.addColorStop(1,'#30251b00');ctx.globalAlpha=.45;ctx.fillStyle=smudge;ctx.fillRect(px-width*.06,py-width*.06,width*.12,width*.12);
  }
  ctx.globalAlpha=.22;ctx.strokeStyle='#47382a';ctx.lineWidth=Math.max(.5,width/900);
  for(let i=0;i<11;i++){const yy=height*(.83+i*.008);ctx.beginPath();ctx.moveTo(width*.09,yy);ctx.quadraticCurveTo(width*.17,yy+3,width*(.2+(i%3)*.025),yy-2);ctx.stroke()}
  ctx.restore();
}

export function paintEvidencePhoto(ctx, atlas, index, px, py, width, height, angle = 0) {
  if (!atlas.complete || !atlas.naturalWidth) return;
  const n = ((index % 6) + 6) % 6, cellW = atlas.naturalWidth / 3, cellH = atlas.naturalHeight / 2;
  const rim = Math.max(3, width * .045), imageW = width - rim * 2, imageH = height - rim - height * .18;
  // Crop each atlas cell to the print without stretching the photograph.
  const ratio = imageW / imageH, sourceW = Math.min(cellW, cellH * ratio), sourceH = sourceW / ratio;
  ctx.save(); ctx.translate(px + width / 2, py + height / 2); ctx.rotate(angle);
  ctx.shadowColor = '#160e09aa'; ctx.shadowBlur = width * .025; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 7;
  ctx.fillStyle = '#e5dfcd'; ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.shadowColor = 'transparent';
  ctx.drawImage(atlas, (n % 3) * cellW + (cellW - sourceW) / 2, Math.floor(n / 3) * cellH + (cellH - sourceH) / 2, sourceW, sourceH, -width / 2 + rim, -height / 2 + rim, imageW, imageH);
  ctx.fillStyle = '#b8a27388'; ctx.fillRect(-width * .16, -height / 2 - rim, width * .32, rim * 3);
  ctx.strokeStyle = '#402d2655'; ctx.lineWidth = .7; ctx.strokeRect(-width / 2 + rim, -height / 2 + rim, imageW, imageH);
  ctx.restore();
}

export function paintEvidenceSpread(ctx, atlas, width, height, variant = 0) {
  const layouts = [
    [[0,.10,.16,.78,.34,-.025],[4,.10,.56,.36,.27,.045],[2,.53,.59,.36,.24,-.04]],
    [[2,.12,.16,.74,.32,.025],[3,.12,.54,.42,.31,-.04],[1,.61,.57,.27,.23,.065]],
    [[4,.10,.17,.39,.43,-.035],[1,.56,.18,.33,.25,.04],[0,.53,.53,.37,.29,-.025],[5,.12,.67,.32,.20,.05]],
    [[5,.12,.16,.72,.34,-.02],[0,.10,.57,.38,.27,-.05],[3,.55,.56,.34,.29,.045]],
  ];
  for (const [n,x,y,w,h,a] of layouts[variant % layouts.length]) paintEvidencePhoto(ctx,atlas,n,x*width,y*height,w*width,h*height,a);
}
