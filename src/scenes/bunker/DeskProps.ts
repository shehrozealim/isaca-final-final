import { BoxGeometry, CylinderGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader, TorusGeometry } from 'three'
import { createAncientPaper, drawArtifactInk } from './AncientPaper'

/** Fixed, deliberately placed clutter: no random movement or lights per prop. */
export function createDeskProps(redraw: () => void) {
  const group = new Group(), resources: { dispose(): void }[] = []
  const surface = new TextureLoader().load('/s03/props/3d/metal_plate-nor_gl.webp', redraw)
  const wear = new TextureLoader().load('/s03/props/3d/metal_plate-rough.webp', redraw)
  resources.push(surface,wear)
  const brass = new MeshStandardMaterial({ normalMap:surface, roughnessMap:wear, color: '#9a7541', roughness: .42, metalness: .78 })
  const iron = new MeshStandardMaterial({ normalMap:surface, roughnessMap:wear, color: '#302c27', roughness: .62, metalness: .7 })


  const leather = new MeshStandardMaterial({ color: '#3d281a', roughness: .95 })
  const stock = new MeshStandardMaterial({ color: '#b29c70', roughness: 1 })
  resources.push(brass, iron, leather, stock)
  const add = (geometry: BoxGeometry | CylinderGeometry | PlaneGeometry | TorusGeometry, material: MeshStandardMaterial, x: number, y: number, z: number, parent = group) => {
    const mesh = new Mesh(geometry, material); mesh.position.set(x, y, z); mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); resources.push(geometry); return mesh
  }
  // Tarnished keys on a ring, a letter opener, and a small pile of old coins.
  const keys = new Group(); keys.position.set(.8, -1.81, 2.6); keys.rotation.y = -.35; group.add(keys)
  const ring = add(new TorusGeometry(.20, .025, 10, 32), brass, 0, .05, 0, keys); ring.rotation.x = Math.PI / 2
  for (let i = 0; i < 2; i++) {
    const head = add(new TorusGeometry(.10, .025, 10, 24), brass, i * .19, .04, .27, keys); head.rotation.x = Math.PI / 2
    const stem = add(new CylinderGeometry(.025, .025, .7, 12), brass, i * .19, .04, .68, keys); stem.rotation.x = Math.PI / 2
    for (let j = 0; j < 2; j++) add(new BoxGeometry(.10, .045, .04), brass, i * .19 + .045, .04, .92 - j * .12, keys)
  }
  // Twine rests at the near edge.
  for (let i = 0; i < 5; i++) { const loop = add(new TorusGeometry(.32 + i * .025, .018, 8, 40), stock, .8, -1.82 + i * .016, 3.9); loop.rotation.x = Math.PI / 2; loop.scale.y = .72 }
  const paper = createAncientPaper((x, w, h) => drawArtifactInk(x, w, h, 'study'), redraw, true, 100)
  resources.push(paper)
  const note = new MeshStandardMaterial({ map: paper.texture, bumpMap: paper.texture, bumpScale: .008, roughness: .98, side: DoubleSide }); resources.push(note)
  for (const [x, z, angle] of [[.35, .25, .12]]) {
    const page = add(new PlaneGeometry(1.3, 1.65), note, x, -1.72, z); page.rotation.set(-Math.PI / 2, 0, angle)
  }
  const cover = new TextureLoader().load('/s03/textures/ancient-folder.webp', redraw); cover.colorSpace = SRGBColorSpace; resources.push(cover)
  const matchbox = new MeshStandardMaterial({ map: cover, roughness: .96 }); resources.push(matchbox)
  const box = add(new BoxGeometry(.7, .15, .43), matchbox, -2.2, -1.79, 3.9); box.rotation.y = .2
  return { group, ready: paper.ready, dispose() { resources.forEach(r => r.dispose()); group.removeFromParent() } }
}