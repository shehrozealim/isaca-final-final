/** Original ink studies: identity controls a distinct composition for every leaf. */
export function paintPageEngraving(x: CanvasRenderingContext2D, id: number, left: number, top: number, width: number, height: number) {
  if (height < 12) return
  x.save(); x.translate(left+width/2,top+height/2);x.scale(width/300,height/240)
  x.strokeStyle='#553524';x.fillStyle='#553524';x.lineWidth=1.3;x.globalAlpha=.86
  const ellipse=(a:number,b:number,c:number,d:number,r=0)=>{x.beginPath();x.ellipse(a,b,c,d,r,0,Math.PI*2);x.stroke()}
  const line=(a:number,b:number,c:number,d:number)=>{x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()}
  const n=Math.abs(id), phase=n*.73
  if(n%5===0){ // An astronomical instrument, with individual orbital measurements.
    ellipse(0,0,78,78);ellipse(0,0,65,65);ellipse(0,0,105,30,phase);ellipse(0,0,22,22)
    for(let i=0;i<24;i++){const t=i*Math.PI/12;line(Math.cos(t)*70,Math.sin(t)*70,Math.cos(t)*78,Math.sin(t)*78)}
    line(-102,94,102,94);line(-40,94,0,78);line(40,94,0,78)
  }else if(n%5===1){ // Botanical specimen with a different branching structure per leaf.
    line(0,96,0,-96)
    for(let i=0;i<9;i++){const y=70-i*20,side=i%2?1:-1,l=35+((n*13+i*17)%40);x.beginPath();x.moveTo(0,y);x.bezierCurveTo(side*l,y-45,side*l,y+10,0,y);x.stroke();line(0,y,side*l*.65,y-16)}
    ellipse(0,-91,12,17,phase)
  }else if(n%5===2){ // Antique ward key.
    ellipse(0,-54,38,38);ellipse(-19,-54,13,18);ellipse(19,-54,13,18);ellipse(0,-72,12,12)
    line(-6,-16,-6,99);line(6,-16,6,99);line(-6,99,38,99);line(38,99,38,74);line(38,74,21,74);line(21,74,21,87);line(21,87,6,87)
    for(let i=0;i<8;i++)line(-6,30+i*6,6,26+i*6)
  }else if(n%5===3){ // Moth specimen, intricate wings of varying proportions.
    ellipse(0,0,8,53);ellipse(0,-57,10,10);line(-5,-65,-22,-84);line(5,-65,22,-84)
    for(const s of [-1,1]){x.beginPath();x.moveTo(s*8,-35);x.bezierCurveTo(s*145,-140,s*135,40,s*11,20);x.bezierCurveTo(s*100,120,s*100,30,s*8,12);x.stroke();ellipse(s*63,-30,17+n%7,23,-s*.6);ellipse(s*46,46,10,14);for(let i=0;i<7;i++)line(s*10,-25+i*6,s*(60+i*8),-80+i*15)}
  }else{ // Gothic window study, individual tracery.
    x.beginPath();x.moveTo(-65,95);x.lineTo(-65,-10);x.quadraticCurveTo(-65,-67,0,-103);x.quadraticCurveTo(65,-67,65,-10);x.lineTo(65,95);x.closePath();x.stroke();line(0,-85,0,95);line(-65,22,65,22);ellipse(-29,-15,23,34);ellipse(29,-15,23,34);ellipse(0,-65,12,16)
    for(let i=0;i<8;i++)line(-58,35+i*7,58,35+i*7)
  }
  // Fine crosshatching and perimeter annotations echo copperplate field studies.
  x.globalAlpha=.30;x.lineWidth=.55
  for(let i=0;i<58;i++){const t=i/58*Math.PI*2,r=83+Math.sin(i*3+phase)*9;const a=Math.cos(t)*r,b=Math.sin(t)*r;line(a,b,a+Math.cos(t+.8)*8,b+Math.sin(t+.8)*8)}
  for(const side of [-1,1]){for(let i=0;i<11;i++){const yy=-80+i*16;line(side*111,yy,side*(121+(i+n)%9),yy-3)}}
  x.globalAlpha=.65;x.lineWidth=.85
  // Identifying constellation and worn graphite hatch differ on every drawing.
  for(let i=0;i<17;i++){const a=Math.sin(i*17+n*7)*125,b=Math.cos(i*11+n*3)*98;line(a,b,a+3+(n+i)%7,b-4);if(i%4===0)ellipse(a,b,2,2)}
  x.restore()
}
