import { ensurePageFonts, preparePageInk } from './PageTypography'
import { BackSide, BoxGeometry, DoubleSide, FrontSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader } from 'three'
import { createAncientPaper, drawArtifactInk } from './AncientPaper'
import { deskMotion } from './journalMotion'
import { casePageCount, faqPageCount } from './deskSchedule'
import { CanvasTexture } from 'three'
import { copy } from '../../data/content'

export function createDeskFiles(redraw: () => void) {
  const group = new Group(), folder = new Group(), faq = new Group(), papers = new Group()
  group.add(folder, faq); folder.add(papers); folder.rotation.x = faq.rotation.x = -Math.PI / 2
  const coverTexture = new TextureLoader().load('/s03/textures/ancient-folder.webp', redraw)
  coverTexture.colorSpace = SRGBColorSpace; coverTexture.anisotropy = 8
  const board = new MeshStandardMaterial({ map: coverTexture, bumpMap: coverTexture, bumpScale: .035, roughness: .97, side: DoubleSide })
  const resources: { dispose: () => void }[] = [coverTexture, board]
  const ready: Promise<void>[] = []
  const add = (parent: Group, geometry: BoxGeometry | PlaneGeometry, material: MeshStandardMaterial) => {
    const mesh = new Mesh(geometry, material); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); resources.push(geometry); return mesh
  }
  add(folder, new BoxGeometry(5.8, 7.5, .1), board)
  const hinge = new Group(); hinge.position.set(-2.9, 0, .50); folder.add(hinge)
  const cover = add(hinge, new BoxGeometry(5.8, 7.5, .09), board); cover.position.x = 2.9
  const label = (parent: Group, title: string, x = 0, z = .3) => {
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512
    const ctx=canvas.getContext('2d')!;preparePageInk(ctx);const paintLabel=()=>{ctx.fillStyle='#241a12';ctx.fillRect(0,0,1024,512);ctx.strokeStyle='#b8a177';ctx.lineWidth=3;ctx.strokeRect(30,30,964,452)
    ctx.textAlign='center';ctx.fillStyle='#e9c77f';ctx.font='700 76px "Page Serif"';ctx.fillText(title,512,250);ctx.font='26px "Page Antique"';ctx.fillText(copy('DJS ISACA / THE HUNT'),512,335)};paintLabel()
    const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;texture.anisotropy=8
    ready.push(ensurePageFonts().then(()=>{paintLabel();texture.needsUpdate=true;redraw()}))
    const material=new MeshStandardMaterial({map:texture,roughness:.94});const tag=add(parent,new PlaneGeometry(4.6,2.3),material);tag.position.set(x,0,z);resources.push(texture,material)
  }
  label(hinge, copy('Problem statements.'),2.9,.055)
  const stack = (parent: Group, kind: 'cases' | 'faq', count: number) => {
    const offset = kind === 'faq' ? 3 : 0
    const makeLeaf = (index: number) => {
      const paper = createAncientPaper((x, w, h) => drawArtifactInk(x, w, h, kind, index), redraw, false, index + offset, kind === 'cases' || index === 0)
      const study = createAncientPaper((x, w, h) => drawArtifactInk(x, w, h, 'study', index), redraw, true, index + offset)
      study.texture.repeat.x = -1; study.texture.offset.x = 1
      const front = new MeshStandardMaterial({ map: paper.texture, bumpMap: paper.texture, bumpScale: .008, roughness: .98, side: FrontSide })
      const reverse = new MeshStandardMaterial({ map: study.texture, bumpMap: study.texture, bumpScale: .008, roughness: .98, side: BackSide })
      resources.push(paper, study, front, reverse); ready.push(paper.ready, study.ready)
      return { front, reverse }
    }
    const base = makeLeaf(count); base.front.side = DoubleSide
    add(parent, new PlaneGeometry(5.35, 7), base.front).position.z = .12
    return Array.from({ length: count }, (_, i) => {
      const { front, reverse } = makeLeaf(i)
      const pivot = new Group(); pivot.position.set(-2.675, 0, .14 + (count - i) * .018); parent.add(pivot)
      const geometry = new PlaneGeometry(5.35, 7, 32, 40)
      const page = add(pivot, geometry, front); page.position.x = 2.675
      const back = new Mesh(geometry, reverse); back.position.x = 2.675; back.castShadow = back.receiveShadow = true; pivot.add(back)
      return { pivot, geometry, rest: geometry.attributes.position.array.slice(), last: -1 }
    })
  }
  const faqBoard = add(faq,new BoxGeometry(5.8,7.5,.1),board);faqBoard.position.z=-.04
  const faqHinge=new Group();faqHinge.position.set(-2.9,0,.25);faq.add(faqHinge)
  const faqLid=add(faqHinge,new BoxGeometry(5.8,7.5,.09),board);faqLid.position.x=2.9
  label(faqHinge,copy('FAQ'),2.9,.055)
  const caseLeaves = stack(papers, 'cases', casePageCount), faqLeaves = stack(faq, 'faq', faqPageCount)
  const insideCover = createAncientPaper((x, w, h) => drawArtifactInk(x, w, h, 'study'), redraw, true, 3)
  insideCover.texture.repeat.x = -1; insideCover.texture.offset.x = 1
  const insideMaterial = new MeshStandardMaterial({ map: insideCover.texture, bumpMap: insideCover.texture, bumpScale: .008, roughness: .98, side: BackSide })
  const lining = add(hinge, new PlaneGeometry(5.6, 7.3), insideMaterial); lining.position.set(2.9, 0, -.051)
  resources.push(insideCover, insideMaterial); ready.push(insideCover.ready)
  const turn = (leaves: typeof caseLeaves, progress: number, mobile: boolean, opening = 1) => {
    leaves.forEach(({ pivot, geometry, rest, last }, i) => {
      const t = Math.max(0, Math.min(1, progress - i)) * opening
      pivot.rotation.y = -Math.PI * t
      pivot.position.x = -2.675 + (mobile ? Math.max(0, (t - .8) / .2) * 5.35 : 0)
      pivot.position.z = mobile && t > .8 ? .14 - (t - .8) * .5 : .18 + (leaves.length - i) * .04 + t * (i + 1) * .09
      if (Math.abs(t - last) < .0001) return
      const pos = geometry.attributes.position, curl = Math.sin(t * Math.PI)
      for (let j = 0; j < pos.count; j++) {
        const distance = (rest[j * 3] + 2.675) / 5.35
        pos.setZ(j, curl * Math.sin(distance * Math.PI) * .38 + .004 * Math.sin(rest[j * 3] * 9 + rest[j * 3 + 1] * 4))
      }
      pos.needsUpdate = true; geometry.computeVertexNormals(); geometry.computeBoundingSphere(); leaves[i].last = t
    })
  }
  return {
    group,
    ready: Promise.all(ready),
    update(mobile: boolean) {
      const enter = deskMotion.folderOpacity, faqEnter = deskMotion.faqOpacity
      folder.visible = faq.visible = true
      folder.position.set((mobile ? 1.85 : 2.8) * (1 - enter) + (mobile ? 0 : 2.675 * (.88 * 10 / 12.18)) * enter, -1.73 + enter * 2.83, 2.95 * (1 - enter))
      folder.rotation.z = -.10 * (1 - enter)
      const restScale = mobile ? .30 : .43
      folder.scale.setScalar(restScale + (.88 * 10 / 12.18 - restScale) * enter)
      hinge.position.z = .22 + .28 * (1 - deskMotion.folder)
      hinge.rotation.y = -deskMotion.folder * Math.PI
      papers.position.z = .12
      turn(caseLeaves, deskMotion.folderTurn, mobile, enter)
      faq.position.set((mobile ? 1.85 : 3.0) * (1 - faqEnter) + (mobile ? 0 : 2.675 * (.88 * 10 / 12.18)) * faqEnter, -1.73 + faqEnter * 2.83, 0)
      faq.scale.setScalar((mobile ? .30 : .43) + faqEnter * (.88 * 10 / 12.18 - (mobile ? .30 : .43)))
      faqHinge.rotation.y = -Math.PI * faqEnter
      faq.rotation.z = .08 * (1 - faqEnter)
      turn(faqLeaves, deskMotion.faq, mobile, faqEnter)
    },
    dispose() { resources.forEach(r => r.dispose()); group.removeFromParent() },
  }
}
