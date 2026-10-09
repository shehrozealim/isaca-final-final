import * as THREE from 'three';
import { hackathon } from './hackathon-data.mjs';

/** Supplied bundle geometry, with local journal reference textures. */
export function createOccultBook({pageCount=3, approach=3.5, event=hackathon, onTextureReady=()=>{}}={}) {
  pageCount=Math.max(2,Math.min(16,Math.floor(pageCount)||6));
  const group=new THREE.Group(), pages=[], springs=[];
  // Keep textures owned by the factory so the shared canvas can dispose them.
  const referenceCover=new Image();referenceCover.src='/s03/textures/supplied-journal-cover.jpg';
  referenceCover.onload=()=>{
    const c=leatherMap.image,x=c.getContext('2d');
    x.setTransform(1,0,0,1,0,0);
    x.drawImage(referenceCover,18,12,referenceCover.width-42,referenceCover.height-25,0,0,c.width,c.height);leatherMap.needsUpdate=true;
    // The supplied photograph already contains its metal badge.
    cover.traverse(o=>{if(['CylinderGeometry','TorusGeometry','TubeGeometry'].includes(o.geometry?.type))o.visible=false});
    onTextureReady();
  };
  const referencePages=new Image();referencePages.src='/s03/textures/supplied-aged-pages.jpg';
  referencePages.onload=()=>{sigilMaps.forEach((t,i)=>{const x=t.image.getContext('2d');x.save();x.setTransform(1,0,0,1,0,0);x.translate(i===1?850:865,i===1?1320:1180);x.rotate(-.055);x.fillStyle='#eee1c4';x.fillRect(-12,-12,214,188);x.drawImage(referencePages,(i%2)*referencePages.width/2,0,referencePages.width/2,referencePages.height,0,0,190,153);x.fillStyle='#4e3d29';x.font='12px monospace';x.fillText('SPECIMEN / FIELD COPY',0,171);x.restore();t.needsUpdate=true});onTextureReady()};
  group.addEventListener('removed',()=>{referenceCover.onload=null;referencePages.onload=null});
  const paperReference=new Image(), paperRecipes=[];
  paperReference.onload=()=>{for(const {map,kind,index} of paperRecipes){const replacement=texture(kind,index,false);map.image=replacement.image;map.needsUpdate=true;replacement.dispose()}onTextureReady()};paperReference.src='/s03/textures/ancient-paper.webp';
  group.addEventListener('removed',()=>{paperReference.onload=null});
  let seed=13;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const restCenter=new THREE.Vector3(0,.16,0);let tableScale=1,mobileView=false;
  // Original field specimen drawing: ink hatching, clipped label and margin notes.
  function drawFieldSketch(x){
    x.save();x.translate(400,345);x.fillStyle='#ddccaa';x.fillRect(-240,-220,480,435);
    x.strokeStyle='#40382d';x.lineWidth=2;
    for(const sign of [-1,1]){x.save();x.scale(sign,1);for(let i=0;i<15;i++){x.beginPath();x.ellipse(95,-25,43+i*2.5,50+i*3,.45,.3,Math.PI*1.95);x.stroke()}x.restore()}
    x.beginPath();x.moveTo(-69,-15);x.bezierCurveTo(-105,60,-66,95,-42,105);x.lineTo(-33,161);x.lineTo(33,161);x.lineTo(42,105);x.bezierCurveTo(66,95,105,60,69,-15);x.quadraticCurveTo(0,-61,-69,-15);x.stroke();
    for(const sign of [-1,1]){x.beginPath();x.ellipse(sign*35,51,24,30,sign*.35,0,Math.PI*2);x.stroke();for(let i=0;i<12;i++){x.beginPath();x.moveTo(sign*(19+i*2),27);x.lineTo(sign*(29+i*2),71);x.stroke()}}
    x.beginPath();x.moveTo(0,74);x.lineTo(-13,103);x.lineTo(13,103);x.closePath();x.stroke();for(let i=-3;i<=3;i++){x.beginPath();x.moveTo(i*9,121);x.lineTo(i*9,159);x.stroke()}
    x.font='20px "Segoe Print", cursive';x.fillStyle='#5b3e2c';x.fillText('SPECIMEN 07 / UNIDENTIFIED',-210,-180);x.fillText('iron residue at the edge',-180,198);
    x.strokeStyle='#86402e';x.beginPath();x.ellipse(0,55,125,145,-.12,.1,Math.PI*1.8);x.stroke();x.restore();
  }
  function texture(kind,index=0,record=true){
    const c=document.createElement('canvas');c.width=1152;c.height=1536;const x=c.getContext('2d');x.scale(1.5,1.5);
    x.fillStyle=kind==='cover'?'#71482f':'#ddcba3';x.fillRect(0,0,768,1024);
    // Fine fibers rather than large uniform grain; darker aging at the margins.
    for(let i=0;i<48000;i++){const p=random();x.fillStyle=p>.5?'rgba(255,239,195,.045)':'rgba(45,23,8,.035)';x.fillRect(random()*768,random()*1024,random()*2+.3,random()*2+.3)}
    for(let i=0;i<9000;i++){const px=random()*768,py=random()*1024;x.strokeStyle=kind==='cover'?'rgba(20,10,3,.10)':'rgba(95,67,29,.045)';x.lineWidth=.4;x.beginPath();x.moveTo(px,py);x.lineTo(px+random()*3,py+random()*7);x.stroke()}
    const g=x.createRadialGradient(390,490,220,390,490,680);g.addColorStop(0,'#0000');g.addColorStop(.72,kind==='cover'?'#27100415':'#855b1b08');g.addColorStop(1,kind==='cover'?'#180a04b0':'#6c3b1280');x.fillStyle=g;x.fillRect(0,0,768,1024);
    for(let i=0;i<24;i++){const px=random()<.5?random()*75:693+random()*75,py=random()*1024,r=20+random()*65;const stain=x.createRadialGradient(px,py,0,px,py,r);stain.addColorStop(0,'#6b3b1218');stain.addColorStop(1,'#6b3b1200');x.fillStyle=stain;x.fillRect(px-r,py-r,2*r,2*r)}
    if(kind!=='cover' && paperReference.complete && paperReference.naturalWidth)x.drawImage(paperReference,0,0,768,1024);
    // Binding shadow sits outside the readable text column.
    const binding=x.createLinearGradient(0,0,68,0);binding.addColorStop(0,'#211206a0');binding.addColorStop(.35,'#21120640');binding.addColorStop(1,'#21120600');x.fillStyle=binding;x.fillRect(0,0,68,1024);
    // Worn notebook ruling and oxidized ink, kept faint behind the event text.
    if(kind!=='cover'){
      x.save();x.strokeStyle='rgba(91,112,117,.11)';x.lineWidth=.7;
      for(let y=146;y<945;y+=48){x.beginPath();x.moveTo(45,y);x.lineTo(735,y+.6);x.stroke()}
      x.strokeStyle='rgba(131,51,38,.2)';x.beginPath();x.moveTo(65,40);x.lineTo(65,984);x.stroke();
      // Faded water damage stays in the corners, outside the main text column.
      x.strokeStyle='rgba(101,59,25,.065)';for(let r=0;r<4;r++){x.lineWidth=2+r;x.beginPath();x.arc(748,1000,72+r*3,.8,Math.PI*1.8);x.stroke()}
      x.restore();
    }
    function evidenceStamp(label,cx,cy){x.save();x.translate(cx,cy);x.rotate(-.065);x.strokeStyle='rgba(119,41,29,.48)';x.fillStyle='rgba(119,41,29,.58)';x.lineWidth=1.7;x.strokeRect(-111,-22,222,39);x.font='bold 18px monospace';x.textAlign='center';x.fillText(label,0,4);x.restore()}
    if(kind==='cover'){

      x.strokeStyle='#302015';x.lineWidth=3;x.strokeRect(40,40,688,944);x.strokeRect(52,52,664,920);
      x.textAlign='center';x.fillStyle='#d1aa77';x.font='19px monospace';x.fillText('SUPERNATURAL INVESTIGATIONS',384,115);
      // Physical seal is separate geometry; avoid a second printed medallion.
      x.fillStyle='#26190f';x.shadowColor='#bb916b';x.shadowOffsetY=1;x.font='bold 86px Georgia';x.fillText(event.name,384,750);x.font='28px monospace';x.fillText('DJS ISACA / FIELD JOURNAL',384,817);x.shadowOffsetY=0;
      x.save();x.translate(384,899);x.rotate(-.045);x.strokeStyle='#3d2118';x.strokeRect(-170,-38,340,64);x.font='23px monospace';x.fillText('BUILD / CREATE / SHIP',0,4);x.restore();
      for(let i=0;i<45;i++){x.strokeStyle='rgba(218,178,125,.09)';x.lineWidth=.6;x.beginPath();const px=random()*768,py=random()*1024;x.moveTo(px,py);x.lineTo(px+random()*100-50,py+random()*28);x.stroke()}
    }else if(kind==='sigil'){
      if(index===0){

      // A taped, monochrome evidence sketch gives the blank leaf a diary composition.
      x.save();x.translate(89,148);x.rotate(-.045);x.fillStyle='rgba(40,26,13,.14)';x.fillRect(5,6,215,141);x.fillStyle='#ecdfbd';x.fillRect(0,0,215,141);x.fillStyle='#7c7566';x.fillRect(12,12,191,103);
      x.strokeStyle='#312e28';x.lineWidth=2;x.beginPath();x.moveTo(40,105);x.lineTo(40,60);x.lineTo(101,25);x.lineTo(163,60);x.lineTo(163,105);x.moveTo(29,61);x.lineTo(101,20);x.lineTo(174,61);x.moveTo(87,105);x.lineTo(87,75);x.lineTo(115,75);x.lineTo(115,105);x.stroke();
      x.strokeRect(54,68,18,20);x.strokeRect(131,68,18,20);x.fillStyle='#392d23';x.font='13px monospace';x.fillText('EXHIBIT 0'+(index+1)+' / FIELD SKETCH',15,130);
      x.fillStyle='rgba(170,142,88,.45)';x.fillRect(72,-10,69,28);x.restore();
      evidenceStamp('EVIDENCE / 0'+(index+1),536,194);

      x.save();x.translate(384,495);x.scale(.68,.68);x.strokeStyle='#42392a';x.globalAlpha=.64;x.lineWidth=1.7;
      for(const radius of [215,198,163,95]){x.beginPath();x.arc(0,0,radius,0,Math.PI*2);x.stroke();x.save();x.globalAlpha=.19;x.beginPath();x.arc(1.3,-.9,radius+.8,.2,Math.PI*1.76);x.stroke();x.restore()}
      for(let i=0;i<48;i++){const angle=i*Math.PI/24;x.beginPath();x.moveTo(Math.cos(angle)*204,Math.sin(angle)*204);x.lineTo(Math.cos(angle)*(i%4===0?229:219),Math.sin(angle)*(i%4===0?229:219));x.stroke()}
      if(index%3===0){x.beginPath();for(let i=0;i<6;i++){const angle=-Math.PI/2+i*4*Math.PI/5;const px=Math.cos(angle)*161,py=Math.sin(angle)*161;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
      else if(index%3===1){x.beginPath();x.moveTo(-155,0);x.quadraticCurveTo(0,-122,155,0);x.quadraticCurveTo(0,122,-155,0);x.stroke();x.beginPath();x.arc(0,0,49,0,Math.PI*2);x.stroke();x.beginPath();x.arc(0,0,14,0,Math.PI*2);x.stroke()}
      else{for(let i=0;i<8;i++){x.rotate(Math.PI/4);x.beginPath();x.moveTo(0,-161);x.lineTo(34,-69);x.lineTo(0,-32);x.lineTo(-34,-69);x.closePath();x.stroke()}}
      x.font='36px Georgia';x.textAlign='center';['☿','♄','♃','♆','☽','♇'].forEach((glyph,i)=>{const angle=i*Math.PI/3-Math.PI/2;x.fillText(glyph,Math.cos(angle)*181,Math.sin(angle)*181+12)});
      x.globalAlpha=.27;x.beginPath();x.moveTo(-260,0);x.lineTo(260,0);x.moveTo(0,-270);x.lineTo(0,270);x.stroke();x.restore();
      // Layered evidence-board ephemera; decorative case clues, not event facts.
      function note(px,py,w,h,color,lines,angle){x.save();x.translate(px,py);x.rotate(angle);x.fillStyle='rgba(35,20,8,.18)';x.fillRect(5,7,w,h);x.fillStyle=color;x.beginPath();x.moveTo(0,0);x.lineTo(w,0);x.lineTo(w,h-17);x.lineTo(w-18,h);x.lineTo(0,h);x.closePath();x.fill();x.fillStyle='rgba(95,60,15,.12)';x.fillRect(0,0,w,17);x.textAlign='left';x.fillStyle='#383126';x.font='22px "Segoe Print", cursive';lines.forEach((s,i)=>x.fillText(s,13,40+i*31));x.fillStyle='rgba(249,240,192,.75)';x.beginPath();x.moveTo(w-18,h);x.lineTo(w-18,h-17);x.lineTo(w,h-17);x.fill();x.restore()}
      note(494,323,207,157,'#d8ca74',['Same symbol.','Different place.','Why here?'],.065);
      note(80,661,240,132,'#c6bf9c',['Salt. Iron. Silver.','Test before dark.'],-.07);
      // Torn newspaper fragment with redaction and a circled clue.
      x.save();x.translate(73,345);x.rotate(-.075);x.fillStyle='rgba(35,20,8,.17)';x.fillRect(5,7,192,190);x.fillStyle='#cbbfa0';x.beginPath();x.moveTo(0,0);x.lineTo(194,2);x.lineTo(189,184);for(let i=8;i>=0;i--)x.lineTo(i*23,187+(i%2)*5);x.lineTo(0,0);x.fill();x.textAlign='left';x.fillStyle='#393328';x.font='bold 21px Georgia';x.fillText('LOCAL ARCHIVE',12,32);x.font='13px monospace';x.fillText('UNEXPLAINED INCIDENT',12,55);x.strokeStyle='#635846';x.lineWidth=1;for(let i=0;i<7;i++){x.beginPath();x.moveTo(12,74+i*12);x.lineTo(i%3===0?143:176,74+i*12);x.stroke()}x.fillStyle='#302a22';x.fillRect(15,97,120,8);x.fillRect(82,122,86,8);x.strokeStyle='#944434';x.lineWidth=2;x.beginPath();x.ellipse(91,150,70,19,-.05,0,Math.PI*2);x.stroke();x.fillStyle='rgba(173,149,98,.6)';x.fillRect(54,-8,75,26);x.restore();
      // Second instant photo: charcoal woods and an unidentified silhouette.
      x.save();x.translate(508,614);x.rotate(.09);x.fillStyle='rgba(28,20,13,.2)';x.fillRect(5,8,179,178);x.fillStyle='#eee0bd';x.fillRect(0,0,179,178);x.fillStyle='#65645a';x.fillRect(11,11,157,130);x.strokeStyle='#35362f';x.lineWidth=4;for(let i=0;i<7;i++){x.beginPath();x.moveTo(21+i*22,141);x.lineTo(18+i*23,17);x.moveTo(19+i*23,55);x.lineTo(6+i*23,26);x.stroke()}x.fillStyle='#282b25';x.beginPath();x.ellipse(91,91,12,34,0,0,Math.PI*2);x.fill();x.beginPath();x.arc(91,56,9,0,Math.PI*2);x.fill();x.textAlign='left';x.font='15px monospace';x.fillStyle='#41352b';x.fillText('EXHIBIT B / UNKNOWN',11,161);x.fillStyle='rgba(174,150,105,.55)';x.fillRect(57,-9,76,29);x.restore();
      // Red cotton connections with their own offset shadows and fine highlight.
      const links=[[[195,168],[574,334]],[[574,334],[162,360]],[[162,360],[599,628]],[[599,628],[184,672]],[[195,168],[599,628]]];
      links.forEach(([a,b])=>{x.save();x.lineCap='round';x.strokeStyle='rgba(42,18,10,.24)';x.lineWidth=4;x.beginPath();x.moveTo(a[0]+2,a[1]+3);x.lineTo(b[0]+2,b[1]+3);x.stroke();x.strokeStyle='#862d27';x.lineWidth=3;x.beginPath();x.moveTo(...a);x.lineTo(...b);x.stroke();x.strokeStyle='rgba(230,133,108,.5)';x.lineWidth=.65;x.beginPath();x.moveTo(a[0]-.5,a[1]);x.lineTo(b[0]-.5,b[1]);x.stroke();x.restore()});
      function pin(px,py){x.save();x.fillStyle='rgba(20,14,7,.23)';x.beginPath();x.ellipse(px+4,py+5,10,8,0,0,Math.PI*2);x.fill();const g=x.createRadialGradient(px-3,py-3,0,px,py,8);g.addColorStop(0,'#e3c994');g.addColorStop(.45,'#997848');g.addColorStop(1,'#473222');x.fillStyle=g;x.beginPath();x.arc(px,py,8,0,Math.PI*2);x.fill();x.restore()}
      [[195,168],[574,334],[162,360],[599,628],[184,672]].forEach(p=>pin(...p));
      // Wire paper clip and an evidence tag with a small wax seal.
      x.save();x.translate(628,159);x.rotate(.15);x.strokeStyle='#5e5b51';x.lineWidth=3;x.beginPath();x.moveTo(0,53);x.lineTo(0,0);x.quadraticCurveTo(0,-15,12,-15);x.quadraticCurveTo(25,-15,25,0);x.lineTo(25,65);x.quadraticCurveTo(25,80,10,80);x.quadraticCurveTo(-6,80,-6,65);x.lineTo(-6,13);x.stroke();x.restore();
      x.save();x.translate(489,236);x.rotate(.025);x.fillStyle='#c7b68c';x.beginPath();x.moveTo(0,0);x.lineTo(180,0);x.lineTo(196,23);x.lineTo(180,49);x.lineTo(0,49);x.closePath();x.fill();x.fillStyle='#534331';x.font='15px monospace';x.textAlign='left';x.fillText('CHAIN OF EVIDENCE',10,29);x.strokeStyle='#83553c';x.beginPath();x.arc(177,23,5,0,Math.PI*2);x.stroke();x.restore();
      x.fillStyle='#7e382c';x.beginPath();for(let i=0;i<24;i++){const a=i*Math.PI/12,r=i%2?17:19;const px=690+Math.cos(a)*r,py=755+Math.sin(a)*r;i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();x.fill();x.strokeStyle='#ac6750';x.lineWidth=1.2;x.beginPath();x.arc(690,755,11,0,Math.PI*2);x.stroke();
      x.textAlign='center';x.fillStyle='#775939';x.font='21px monospace';x.fillText('THE HUNT / INVESTIGATOR’S NOTEBOOK',384,810);x.font='italic 29px \"Segoe Print\", \"Bradley Hand\", cursive';x.fillText('Every symbol leaves a trace.',384,863);x.fillStyle='#753e2c';x.font='italic 24px \"Segoe Print\", cursive';x.fillText('Check the markings. Keep the circle intact.',384,918);
      }else if(index===1){
        // Domains verso: annotated town map, fingerprint card and research checklist.
        x.save();x.translate(89,142);x.rotate(-.035);x.fillStyle='rgba(30,20,10,.17)';x.fillRect(7,8,575,402);x.fillStyle='#c8c4a3';x.fillRect(0,0,575,402);
        x.strokeStyle='#7c8067';x.lineWidth=1;for(let i=0;i<11;i++){x.beginPath();x.moveTo(0,25+i*35);x.lineTo(575,35+i*35);x.stroke()}for(let i=0;i<13;i++){x.beginPath();x.moveTo(i*48,0);x.lineTo(i*48+40,402);x.stroke()}
        x.strokeStyle='#52646a';x.lineWidth=7;x.beginPath();x.moveTo(25,0);x.bezierCurveTo(250,100,110,260,495,402);x.stroke();
        x.strokeStyle='#8b352b';x.lineWidth=3;const route=[[76,120],[225,195],[377,115],[476,295]];x.beginPath();route.forEach(([px,py],i)=>i?x.lineTo(px,py):x.moveTo(px,py));x.stroke();route.forEach(([px,py],i)=>{x.beginPath();x.arc(px,py,15,0,Math.PI*2);x.stroke();x.fillStyle='#382c22';x.font='23px "Segoe Print", cursive';x.fillText(String(i+1),px-6,py+8)});x.fillStyle='#433c2e';x.font='24px "Segoe Print", cursive';x.fillText('Follow the pattern',32,368);x.fillStyle='rgba(179,143,83,.45)';x.fillRect(35,-10,100,30);x.fillRect(427,382,99,28);x.restore();
        x.save();x.translate(90,603);x.rotate(.05);x.fillStyle='#e8d5b3';x.fillRect(3,5,258,212);x.strokeStyle='#6b6252';x.lineWidth=1.2;for(let i=0;i<14;i++){x.beginPath();x.ellipse(127,89,13+i*4,20+i*4,.1,.1,Math.PI*1.85);x.stroke()}x.fillStyle='#3c352a';x.font='21px "Segoe Print", cursive';x.fillText('Unknown print',30,193);x.restore();
        x.save();x.translate(400,601);x.rotate(-.06);x.fillStyle='#dbcf80';x.fillRect(4,5,260,216);x.fillStyle='#343429';x.font='24px "Segoe Print", cursive';['Things to verify','□ Decode the signs','□ Compare patterns','□ Test the theory'].forEach((s,i)=>x.fillText(s,18,39+i*44));x.restore();
        evidenceStamp('RESEARCH / OPEN',390,90);x.fillStyle='#704732';x.textAlign='center';x.font='28px "Segoe Print", cursive';x.fillText('The clues are connected.',384,892);x.font='19px "Segoe Print", cursive';x.fillText('THE HUNT / INVESTIGATOR’S NOTEBOOK',384,944);
      }else{
        // Final verso: celestial chart, sealed envelope, key and admission stub.
        x.save();x.translate(380,352);x.strokeStyle='#5a4b35';for(const r of [68,133,204]){x.beginPath();x.arc(0,0,r,0,Math.PI*2);x.stroke()}const stars=[[-145,-84],[-53,-126],[62,-78],[136,51],[38,153],[-112,103]];x.beginPath();stars.forEach(([px,py],i)=>i?x.lineTo(px,py):x.moveTo(px,py));x.closePath();x.stroke();stars.forEach(([px,py])=>{x.beginPath();x.moveTo(px-8,py);x.lineTo(px+8,py);x.moveTo(px,py-8);x.lineTo(px,py+8);x.stroke()});x.font='22px "Segoe Print", cursive';x.fillStyle='#594630';x.fillText('align the signs',-89,250);x.restore();
        x.save();x.translate(83,644);x.rotate(-.035);x.fillStyle='rgba(30,20,9,.2)';x.fillRect(6,7,341,185);x.fillStyle='#b89d72';x.fillRect(0,0,341,185);x.strokeStyle='#715d40';x.beginPath();x.moveTo(0,0);x.lineTo(170,111);x.lineTo(341,0);x.moveTo(0,185);x.lineTo(135,90);x.moveTo(341,185);x.lineTo(208,90);x.stroke();x.fillStyle='#843c2e';x.beginPath();x.arc(170,104,25,0,Math.PI*2);x.fill();x.strokeStyle='#bc7c5a';x.beginPath();x.arc(170,104,16,0,Math.PI*2);x.stroke();x.restore();
        x.save();x.translate(534,639);x.rotate(.18);x.strokeStyle='#8a724b';x.lineWidth=12;x.beginPath();x.arc(0,0,31,0,Math.PI*2);x.moveTo(0,32);x.lineTo(0,135);x.lineTo(35,135);x.moveTo(0,111);x.lineTo(25,111);x.stroke();x.restore();
        x.save();x.translate(486,779);x.rotate(.07);x.fillStyle='#c5bba1';x.fillRect(0,0,193,78);x.strokeStyle='#766952';x.strokeRect(7,7,179,64);x.fillStyle='#43382c';x.font='23px "Segoe Print", cursive';x.fillText('Admit one idea',12,46);x.restore();
        evidenceStamp('SEALED / THE HUNT',382,100);x.textAlign='center';x.fillStyle='#6b3d2c';x.font='27px "Segoe Print", cursive';x.fillText('Keep this until the final hour.',384,910);x.font='18px "Segoe Print", cursive';x.fillText('THE HUNT / INVESTIGATOR’S NOTEBOOK',384,957);
      }
    }else if(kind==='paper'||kind==='timelineLeft'){

      x.textAlign='left';x.fillStyle='#51402d';x.font='19px monospace';x.fillText('THE HUNT / FIELD JOURNAL',82,98);evidenceStamp('CASE / THE HUNT',571,96);x.strokeStyle='#8b7450';x.lineWidth=1;x.beginPath();x.moveTo(82,125);x.lineTo(686,125);x.stroke();
      function wrap(text,font,y,lineHeight,maxWidth=598){x.font=font;let line='';for(const word of String(text).split(' ')){const next=line?line+' '+word:word;if(x.measureText(next).width>maxWidth&&line){x.fillText(line,82,y);y+=lineHeight;line=word}else line=next}if(line)x.fillText(line,82,y);return y+lineHeight}
      function heading(text){x.fillStyle='#25251f';const y=wrap(text,'bold 52px "Segoe Print", "Bradley Hand", cursive',210,66)+24;x.save();x.strokeStyle='#443a28';x.lineWidth=1.4;x.beginPath();x.moveTo(82,231);x.lineTo(346,234);x.stroke();x.restore();return y}
      x.save();x.fillStyle='rgba(172,142,91,.3)';x.translate(721,182);x.rotate(.12);x.fillRect(-6,-14,34,83);x.strokeStyle='#77694e';x.lineWidth=1;x.beginPath();x.moveTo(4,-5);x.lineTo(4,52);x.stroke();x.restore();
      function foot(text,number){x.fillStyle='#64503a';x.font='18px monospace';x.fillText(text,82,966);x.textAlign='right';x.fillText(number,686,966);x.textAlign='left'}
      if(kind==='timelineLeft'||index===1){
        heading(kind==='timelineLeft'?'The timeline':'The final stretch');
        x.fillStyle='#7b4930';wrap(event.timelineStatus,'20px "Segoe Print", cursive',290,25);
        const left=kind==='timelineLeft',start=left?0:3,lineY=525;
        function column(text,cx,y,font,size,width=198){x.font=font;x.textAlign='center';let line='';for(const word of String(text).split(' ')){const next=line?line+' '+word:word;if(x.measureText(next).width>width&&line){x.fillText(line,cx,y);y+=size;line=word}else line=next}if(line)x.fillText(line,cx,y);x.textAlign='left';return y+size}
        const positions=[125,381,637],pinYs=left?[515,538,511]:[533,510,528];
        // A sagging red thread enters/exits both leaves at the same fold height.
        const knots=[[left?45:0,lineY],...positions.map((px,i)=>[px,pinYs[i]]),[left?768:724,lineY]];
        for(const [color,width,dy] of [['rgba(40,20,12,.22)',5,4],['#8d322b',3.2,0],['#c06e53',.7,-1]]){x.strokeStyle=color;x.lineWidth=width;x.beginPath();x.moveTo(knots[0][0],knots[0][1]+dy);for(let j=1;j<knots.length;j++){const p=knots[j-1],q=knots[j];x.quadraticCurveTo((p[0]+q[0])/2,(p[1]+q[1])/2+12+dy,q[0],q[1]+dy)}x.stroke()}
        event.timeline.slice(start,start+3).forEach((entry,i)=>{const cx=positions[i],upper=(start+i)%2===0,cardY=upper?321:602,angle=(i%2?.025:-.027);
          x.save();x.translate(cx,cardY);x.rotate(angle);x.fillStyle='rgba(30,20,10,.16)';x.fillRect(-106+4,6,212,177);x.fillStyle=upper?'#e5d9b7':'#d2c68d';x.fillRect(-106,0,212,177);x.fillStyle='rgba(176,151,94,.42)';x.fillRect(-33,-10,66,25);x.fillStyle='#783d29';column(entry.time,0,39,'bold 27px "Segoe Print", cursive',31,190);x.fillStyle='#25251e';column(entry.title,0,87,'bold 26px "Segoe Print", cursive',34,192);x.restore();
          x.strokeStyle='#8d322b';x.lineWidth=2;x.beginPath();x.moveTo(cx,pinYs[i]);x.lineTo(cx+2,upper?cardY+169:cardY+7);x.stroke();x.fillStyle='#6c3b24';x.beginPath();x.arc(cx,pinYs[i],8,0,Math.PI*2);x.fill();x.fillStyle='#d7b783';x.beginPath();x.arc(cx-2,pinYs[i]-2,3,0,Math.PI*2);x.fill();
          x.fillStyle='#4b3927';column(entry.detail,cx,upper?822:806,'24px "Segoe Print", cursive',31,218);
        });foot('FOLLOW THE EVIDENCE',left?'02':'03');
      }else if(index===0){
        x.save();x.strokeStyle='#8e4734';x.lineWidth=2;x.beginPath();x.ellipse(663,210,33,36,-.2,0,Math.PI*2);x.stroke();x.font='17px "Segoe Print", cursive';x.fillStyle='#754834';x.fillText('start',638,210);x.fillText('here',642,230);x.restore();let y=heading('About us');x.fillStyle='#7b4930';x.font='bold 30px "Segoe Print", cursive';x.fillText('FOLLOW THE EVIDENCE',82,y);y+=73;
        x.fillStyle='#281e15';for(const paragraph of event.about)y=wrap(paragraph,'32px "Segoe Print", "Bradley Hand", cursive',y,48)+30;
        x.fillStyle='#6c4930';y=wrap('Hosted by: '+event.organizer,'25px "Segoe Print", "Bradley Hand", cursive',Math.min(y+16,870),36);foot('IDEAS BECOME PROTOTYPES','01');
      }else if(index===2){
        x.save();x.fillStyle='#b4bd9b';x.translate(634,173);x.rotate(.1);x.fillRect(0,0,79,65);x.font='16px "Segoe Print", cursive';x.fillStyle='#374635';x.fillText('choose',7,26);x.fillText('a path',9,49);x.restore();heading('Domains');x.fillStyle='#7b4930';wrap(event.domainsStatus,'18px monospace',295,25);
        event.domains.slice(0,4).forEach((entry,i)=>{const y=365+i*133;x.fillStyle='#281e15';wrap(String(i+1).padStart(2,'0')+'  '+entry.title,'bold 30px "Segoe Print", "Bradley Hand", cursive',y,41);x.fillStyle='#4b3927';wrap(entry.detail,'28px "Segoe Print", "Bradley Hand", cursive',y+57,36)});foot('CHOOSE YOUR CHALLENGE','04');
      }else{
        x.save();x.strokeStyle='#79613d';x.lineWidth=2;x.beginPath();x.arc(668,195,20,0,Math.PI*2);x.moveTo(668,215);x.lineTo(668,254);x.lineTo(684,254);x.stroke();x.restore();heading('The essentials');const rows=[['PRIZE POOL',event.prizePool],['VENUE',event.venue],['DATE',event.date],['DURATION',event.duration]];
        rows.forEach(([label,value],i)=>{const y=330+i*132;x.fillStyle='#7b4930';x.font='23px "Segoe Print", cursive';x.fillText(label,82,y);x.fillStyle='#281e15';wrap(value,'bold 32px "Segoe Print", "Bradley Hand", cursive',y+52,43)});
        x.fillStyle='#6c4930';wrap(event.registrationUrl?'Register using the link below.':event.registrationLabel,'26px "Segoe Print", "Bradley Hand", cursive',898,35);foot('MAKE YOUR NEXT IDEA REAL','05');
      }
    }

    if(kind==='sigil' && index===2) drawFieldSketch(x);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;if(record && kind!=='cover')paperRecipes.push({map:t,kind,index});return t;
  }
  function relief(kind){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#888';x.fillRect(0,0,512,512);for(let i=0;i<42000;i++){const v=90+Math.floor(random()*85);x.fillStyle='rgb('+v+','+v+','+v+')';const px=random()*512,py=random()*512;x.beginPath();x.ellipse(px,py,kind==='leather'?random()*1.6+.4:random()*3+.5,random()*.8+.3,random()*3,0,Math.PI*2);x.fill()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(kind==='leather'?3:2,4);return t}
  const leatherMap=texture('cover'),blankMap=texture('blank'),sigilMaps=[texture('sigil',0),texture('sigil',1),texture('sigil',2)],timelineLeftMap=texture('timelineLeft'),finalMap=texture('paper',3),paperMaps=Array.from({length:pageCount},(_,i)=>texture('paper',i)),leatherRelief=relief('leather'),paperRelief=relief('paper');
  const leather=new THREE.MeshStandardMaterial({map:leatherMap,bumpMap:leatherRelief,bumpScale:.018,roughnessMap:leatherRelief,roughness:.88,color:0xffffff});
  const ec=document.createElement('canvas');ec.width=512;ec.height=256;const ex=ec.getContext('2d');ex.fillStyle='#bca375';ex.fillRect(0,0,512,256);for(let i=0;i<128;i++){ex.fillStyle=i%3?'rgba(57,34,11,.25)':'rgba(242,216,163,.3)';ex.fillRect(0,i*2,512,.6+random()*.7)}const edgeMap=new THREE.CanvasTexture(ec);edgeMap.colorSpace=THREE.SRGBColorSpace;const edge=new THREE.MeshStandardMaterial({map:edgeMap,bumpMap:edgeMap,bumpScale:.006,roughness:1});
  function mesh(geometry,material,parent=group){const m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
  // Local coordinates: x from hinge to fore-edge, y along spine, z through thickness.
  const W=2.8,H=3.5,T=.42;
  function rounded(w,h,r){const s=new THREE.Shape();s.moveTo(r,0);s.lineTo(w-r,0);s.quadraticCurveTo(w,0,w,r);s.lineTo(w,h-r);s.quadraticCurveTo(w,h,w-r,h);s.lineTo(r,h);s.quadraticCurveTo(0,h,0,h-r);s.lineTo(0,r);s.quadraticCurveTo(0,0,r,0);const g=new THREE.ExtrudeGeometry(s,{depth:.045,bevelEnabled:true,bevelSize:.012,bevelThickness:.008,bevelSegments:6,steps:1,curveSegments:24});g.translate(-w/2,-h/2,-.0225);const uv=g.attributes.uv,p=g.attributes.position;for(let i=0;i<p.count;i++)uv.setXY(i,(p.getX(i)+w/2)/w,(p.getY(i)+h/2)/h);return g}
  const plainPaper=new THREE.MeshStandardMaterial({map:blankMap,bumpMap:paperRelief,bumpScale:.002,roughness:.98,metalness:0,envMapIntensity:.3});
  const stackMaterials=[edge,edge,edge,edge,plainPaper,plainPaper];
  const hiddenStackCap=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false});
  const leftStackMaterials=[edge,edge,edge,edge,hiddenStackCap,plainPaper];
  const rightWing=new THREE.Group(),leftWing=new THREE.Group();group.add(rightWing,leftWing);
  const back=mesh(rounded(W,H,.09),leather,rightWing);back.position.set(W/2,0,-T/2);
  function stackGeometry(w,h,d){const g=new THREE.BoxGeometry(w,h,d);const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;for(let i=0;i<p.count;i++){if(Math.abs(n.getX(i))>.5)uv.setXY(i,p.getY(i)/h+.5,p.getZ(i)/d+.5);else if(Math.abs(n.getY(i))>.5)uv.setXY(i,p.getX(i)/w+.5,p.getZ(i)/d+.5)}return g}
  const block=mesh(stackGeometry(W-.05,H-.1,.22),stackMaterials,rightWing);block.position.set(W/2,0,-.065);
  const leftStack=mesh(stackGeometry(W-.07,H-.11,1),leftStackMaterials,leftWing);leftStack.position.set(-W/2,0,T/2+.035);leftStack.scale.z=.001;leftStack.visible=false;leftStack.castShadow=false;
  // A readable fixed final recto stays on the right when the last leaf turns.
  const finalRecto=mesh(new THREE.PlaneGeometry(W-.07,H-.11),new THREE.MeshStandardMaterial({map:finalMap,bumpMap:paperRelief,bumpScale:.002,roughness:.98}),rightWing);finalRecto.position.set(W/2,0,-.175);
  const spine=mesh(new THREE.CylinderGeometry(.15,.15,H,48),new THREE.MeshStandardMaterial({color:0x52321e,roughness:.95}));spine.position.x=.015;
  const gutterMaterial=new THREE.MeshStandardMaterial({color:0x302216,roughness:.95,bumpMap:leatherRelief,bumpScale:.007});
  const gutter=mesh(new THREE.CylinderGeometry(.035,.035,H-.14,32),gutterMaterial);gutter.position.set(.005,0,T/2+.008);
  for(const x of [-.027,.027]){const fold=mesh(new THREE.CylinderGeometry(.015,.015,H-.16,24),new THREE.MeshStandardMaterial({color:0x65513a,roughness:.92}));fold.position.set(x,0,T/2+.012)}
  const cover=new THREE.Group();group.add(cover);cover.position.z=T/2;
  const coverMesh=mesh(rounded(W,H,.09),[leather,leather],cover);coverMesh.position.x=W/2;
  const liningMaterial=new THREE.MeshStandardMaterial({map:sigilMaps[0],color:0xd9c7a3,bumpMap:paperRelief,bumpScale:.008,roughness:1,side:THREE.BackSide});
  const liningGeometry=new THREE.PlaneGeometry(W-.12,H-.12);
  const liningUV=liningGeometry.attributes.uv;for(let i=0;i<liningUV.count;i++)liningUV.setX(i,1-liningUV.getX(i));
  const lining=mesh(liningGeometry,liningMaterial,cover);lining.position.set(W/2,0,-.032);
  // Raised metal seal, inset star and worn stitching.
  const metal=new THREE.MeshStandardMaterial({color:0x8e8068,metalness:.85,roughness:.65,roughnessMap:leatherRelief,bumpMap:leatherRelief,bumpScale:.003});
  const seal=mesh(new THREE.CylinderGeometry(.48,.48,.025,64),metal,cover);seal.rotation.x=Math.PI/2;seal.position.set(W/2,.43,.065);
  const ring=mesh(new THREE.TorusGeometry(.45,.012,8,64),metal,cover);ring.position.set(W/2,.43,.085);
  // Aged binder hardware and a fabric index ribbon catch the desk-lamp light.
  for(const y of [-1.25,-.62,0,.62,1.25]){const binder=mesh(new THREE.TorusGeometry(.095,.017,8,24),metal);binder.rotation.x=Math.PI/2;binder.position.set(.018,y,.27)}
  const ribbon=mesh(new THREE.BoxGeometry(.09,.66,.012),new THREE.MeshStandardMaterial({color:0x733b2d,roughness:1}),rightWing);ribbon.position.set(W*.78,-H/2-.18,-T/2+.03);ribbon.rotation.z=.07;
  for(let i=0;i<5;i++){const a=-Math.PI/2+i*4*Math.PI/5,b=a+4*Math.PI/5;const p=new THREE.Vector3(W/2+Math.cos(a)*.39,.43-Math.sin(a)*.39,.095),q=new THREE.Vector3(W/2+Math.cos(b)*.39,.43-Math.sin(b)*.39,.095);mesh(new THREE.TubeGeometry(new THREE.LineCurve3(p,q),1,.008,6,false),metal,cover)}
  // Raised ribs, frayed headbands and small tarnished corner guards.
  for(const y of [-1.3,-.7,.7,1.3]){const rib=mesh(new THREE.TorusGeometry(.151,.012,12,48),new THREE.MeshStandardMaterial({color:0x684128,roughness:.87}));rib.rotation.x=Math.PI/2;rib.position.set(.015,y,0)}
  for(const sign of [-1,1]){
    const corner=mesh(new THREE.BoxGeometry(.19,.035,.075),metal,cover);corner.position.set(W-.12,sign*(H/2-.036),.003);corner.rotation.z=sign*.03;
    const nib=mesh(new THREE.BoxGeometry(.035,.16,.075),metal,cover);nib.position.set(W-.038,sign*(H/2-.10),.003);
  }
    const clasp=new THREE.Group();cover.add(clasp);clasp.position.set(W,-.65,.035);const strap=mesh(new THREE.BoxGeometry(.52,.32,.065),new THREE.MeshStandardMaterial({color:0x604126,roughness:.85}),clasp);strap.position.x=-.14;
  const rivet=mesh(new THREE.SphereGeometry(.055,16,8),new THREE.MeshStandardMaterial({color:0x9c875c,metalness:.8,roughness:.48}),clasp);rivet.position.set(-.2,0,.065);
  for(let i=pageCount-1;i>=0;i--){const pivot=new THREE.Group();group.add(pivot);pivot.position.z=T/2-.04-i*.013;
    const geo=new THREE.PlaneGeometry(W-.07,H-.11,96,16);geo.translate((W-.07)/2,0,0);
    const mat=new THREE.MeshStandardMaterial({map:paperMaps[i],side:THREE.FrontSide,shadowSide:THREE.DoubleSide,roughness:.98,metalness:0,envMapIntensity:.3,bumpMap:paperRelief,bumpScale:.002});
    const sheet=mesh(geo,mat,pivot);const rest=geo.attributes.position.array.slice();const reverseGeo=geo.clone();const reverseUV=reverseGeo.attributes.uv;for(let j=0;j<reverseUV.count;j++)reverseUV.setX(j,1-reverseUV.getX(j));const reverse=mesh(reverseGeo,new THREE.MeshStandardMaterial({map:i===0?timelineLeftMap:sigilMaps[i%3],side:THREE.BackSide,roughness:.98,metalness:0,envMapIntensity:.3,bumpMap:paperRelief,bumpScale:.002}),pivot);// One shadow caster per sheet avoids coincident front/back shadow artifacts.
    reverse.castShadow=false;
    const perimeter=[];for(let col=0;col<97;col++)perimeter.push(col);for(let row=1;row<17;row++)perimeter.push(row*97+96);for(let col=95;col>=0;col--)perimeter.push(16*97+col);for(let row=15;row>0;row--)perimeter.push(row*97);
    const rimGeometry=new THREE.BufferGeometry(),rimPositions=new Float32Array((perimeter.length+1)*6),rimIndex=[];for(let j=0;j<perimeter.length;j++){const v=j*2;rimIndex.push(v,v+1,v+2,v+1,v+3,v+2)}rimGeometry.setAttribute('position',new THREE.BufferAttribute(rimPositions,3));rimGeometry.setIndex(rimIndex);
    const rim=mesh(rimGeometry,new THREE.MeshStandardMaterial({color:0xbeaa83,roughness:1,side:THREE.DoubleSide}),pivot);rim.castShadow=false;
    pages[i]={pivot,sheet,reverse,rest,rim,perimeter};springs[i]={x:0,v:0};
  }
  const view={position:new THREE.Vector3(6,7,10),quaternion:new THREE.Quaternion(),fov:38,aspect:16/9};const aim=new THREE.Object3D();aim.position.copy(view.position);aim.lookAt(0,1.5,0);view.quaternion.copy(aim.quaternion);view.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI));const resting=new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,-.10));const readingTilt=new THREE.Quaternion().setFromEuler(new THREE.Euler(-.08,.10,0));const readingPose=new THREE.Quaternion();const pose=new THREE.Quaternion(),center=new THREE.Vector3(),offset=new THREE.Vector3();const bridgeGeo=new THREE.BufferGeometry();const bridgePositions=new Float32Array(18);bridgeGeo.setAttribute('position',new THREE.BufferAttribute(bridgePositions,3));const bridgeIndex=[0,1,2,1,3,2,2,3,4,3,5,4];bridgeGeo.setIndex(bridgeIndex);const timelineBridge=mesh(bridgeGeo,new THREE.MeshStandardMaterial({color:0x8d322b,roughness:1,side:THREE.DoubleSide,transparent:true,opacity:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}),group);timelineBridge.castShadow=false;let progress=0;const lift={x:0,v:0},lid={x:0,v:0};const clamp=x=>Math.max(0,Math.min(1,x));const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
  function spring(s,target,dt,k=100,d=20){const a=k*(target-s.x)-d*s.v;s.v+=a*dt;s.x+=s.v*dt}
  function update(dt){dt=Math.min(Math.max(dt||0,0),.08);const steps=Math.max(1,Math.ceil(dt/(1/120))),h=dt/steps;
    for(let n=0;n<steps;n++){spring(lift,ease(progress/.18),h,70,18);spring(lid,ease((progress-.22)/.14),h,75,18);springs.forEach((s,i)=>spring(s,ease((progress-([.44,.65,.84][i]??.84))/.075),h,85,18))}
    // Fly along the fixed camera's viewing direction. No camera animation.
    const vTan=Math.tan(THREE.MathUtils.degToRad(view.fov/2));
    // Spread fits inside 92% of viewport width and 86% of height.
    const distance=Math.max(4.05/(2*vTan*(mobileView ? .70 : .83)),(mobileView?3.05:6.05)/(2*vTan*view.aspect*.91));
    center.set(mobileView?-1.32*clamp(lid.x):0,mobileView?distance*vTan*.20:distance*vTan*.03,-distance).applyQuaternion(view.quaternion).add(view.position);
    readingPose.copy(view.quaternion).multiply(new THREE.Quaternion().slerp(readingTilt,clamp(lid.x)));pose.copy(resting).slerp(readingPose,ease((progress-.20)/.16));
    const localCenter=W/2*(1-clamp(lid.x));offset.set(localCenter,0,0).applyQuaternion(pose);
    const amount=clamp(lift.x);
    group.scale.setScalar(THREE.MathUtils.lerp(tableScale,1,amount));
    offset.multiplyScalar(group.scale.x);
    group.position.copy(restCenter).lerp(center,amount).sub(offset);group.quaternion.copy(pose);
    const opening=clamp(lid.x),wingAngle=opening*.22;
    // 155-degree opening: each side rises 12.6 degrees from the center gutter.
    rightWing.rotation.y=-wingAngle;leftWing.rotation.y=wingAngle;
    cover.rotation.y=-opening*(Math.PI-.22);clasp.rotation.y=ease((progress-.15)/.1)*1.7;
    let turned=0,landed=0;
    pages.forEach(({pivot,sheet,reverse,rest,rim,perimeter},i)=>{
      const s=springs[i],t=clamp(s.x);turned+=t;landed+=ease((t-.94)/.06);const wave=Math.sin(t*Math.PI),width=W-.07;
      // Integrate tangent angles across each row: preserves strip arc length.
      // The leading corner peels first; curvature travels toward the binding.
      const a=sheet.geometry.attributes.position,b=reverse.geometry.attributes.position;
      for(let row=0;row<17;row++){let px=0,pz=0;const y=rest[row*97*3+1];for(let col=0;col<97;col++){
        const u=col/96;const lag=wave*.92*Math.sin(u*Math.PI*.9);const corner=wave*.20*(y/(H/2))*u*u;
        const angle=-wingAngle-t*(Math.PI-2*wingAngle)+lag+corner;
        if(col){const step=width/96;px+=Math.cos(angle)*step;pz-=Math.sin(angle)*step}
        const j=row*97+col;const wear=.0007*Math.sin(u*5+i*.7+y*2)*u+.010*Math.sin(u*Math.PI)*(1-wave*.7);
        // Front/back occupy the same surface and are mutually exclusive by face culling.
        // World-Z offsets invert as the sheet turns and caused self-shadow bands.
        a.setXYZ(j,px,y,pz+wear);b.setXYZ(j,px,y,pz+wear);
      }}
      pivot.rotation.y=0;
      // Settled pages accumulate on the opposite side of the spine.
      pivot.position.z=T/2-.04-i*.013+t*(i*.026+.095);
      a.needsUpdate=b.needsUpdate=true;sheet.geometry.computeVertexNormals();reverse.geometry.computeVertexNormals();sheet.geometry.computeBoundingSphere();reverse.geometry.computeBoundingSphere();
      const normals=sheet.geometry.attributes.normal,rp=rim.geometry.attributes.position;for(let j=0;j<=perimeter.length;j++){const source=perimeter[j%perimeter.length];for(let side=0;side<2;side++){const sign=side?-.0018:.0018;rp.setXYZ(j*2+side,a.getX(source)+normals.getX(source)*sign,a.getY(source)+normals.getY(source)*sign,a.getZ(source)+normals.getZ(source)*sign)}}rp.needsUpdate=true;rim.geometry.computeVertexNormals();rim.geometry.computeBoundingSphere();
    });
    block.scale.z=Math.max(.08,1-turned/pageCount*.86);
    block.position.z=-T/2+.035+.22*block.scale.z/2;
    finalRecto.position.z=block.position.z+.22*block.scale.z/2+.001;
    leftStack.visible=landed>.01;leftStack.scale.z=Math.max(.001,landed*.013);
    leftStack.position.z=T/2+.035+leftStack.scale.z/2;
    const showTimeline=(springs[0]?.x>.985)&&(springs[1]?.x<.015);timelineBridge.visible=showTimeline;
    if(showTimeline){const y=(.5-525/1024)*(H-.11),bp=bridgeGeo.attributes.position;const zl=pages[0].pivot.position.z,zr=pages[1].pivot.position.z;const points=[[-.055,zl+.055*Math.sin(wingAngle)+.002],[0,(zl+zr)/2],[.055,zr+.055*Math.sin(wingAngle)+.002]];points.forEach(([x,z],i)=>{bp.setXYZ(i*2,x,y-.009,z);bp.setXYZ(i*2+1,x,y+.009,z)});bp.needsUpdate=true;bridgeGeo.computeVertexNormals();bridgeGeo.computeBoundingSphere();timelineBridge.material.opacity=1;}
  }
  update(0);
  return {group,setView(camera){view.position.copy(camera.position);view.quaternion.copy(camera.quaternion);view.fov=camera.fov;view.aspect=camera.aspect},setRestPose(point,scale,mobile){restCenter.copy(point);tableScale=scale;mobileView=mobile;resting.setFromEuler(new THREE.Euler(-1.0,.25,.28,'ZYX'))},setProgress(value){progress=clamp(Number(value)||0)},update,dispose(){const gs=new Set(),ms=new Set(),ts=new Set();group.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{ms.add(m);for(const key of ['map','bumpMap','roughnessMap'])if(m[key])ts.add(m[key])})});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());group.removeFromParent()}};
}
