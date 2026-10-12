import { getMapSource, prepareBunkerAssets } from './bunkerAssets'
import { DoubleSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, Texture, TextureLoader } from 'three'

export function createEvidenceMap(redraw: () => void) {
  const group = new Group()
  const portrait = matchMedia('(max-width: 767px)').matches
  const sheetHeight = portrait ? 11.2 : 5
  const geometry = new PlaneGeometry(8, sheetHeight, 24, 24)
  const p = geometry.attributes.position
  for (let i = 0; i < p.count; i++) p.setZ(i, Math.abs(p.getX(i)) * .012 + Math.sin(p.getX(i) * 3) * .012)
  geometry.computeVertexNormals()
  const paper = new Texture()
  const ready = prepareBunkerAssets().then(async () => {
    const loaded = await new TextureLoader().loadAsync(getMapSource(portrait))
    paper.image = loaded.image; paper.needsUpdate = true; loaded.dispose(); redraw()
  })
  paper.colorSpace = SRGBColorSpace; paper.anisotropy = 4
  const material = new MeshStandardMaterial({ map: paper, roughness: .97, side: DoubleSide, bumpMap: paper, bumpScale: .004 })
  const sheet = new Mesh(geometry, material); sheet.castShadow = sheet.receiveShadow = true
  group.add(sheet)
  return { group, ready,
    update(lift: number, _progress: number, mobile: boolean) {
      group.position.set(0, -1.72 + Math.sin(lift * Math.PI / 2) * .55, -.3)
      group.rotation.set(-Math.PI / 2 + lift * .035, 0, -.035 * lift)
      group.scale.setScalar(mobile ? .65 : 1)
    },
    dispose() { geometry.dispose(); material.dispose(); paper.dispose(); group.removeFromParent() },
  }
}
