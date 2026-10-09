import { BoxGeometry, CylinderGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader, TorusGeometry } from 'three'
import { createAncientPaper, drawArtifactInk } from './AncientPaper'

/** Fixed, deliberately placed clutter: no random movement or lights per prop. */
export function createDeskProps(redraw: () => void) {
  const group = new Group(), resources: { dispose(): void }[] = []
  const brass = new MeshStandardMaterial({ color: '#9a7541', roughness: .42, metalness: .78 })
  const iron = new MeshStandardMaterial({ color: '#302c27', roughness: .62, metalness: .7 })
  const wax = new MeshStandardMaterial({ color: '#b9a27a', roughness: .86 })
  const glass = new MeshStandardMaterial({ color: '#3f3220', roughness: .18, metalness: .25 })
  const leather = new MeshStandardMaterial({ color: '#3d281a', roughness: .95 })
  const stock = new MeshStandardMaterial({ color: '#b29c70', roughness: 1 })
  resources.push(brass, iron, wax, glass, leather, stock)
  const add = (geometry: BoxGeometry | CylinderGeometry | PlaneGeometry | TorusGeometry, material: MeshStandardMaterial, x: number, y: number, z: number, parent = group) => {
    const mesh = new Mesh(geometry, material); mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); resources.push(geometry); return mesh
  }
  // Three wax candles, burnt wicks and wax runs, clustered by the lamp.
  for (let i = 0; i < 3; i++) {
    const x = 4.9 + (i % 2) * .55, z = -3.3 - Math.floor(i / 2) * .5, height = .5 + i * .27
    add(new CylinderGeometry(.23, .29, .06, 32), brass, x, -1.75, z)
    add(new CylinderGeometry(.16, .18, height, 36), wax, x, -1.73 + height / 2, z)
    add(new CylinderGeometry(.018, .018, .08, 8), iron, x, -1.69 + height, z)
    for (let j = 0; j < 4; j++) { const a = j * Math.PI / 2; add(new CylinderGeometry(.025, .04, .18 + j * .025, 10), wax, x + Math.cos(a) * .155, -1.73 + height - .10, z + Math.sin(a) * .155) }
  }
  // Amber specimen bottles with corks and paper specimen collars.
  for (let i = 0; i < 3; i++) {
    const x = -5.8 + i * .5, z = -3.6, height = .52 + (i % 2) * .22
    add(new CylinderGeometry(.17, .21, height, 32), glass, x, -1.73 + height / 2, z)
    add(new CylinderGeometry(.08, .08, .2, 24), glass, x, -1.65 + height, z)
    add(new CylinderGeometry(.09, .075, .12, 24), leather, x, -1.53 + height, z)
    add(new CylinderGeometry(.175, .19, .17, 32, 1, true), stock, x, -1.58 + height / 3, z)
  }
  // Tarnished keys on a ring, a letter opener, and a small pile of old coins.
  const keys = new Group(); keys.position.set(1.15, -1.73, 3.65); keys.rotation.y = -.35; group.add(keys)
  const ring = add(new TorusGeometry(.20, .025, 10, 32), brass, 0, .05, 0, keys); ring.rotation.x = Math.PI / 2
  for (let i = 0; i < 2; i++) {
    const head = add(new TorusGeometry(.10, .025, 10, 24), brass, i * .19, .04, .27, keys); head.rotation.x = Math.PI / 2
    const stem = add(new CylinderGeometry(.025, .025, .7, 12), brass, i * .19, .04, .68, keys); stem.rotation.x = Math.PI / 2
    for (let j = 0; j < 2; j++) add(new BoxGeometry(.10, .045, .04), brass, i * .19 + .045, .04, .92 - j * .12, keys)
  }
  const knife = add(new BoxGeometry(.13, .035, 1.75), iron, -6, -1.74, .5); knife.rotation.y = -.35
  const grip = add(new BoxGeometry(.20, .09, .7), leather, -6.4, -1.70, 1.6); grip.rotation.y = -.35
  for (let i = 0; i < 7; i++) add(new CylinderGeometry(.10, .10, .025, 24), brass, .4 + (i % 3) * .17, -1.73 + Math.floor(i / 3) * .025, -3.55 + (i % 2) * .14)
  // Twine and two battered notebooks at the table's edge.
  for (let i = 0; i < 5; i++) { const loop = add(new TorusGeometry(.32 + i * .025, .018, 8, 40), stock, -1.6, -1.73 + i * .016, 3.7); loop.rotation.x = Math.PI / 2; loop.scale.y = .72 }
  for (let i = 0; i < 2; i++) {
    const book = new Group(); book.position.set(1.8 + i * .18, -1.66 + i * .25, -4.4); book.rotation.y = -.18 + i * .28; group.add(book)
    add(new BoxGeometry(1.45, .20, 1.9), stock, 0, 0, 0, book)
    for (const side of [-1, 1]) add(new BoxGeometry(1.56, .045, 2), leather, 0, side * .12, 0, book)
    add(new BoxGeometry(.08, .27, 2), leather, -.75, 0, 0, book)
  }
  const paper = createAncientPaper((x, w, h) => drawArtifactInk(x, w, h, 'study'), redraw, true)
  resources.push(paper)
  const note = new MeshStandardMaterial({ map: paper.texture, bumpMap: paper.texture, bumpScale: .008, roughness: .98, side: DoubleSide }); resources.push(note)
  for (const [x, z, angle] of [[-1.2, -3.4, -.18], [2.4, 3.5, .12], [-6, 2.7, -.08]]) {
    const page = add(new PlaneGeometry(1.3, 1.65), note, x, -1.72, z); page.rotation.set(-Math.PI / 2, 0, angle)
  }
  const cover = new TextureLoader().load('/s03/textures/ancient-folder.webp', redraw); cover.colorSpace = SRGBColorSpace; resources.push(cover)
  const matchbox = new MeshStandardMaterial({ map: cover, roughness: .96 }); resources.push(matchbox)
  const box = add(new BoxGeometry(.7, .15, .43), matchbox, -.35, -1.66, 3.9); box.rotation.y = .2
  return { group, ready: paper.ready, dispose() { resources.forEach(r => r.dispose()); group.removeFromParent() } }
}
