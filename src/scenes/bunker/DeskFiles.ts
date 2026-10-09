import { BoxGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader } from 'three'
import { createAncientPaper, drawArtifactInk } from './AncientPaper'
import { deskMotion } from './journalMotion'

export function createDeskFiles(redraw: () => void) {
  const group = new Group(), folder = new Group(), faq = new Group()
  group.add(folder, faq); folder.rotation.x = faq.rotation.x = -Math.PI / 2
  const loader = new TextureLoader(), coverTexture = loader.load('/s03/textures/ancient-folder.webp', redraw)
  coverTexture.colorSpace = SRGBColorSpace; coverTexture.anisotropy = 4
  const board = new MeshStandardMaterial({ map: coverTexture, bumpMap: coverTexture, bumpScale: .035, roughness: .97, side: DoubleSide })
  const resources: { dispose: () => void }[] = [coverTexture, board]
  const add = (parent: Group, geometry: BoxGeometry | PlaneGeometry, material: MeshStandardMaterial) => {
    const mesh = new Mesh(geometry, material); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); resources.push(geometry); return mesh
  }
  add(folder, new BoxGeometry(5.8, 7.5, .1), board)
  const spine = add(folder, new BoxGeometry(.13, 7.5, .24), board); spine.position.set(-2.83, 0, .08)
  const hinge = new Group(); hinge.position.set(-2.9, 0, .22); folder.add(hinge)
  const cover = add(hinge, new BoxGeometry(5.8, 7.5, .09), board); cover.position.x = 2.9
  const makePage = (parent: Group, kind: 'cases' | 'faq', z: number) => {
    const paper = createAncientPaper((x, w, h) => drawArtifactInk(x, w, h, kind), redraw)
    const material = new MeshStandardMaterial({ map: paper.texture, bumpMap: paper.texture, bumpScale: .012, roughness: .98, side: DoubleSide })
    const geometry = new PlaneGeometry(5.35, 7.0, 32, 40), positions = geometry.attributes.position
    for (let i = 0; i < positions.count; i++) { const x = positions.getX(i), y = positions.getY(i); positions.setZ(i, .012 * Math.sin(x * 9 + y * 4) + .025 * Math.pow(Math.abs(x / 2.675), 7)) }
    geometry.computeVertexNormals(); resources.push(paper, material)
    const page = add(parent, geometry, material); page.position.z = z; return page
  }
  const back = makePage(folder, 'cases', .13); back.rotation.z = -.025
  const page = makePage(folder, 'cases', .15)
  const faqPage = makePage(faq, 'faq', .02)
  const turning = makePage(faq, 'cases', .05)
  const turningRest = turning.geometry.attributes.position.array.slice()
  let lastFAQ = -1
  return {
    group,
    update(mobile: boolean) {
      const enter = deskMotion.folderOpacity, rise = deskMotion.folderPage
      folder.visible = enter > .001
      folder.position.set((mobile ? 3.6 : 8.5) * (1 - enter), -1.73, -2.2 * (1 - enter))
      folder.rotation.z = -.10 * (1 - enter)
      folder.scale.setScalar(mobile ? .74 : 1)
      hinge.rotation.y = -deskMotion.folder * (Math.PI - .06)
      page.position.z = .16 + rise * .45
      page.rotation.set(.015 * rise, -.015 * rise, -.008 * rise)
      faq.visible = deskMotion.faqOpacity > .001
      faq.position.set((mobile ? 4 : 9) * (1 - deskMotion.faqOpacity), -1.28, 0)
      faq.scale.setScalar(mobile ? .74 : 1)
      const t = deskMotion.faq
      turning.position.x = -t * (mobile ? 7 : 9); turning.position.z = .05 + Math.sin(t * Math.PI) * 1.8
      turning.rotation.set(0, -t * .4, t * -.3); turning.visible = t < .99
      if (Math.abs(t - lastFAQ) > .001) {
        const pos = turning.geometry.attributes.position
        for (let i = 0; i < pos.count; i++) pos.setZ(i, turningRest[i * 3 + 2] + Math.sin(t * Math.PI) * Math.pow((turningRest[i * 3] + 2.675) / 5.35, 2) * 1.2)
        pos.needsUpdate = true; turning.geometry.computeVertexNormals(); turning.geometry.computeBoundingSphere(); lastFAQ = t
      }
      faqPage.visible = true
    },
    dispose() { resources.forEach(r => r.dispose()); group.removeFromParent() },
  }
}
