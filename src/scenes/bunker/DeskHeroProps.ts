import { ShaderMaterial, Material, Box3, BufferGeometry, CanvasTexture, CylinderGeometry, CatmullRomCurve3, OctahedronGeometry, TubeGeometry, Float32BufferAttribute, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, SphereGeometry, SRGBColorSpace, TextureLoader, TorusGeometry, Vector3 } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { event } from '../../data/event'
import { siteContent } from '../../data/content'
import { copy } from '../../data/content'

/** Real geometry shares the desk light and casts its own contact shadows. */
export function createDeskHeroProps(redraw: () => void) {
  const group = new Group(), television = new Group(), sword = new Group(), skull = new Group()
  group.add(television, sword, skull)
  const resources: { dispose(): void }[] = [], loader = new TextureLoader(), pending: Promise<unknown>[] = []
  const texture = (name: string, color = false) => {
    const t = loader.load(`/s03/props/3d/${name}`, redraw); if (color) t.colorSpace = SRGBColorSpace
    t.wrapS = t.wrapT = RepeatWrapping; t.anisotropy = 8; resources.push(t); return t
  }
  const engraving = texture('sword-engraving.webp',true); engraving.repeat.set(.35,1.6)
  const boneSurface = texture('skull-cracks.jpg',true)
  const metal = new MeshStandardMaterial({ color:'#e2ded4', emissive:'#463f32', emissiveIntensity:.10, map:engraving, bumpMap:engraving, bumpScale:.012, roughnessMap:texture('metal_plate-rough.webp'), metalness:.32, roughness:.40 })
  const leather = new MeshStandardMaterial({ map:texture('brown_leather-diff.webp',true), normalMap:texture('brown_leather-nor_gl.webp'), roughness:.92, color:'#493323' })
  const brass = new MeshStandardMaterial({ color:'#9c7540', metalness:.78, roughness:.46 })
  resources.push(metal, leather, brass)
  const mesh = (parent: Group, geo: BufferGeometry, material: Material, x=0,y=0,z=0) => {
    const object = new Mesh(geo,material); object.position.set(x,y,z); object.castShadow=object.receiveShadow=true; parent.add(object); resources.push(geo); return object
  }
  // Lenticular blade: the ridge catches a different highlight from each bevel.
  const blade = new BufferGeometry(); const p:number[]=[]
  const faces = [[[-.16,0,.55],[0,.07,.55],[0,.04,4.4]],[[0,.07,.55],[.16,0,.55],[0,.04,4.4]],[[-.16,0,.55],[0,.04,4.4],[0,-.04,.55]],[[.16,0,.55],[0,-.04,.55],[0,.04,4.4]]]
  faces.flat().forEach(v=>p.push(...v)); blade.setAttribute('position',new Float32BufferAttribute(p,3)); const uv:number[]=[]; for(let i=0;i<p.length;i+=3)uv.push((p[i]+.16)/.32,(p[i+2]-.55)/3.85); blade.setAttribute('uv',new Float32BufferAttribute(uv,2)); blade.computeVertexNormals(); mesh(sword,blade,metal)
  // Curved silver quillons and inset garnets echo the supplied gothic sword.
  const gem = new MeshStandardMaterial({color:'#650d1c',metalness:.35,roughness:.22});resources.push(gem)
  for(const sign of [-1,1]){
    const curve=new CatmullRomCurve3([new Vector3(0,0,.5),new Vector3(sign*.32,.01,.45),new Vector3(sign*.65,.02,.32),new Vector3(sign*.83,.02,.52)])
    mesh(sword,new TubeGeometry(curve,24,.055,8,false),metal)
    const finial=mesh(sword,new OctahedronGeometry(.105),metal,sign*.83,.02,.52);finial.scale.set(.7,.6,1.5)
  }
  const mount=mesh(sword,new SphereGeometry(.20,24,16),metal,0,0,.48);mount.scale.set(1,.45,1.25)
  const jewel=mesh(sword,new OctahedronGeometry(.13),gem,0,.09,.48);jewel.scale.set(.8,.55,1.3)
  const grip = mesh(sword,new CylinderGeometry(.11,.10,1,20),leather,0,0,-.06); grip.rotation.x=Math.PI/2
  mesh(sword,new SphereGeometry(.16,24,16),brass,0,0,-.65)
  for(let i=0;i<8;i++){const wrap=mesh(sword,new TorusGeometry(.112,.012,6,24),brass,0,0,-.46+i*.11); wrap.rotation.x=0}
  sword.rotation.set(.02,0,0); sword.position.set(-4.6,-1.79,-1.4)
  const loadModel = (url: string, parent: Group, width: number, bone=false) => new GLTFLoader().loadAsync(url).then(({scene})=>{
    const bounds=new Box3().setFromObject(scene), size=bounds.getSize(new Vector3()), center=bounds.getCenter(new Vector3()), s=width/size.x
    scene.position.set(-center.x*s,-bounds.min.y*s,-center.z*s); scene.scale.setScalar(s)
    scene.traverse(o=>{if(o instanceof Mesh){o.castShadow=o.receiveShadow=true; resources.push(o.geometry); if(bone){o.material=new MeshStandardMaterial({color:'#c3b89d',map:boneSurface,bumpMap:boneSurface,bumpScale:.018,roughness:.91}); resources.push(o.material)}else{const mats=Array.isArray(o.material)?o.material:[o.material]; mats.forEach(m=>{resources.push(m); for(const v of Object.values(m))if(v&&typeof v==='object'&&'isTexture' in v){resources.push(v as unknown as {dispose():void})}})}}})
    parent.add(scene); if(parent===television) fitGlass(scene,bounds,s); redraw()
  })
  pending.push(loadModel('/s03/props/3d/tv/television.gltf',television,3.5))
  pending.push(loadModel('/s03/props/3d/skull.glb',skull,1.5,true))
  skull.position.set(-5.55,-1.86,-3.8); skull.rotation.y=.25
  // Screen stays part of the model. Before approach it shows only the event/college.
  const screenCanvas=document.createElement('canvas');screenCanvas.width=2048;screenCanvas.height=1536
  const screenTexture=new CanvasTexture(screenCanvas);screenTexture.colorSpace=SRGBColorSpace;screenTexture.anisotropy=8;resources.push(screenTexture)
  const screenMat=new ShaderMaterial({
    uniforms:{display:{value:screenTexture},time:{value:0},boot:{value:1}},
    vertexShader:`varying vec2 screenUV; void main(){screenUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`uniform sampler2D display;uniform float time;uniform float boot;varying vec2 screenUV;
      void main(){
        vec2 uv=screenUV;float edge=smoothstep(0.,.025,uv.x)*smoothstep(0.,.025,1.-uv.x)*smoothstep(0.,.025,uv.y)*smoothstep(0.,.025,1.-uv.y);
        float startup=1.-smoothstep(.1,.9,boot);
        uv.x+=sin(uv.y*52.+time*14.)*.0015*startup;
        vec3 ink=texture2D(display,uv).rgb;
        float lines=.94+.06*sin(uv.y*1536.);
        float roll=exp(-pow((fract(uv.y-time*.07)-.5)*18.,2.))*.025;
        float grain=fract(sin(dot(floor(uv*vec2(1024.,768.)),vec2(12.9898,78.233))+floor(time*18.))*43758.5453);
        float opening=smoothstep(0.,.07,boot-abs(uv.y-.5)*.8);
        vec3 color=ink*lines*(.99+.01*sin(time*17.))+vec3(roll+grain*.012);
        color=mix(vec3(.95,.67,.28)*exp(-pow((uv.y-.5)*150.,2.)),color,opening);
        gl_FragColor=vec4(color,edge);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,transparent:true,toneMapped:false});resources.push(screenMat)
  const screen=mesh(television,new PlaneGeometry(2.25,1.70,24,24),screenMat,-.32,1.59,1.40);screen.castShadow=false
  function fitGlass(model:Group,bounds:Box3,s:number){
    const positions:number[]=[],normals:number[]=[],uv:number[]=[]
    const left=-.2571352124,right=.1263319254,bottom=.1141470522,top=.4042328596
    const cx=(left+right)/2,cy=(bottom+top)/2,center=bounds.getCenter(new Vector3()),edgeDepth=(.1682196856-center.z)*s
    model.traverse(object=>{
      if(!(object instanceof Mesh))return
      const geo=object.geometry,position=geo.attributes.position,normal=geo.attributes.normal,index=geo.index
      if(!position||!normal||!index)return
      for(let i=0;i<index.count;i+=3){
        const ids=[index.getX(i),index.getX(i+1),index.getX(i+2)]
        if(!ids.every(k=>position.getX(k)>-.258&&position.getX(k)<.127&&position.getY(k)>.10&&position.getY(k)<.405&&position.getZ(k)>.16&&position.getZ(k)<.20&&normal.getZ(k)>.8))continue
        for(const k of ids){
          positions.push((position.getX(k)-cx)*s,(position.getY(k)-cy)*s,(position.getZ(k)-center.z)*s-edgeDepth+.003)
          normals.push(normal.getX(k),normal.getY(k),normal.getZ(k))
          uv.push((position.getX(k)-left)/(right-left),(position.getY(k)-bottom)/(top-bottom))
        }
      }
    })
    if(!positions.length)throw new Error('TV glass surface is missing')
    const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new Float32BufferAttribute(uv,2));geometry.computeBoundingSphere();resources.push(geometry)
    screen.geometry=geometry;screen.position.set((cx-center.x)*s,(cy-bounds.min.y)*s,edgeDepth);screen.receiveShadow=false;screen.renderOrder=1
    const glassMaterial=new MeshPhysicalMaterial({color:'#b7c9be',transparent:true,opacity:.075,roughness:.21,metalness:0,clearcoat:1,clearcoatRoughness:.12,depthWrite:false});resources.push(glassMaterial)
    const glassGeometry=geometry.clone();glassGeometry.translate(0,0,.002);const glass=mesh(television,glassGeometry,glassMaterial);glass.position.copy(screen.position);glass.castShadow=glass.receiveShadow=false;glass.renderOrder=2
  }
  const paintScreen=(broadcast:boolean)=>{
    const x=screenCanvas.getContext('2d')!;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,2048,1536);x.scale(2,2)
    x.save();x.beginPath();x.roundRect(0,0,1024,768,65);x.clip();x.fillStyle='#160806';x.fillRect(0,0,1024,768)
    const phosphor=x.createRadialGradient(460,330,40,512,384,660);phosphor.addColorStop(0,'#542211');phosphor.addColorStop(1,'#0b0302');x.fillStyle=phosphor;x.fillRect(0,0,1024,768)
    x.fillStyle='#f3d594';x.textAlign='center';x.shadowColor='#eab95b';x.shadowBlur=2
    const line=(text:string,y:number,font:string)=>{x.font=font; let size=Number(font.match(/(\d+)px/)?.[1] ?? 24); while(x.measureText(text).width>860 && size>16){size--;x.font=font.replace(/\d+px/,`${size}px`)} x.fillText(text,512,y)}
    const wrap=(text:string,y:number,size:number,maxWidth=880)=>{x.font=`${size}px Georgia`;let row='';for(const word of text.split(' ')){const next=row?row+' '+word:word;if(x.measureText(next).width>maxWidth&&row){x.fillText(row,512,y);y+=size*1.3;row=word}else row=next}x.fillText(row,512,y);return y}
    if(!broadcast){line(event.title,330,'600 55px Georgia');wrap(event.venue,430,29)}
    else{
      line(copy('CH 03 / INCOMING TRANSMISSION'),76,'20px Georgia')
      line(event.title,190,'600 66px "Event Display", Georgia')
      wrap(event.venue,255,25)
      line(event.dateTime,310,'24px Georgia')
      line(siteContent.contact.heading,390,'32px "Event Horror", Georgia')
      line(siteContent.contact.email,438,'28px Georgia')
      line(siteContent.contact.instagram,480,'28px Georgia')
      x.shadowBlur=0;x.fillStyle='#491617';x.fillRect(140,548,744,66);x.strokeStyle='#d8a74b9a';x.lineWidth=2;x.strokeRect(140,548,744,66);x.fillStyle='#ffdfa1'
      line(copy('REGISTER FOR THE HUNT ↗'),590,'26px Georgia')
      line(siteContent.contact.note,660,'18px Georgia')
      if(!event.registrationUrl)line(copy('REGISTRATION OPENS SOON'),708,'17px Georgia')
    }
    x.shadowBlur=0;for(let i=0;i<768;i+=4){x.fillStyle='#0003';x.fillRect(0,i,1024,1)}
    const reflection=x.createLinearGradient(80,0,580,768);reflection.addColorStop(0,'#ffe5a512');reflection.addColorStop(.42,'#ffe5a500');reflection.addColorStop(1,'#00000028');x.fillStyle=reflection;x.fillRect(0,0,1024,768)
    x.restore();screenTexture.needsUpdate=true
  }
  paintScreen(false); let showingBroadcast=false
  return {group, television, screen, ready:Promise.all(pending), update(mobile:boolean,dt:number,broadcast:number){
    screenMat.uniforms.time.value += Math.min(dt,.1);screenMat.uniforms.boot.value=broadcast>.01?Math.min(1,Math.max(0,(broadcast-.12)/.6)):1
    sword.scale.setScalar(mobile?.48:.65);sword.position.set(mobile?-2.9:-4.6,-1.79,mobile?-1.7:-1.4)
    skull.scale.setScalar(mobile?.68:1);skull.position.x=mobile?-2.2:-4.45
    television.scale.setScalar(mobile?.66:1);television.position.set(mobile?.9:2.4,-1.86,-3.2);television.rotation.x=-.16
    if(showingBroadcast!==(broadcast>.15)){showingBroadcast=broadcast>.15;paintScreen(showingBroadcast)}
  },dispose(){resources.forEach(r=>r.dispose());group.removeFromParent()}}
}


