import { copy } from '../../data/content'
import * as THREE from 'three';
import { EVIDENCE_ATLAS, SKETCH_ATLAS, paintEvidencePhoto, paintFieldSketch } from '../../scenes/bunker/EvidencePhotos.mjs';
import { hackathon } from './hackathon-data.mjs';

/** Supplied bundle geometry, with local journal reference textures. */
export function createOccultBook({pageCount=3, approach=3.5, event=hackathon, onTextureReady=()=>{}}={}) {
  pageCount=Math.max(2,Math.min(16,Math.floor(pageCount)||6));
  const group=new THREE.Group(), pages=[], springs=[];
  // Keep textures owned by the factory so the shared canvas can dispose them.
  const referenceCover=new Image();referenceCover.src='/s03/textures/gothic-cover.webp';
  referenceCover.onload=()=>{
    const c=leatherMap.image,x=c.getContext('2d');
    x.setTransform(1,0,0,1,0,0);
    x.drawImage(referenceCover,0,0,referenceCover.width,referenceCover.height,0,0,c.width,c.height);leatherMap.needsUpdate=true;
    // The supplied photograph already contains its metal badge.
    cover.traverse(o=>{if(['CylinderGeometry','TorusGeometry','TubeGeometry'].includes(o.geometry?.type))o.visible=false});
    onTextureReady();
  };
  const referencePages=new Image();referencePages.src='/s03/textures/supplied-aged-pages.jpg';
  referencePages.onload=()=>onTextureReady();
  group.addEventListener('removed',()=>{referenceCover.onload=null;referencePages.onload=null});
  const gothicReference=new Image();gothicReference.src=EVIDENCE_ATLAS;
  const sketchReference=new Image();sketchReference.src=SKETCH_ATLAS;
  const paperReference=new Image(), paperRecipes=[];
  paperReference.onload=()=>{for(const {map,kind,index} of paperRecipes){const replacement=texture(kind,index,false);map.image=replacement.image;map.needsUpdate=true;replacement.dispose()}onTextureReady()};paperReference.src='/s03/textures/ancient-paper.webp';
  gothicReference.onload=()=>paperReference.onload?.();
  sketchReference.onload=()=>paperReference.onload?.();
  group.addEventListener('removed',()=>{paperReference.onload=null;gothicReference.onload=null});
  let seed=13;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const restCenter=new THREE.Vector3(0,.16,0);let tableScale=1,mobileView=false;
  function texture(kind,index=0,record=true){
    const c=document.createElement('canvas');c.width=1536;c.height=2048;const x=c.getContext('2d');x.scale(2,2);let freeInk=0;
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
      x.textAlign='center';x.fillStyle='#d1aa77';x.font='19px monospace';x.fillText(copy("SUPERNATURAL INVESTIGATIONS"),384,115);
      // Physical seal is separate geometry; avoid a second printed medallion.
      x.fillStyle='#26190f';x.shadowColor='#bb916b';x.shadowOffsetY=1;x.font='bold 86px Georgia';x.fillText(event.name,384,750);x.font='28px monospace';x.fillText(copy("DJS ISACA / FIELD JOURNAL"),384,817);x.shadowOffsetY=0;
      x.save();x.translate(384,899);x.rotate(-.045);x.strokeStyle='#3d2118';x.strokeRect(-170,-38,340,64);x.font='23px monospace';x.fillText(copy("BUILD / CREATE / SHIP"),0,4);x.restore();
      for(let i=0;i<45;i++){x.strokeStyle='rgba(218,178,125,.09)';x.lineWidth=.6;x.beginPath();const px=random()*768,py=random()*1024;x.moveTo(px,py);x.lineTo(px+random()*100-50,py+random()*28);x.stroke()}
    }else if(kind==='sigil'){
      paintFieldSketch(x,sketchReference,index,100,165,565,565);
      if(index%2===0)paintEvidencePhoto(x,gothicReference,index+1,450,740,190,220,.045);
      evidenceStamp(copy('EVIDENCE / 0')+(index+1),390,105);
      x.textAlign='center';x.fillStyle='#5a3a29';x.font='italic 24px Georgia';x.fillText(copy('Every symbol leaves a trace.'),384,956);
    }else if(kind==='paper'||kind==='timelineLeft'){

      x.textAlign='left';x.fillStyle='#51402d';x.font='19px monospace';x.fillText(copy("THE HUNT / FIELD JOURNAL"),82,98);evidenceStamp(copy("CASE / THE HUNT"),571,96);x.strokeStyle='#8b7450';x.lineWidth=1;x.beginPath();x.moveTo(82,125);x.lineTo(686,125);x.stroke();
      function wrap(text,font,y,lineHeight,maxWidth=598){x.font=font;let line='';for(const word of String(text).split(' ')){const next=line?line+' '+word:word;if(x.measureText(next).width>maxWidth&&line){x.fillText(line,82,y);y+=lineHeight;line=word}else line=next}if(line)x.fillText(line,82,y);return y+lineHeight}
      function heading(text){x.fillStyle='#25251f';const y=wrap(text,'bold 52px "Segoe Print", "Bradley Hand", cursive',210,66)+24;x.save();x.strokeStyle='#443a28';x.lineWidth=1.4;x.beginPath();x.moveTo(82,231);x.lineTo(346,234);x.stroke();x.restore();return y}
      x.save();x.fillStyle='rgba(172,142,91,.3)';x.translate(721,182);x.rotate(.12);x.fillRect(-6,-14,34,83);x.strokeStyle='#77694e';x.lineWidth=1;x.beginPath();x.moveTo(4,-5);x.lineTo(4,52);x.stroke();x.restore();
      function foot(text,number){x.fillStyle='#64503a';x.font='18px monospace';x.fillText(text,82,966);x.textAlign='right';x.fillText(number,686,966);x.textAlign='left'}
      if(kind==='timelineLeft'||index===1){
        heading(kind==='timelineLeft'?copy("The timeline"):copy("The final stretch"));
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
        });foot(copy("FOLLOW THE EVIDENCE"),left?'02':'03');
      }else if(index===0){
        x.save();x.strokeStyle='#8e4734';x.lineWidth=2;x.beginPath();x.ellipse(663,210,33,36,-.2,0,Math.PI*2);x.stroke();x.font='17px "Segoe Print", cursive';x.fillStyle='#754834';x.fillText(copy("start"),638,210);x.fillText(copy("here"),642,230);x.restore();let y=heading(copy("About us"));x.fillStyle='#7b4930';x.font='bold 30px "Segoe Print", cursive';x.fillText(copy("FOLLOW THE EVIDENCE"),82,y);y+=73;
        x.fillStyle='#281e15';for(const paragraph of event.about)y=wrap(paragraph,'32px "Segoe Print", "Bradley Hand", cursive',y,48)+30;
        x.fillStyle='#6c4930';y=wrap(copy("Hosted by: ")+event.organizer,'25px "Segoe Print", "Bradley Hand", cursive',Math.min(y+16,870),36);freeInk=y;foot(copy("IDEAS BECOME PROTOTYPES"),'01');
      }else if(index===2){
        x.save();x.fillStyle='#b4bd9b';x.translate(634,173);x.rotate(.1);x.fillRect(0,0,79,65);x.font='16px "Segoe Print", cursive';x.fillStyle='#374635';x.fillText(copy("choose"),7,26);x.fillText(copy("a path"),9,49);x.restore();heading(copy("Domains"));x.fillStyle='#7b4930';wrap(event.domainsStatus,'18px monospace',295,25);
        event.domains.slice(0,4).forEach((entry,i)=>{const y=365+i*133;x.fillStyle='#281e15';wrap(String(i+1).padStart(2,'0')+'  '+entry.title,'bold 30px "Segoe Print", "Bradley Hand", cursive',y,41);x.fillStyle='#4b3927';wrap(entry.detail,'28px "Segoe Print", "Bradley Hand", cursive',y+57,36)});freeInk=340+event.domains.length*133;foot(copy("CHOOSE YOUR CHALLENGE"),'04');
      }else{
        x.save();x.strokeStyle='#79613d';x.lineWidth=2;x.beginPath();x.arc(668,195,20,0,Math.PI*2);x.moveTo(668,215);x.lineTo(668,254);x.lineTo(684,254);x.stroke();x.restore();heading(copy("The essentials"));const rows=[[copy("PRIZE POOL"),event.prizePool],[copy("VENUE"),event.venue],[copy("DATE"),event.date],[copy("DURATION"),event.duration]];
        rows.forEach(([label,value],i)=>{const y=330+i*132;x.fillStyle='#7b4930';x.font='23px "Segoe Print", cursive';x.fillText(label,82,y);x.fillStyle='#281e15';wrap(value,'bold 32px "Segoe Print", "Bradley Hand", cursive',y+52,43)});
        x.fillStyle='#6c4930';wrap(event.registrationUrl?copy("Register using the link below."):event.registrationLabel,'26px "Segoe Print", "Bradley Hand", cursive',898,35);foot(copy("MAKE YOUR NEXT IDEA REAL"),'05');
      }
    }


    if(kind!=='cover' && kind!=='sigil' && gothicReference.complete && gothicReference.naturalWidth){
      if(freeInk>0&&freeInk<800){
        const h=Math.min(190,920-freeInk-20);
        paintEvidencePhoto(x,gothicReference,index,90,freeInk+18,220,h,-.035);
        paintEvidencePhoto(x,gothicReference,index+3,425,freeInk+18,220,h,.04);
      }
      paintEvidencePhoto(x,gothicReference,index+2,656,20,72,63,.045);
    }
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;if(record && kind!=='cover')paperRecipes.push({map:t,kind,index});return t;
  }
  function relief(kind){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#888';x.fillRect(0,0,512,512);for(let i=0;i<42000;i++){const v=90+Math.floor(random()*85);x.fillStyle='rgb('+v+','+v+','+v+')';const px=random()*512,py=random()*512;x.beginPath();x.ellipse(px,py,kind==='leather'?random()*1.6+.4:random()*3+.5,random()*.8+.3,random()*3,0,Math.PI*2);x.fill()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(kind==='leather'?3:2,4);return t}
  const leatherMap=texture('cover'),blankMap=texture('blank'),sigilMaps=[texture('sigil',0),texture('sigil',1),texture('sigil',2)],timelineLeftMap=texture('timelineLeft'),finalMap=texture('paper',3),paperMaps=Array.from({length:pageCount},(_,i)=>texture('paper',i)),leatherRelief=relief('leather'),paperRelief=relief('paper');
  const leather=new THREE.MeshStandardMaterial({map:leatherMap,bumpMap:leatherMap,bumpScale:.028,roughnessMap:leatherRelief,roughness:.88,color:0xffffff});
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
  return {group,ready:Promise.all([referenceCover.decode(),referencePages.decode(),paperReference.decode(),gothicReference.decode()]).then(()=>{referenceCover.onload?.();referencePages.onload?.();paperReference.onload?.()}),setView(camera){view.position.copy(camera.position);view.quaternion.copy(camera.quaternion);view.fov=camera.fov;view.aspect=camera.aspect},setRestPose(point,scale,mobile){restCenter.copy(point);tableScale=scale;mobileView=mobile;resting.setFromEuler(new THREE.Euler(-1.0,.25,.28,'ZYX'))},setProgress(value){progress=clamp(Number(value)||0)},update,dispose(){const gs=new Set(),ms=new Set(),ts=new Set();group.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{ms.add(m);for(const key of ['map','bumpMap','roughnessMap'])if(m[key])ts.add(m[key])})});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());group.removeFromParent()}};
}
