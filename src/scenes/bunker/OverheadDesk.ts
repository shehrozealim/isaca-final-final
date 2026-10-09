import { BoxGeometry, CanvasTexture, CylinderGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, SRGBColorSpace, TextureLoader, TorusGeometry } from 'three'
import { createEvidenceMap } from './EvidenceMap'
import { deskMotion } from './journalMotion'
import { createAncientPaper, drawArtifactInk } from './AncientPaper'
import { createDeskFiles } from './DeskFiles'

export function createOverheadDesk(redraw: () => void) {
  const group = new Group()
  const paperAssets: ReturnType<typeof createAncientPaper>[] = []
  const paperTexture = (kind: 'cover' | 'leaf' | 'bounty', index = 0) => {
    const asset = createAncientPaper((x, w, h) => drawArtifactInk(x, w, h, kind === 'bounty' ? 'bounty' : 'leaf', index), redraw)
    paperAssets.push(asset); return asset.texture
  }
  const files = createDeskFiles(redraw)

  const geometries = new Set<BoxGeometry | PlaneGeometry | CylinderGeometry | TorusGeometry>()
  const materials = new Set<MeshStandardMaterial>()
  const textures = new Set<CanvasTexture | ReturnType<TextureLoader['load']>>()
  const add = (geometry: BoxGeometry | PlaneGeometry | CylinderGeometry | TorusGeometry, material: MeshStandardMaterial, parent = group) => {
    const mesh = new Mesh(geometry, material); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh)
    geometries.add(geometry); materials.add(material); return mesh
  }
  const wood = new TextureLoader().load('/s03/textures/desk-wood.webp', redraw)
  wood.colorSpace = SRGBColorSpace; wood.wrapS = wood.wrapT = RepeatWrapping; wood.repeat.set(2, 1.5); wood.anisotropy = 4; textures.add(wood)
  const woodMaterial = new MeshStandardMaterial({ map: wood, roughness: .91, bumpMap: wood, bumpScale: .012, color: '#8e7457' })
  const table = add(new BoxGeometry(25, .35, 18), woodMaterial); table.position.y = -2.05
  const darkMetal = new MeshStandardMaterial({ color: '#32332a', roughness: .72, metalness: .45 })
  const brass = new MeshStandardMaterial({ color: '#ad8950', roughness: .55, metalness: .72 })
  // Foreground lamp rim and the brass instruments stay quiet during the reveal.
  const lampBase = add(new CylinderGeometry(1, 1.2, .16, 48), darkMetal); lampBase.position.set(8.2, -1.78, -5.3)
  const lampStem = add(new CylinderGeometry(.06, .06, 3.8, 16), brass); lampStem.position.set(8.2, .1, -5.3)
  const shade = add(new CylinderGeometry(.8, 1.7, 1.1, 48, 1, true), darkMetal); shade.position.set(7.4, 2.3, -5); shade.rotation.z = -.35
  const saucer = add(new CylinderGeometry(.9, .85, .08, 48), brass); saucer.position.set(-8, -1.82, 4)
  const cup = add(new CylinderGeometry(.58, .42, .6, 40, 1, true), new MeshStandardMaterial({ color: '#5a4835', roughness: .65, side: DoubleSide })); cup.position.set(-8, -1.49, 4)
  const coffee = add(new CylinderGeometry(.52, .52, .025, 40), new MeshStandardMaterial({ color: '#170f09', roughness: .26 })); coffee.position.set(-8, -1.26, 4)
  const handle = add(new TorusGeometry(.31, .07, 12, 24), brass); handle.position.set(-7.38, -1.52, 4)
  for (let i = 0; i < 2; i++) { const pen = add(new CylinderGeometry(.038, .038, 2.7, 12), i ? brass : darkMetal); pen.rotation.z = Math.PI / 2; pen.rotation.y = -.2; pen.position.set(5.8, -1.78, 5.3 + i * .18) }
  const map = createEvidenceMap(redraw); group.add(map.group, files.group)
  const packet = new Group(); group.add(packet); packet.rotation.x = -Math.PI / 2
  const baseTexture = paperTexture('bounty')
  const base = add(new PlaneGeometry(5.35, 7.0), new MeshStandardMaterial({ map: baseTexture, bumpMap: baseTexture, bumpScale: .008, roughness: .97, side: DoubleSide }), packet)
  base.position.z = .01
  const leaves = Array.from({ length: 4 }, (_, i) => {
    const texture = paperTexture(i === 3 ? 'cover' : 'leaf', i)
    const geometry = new PlaneGeometry(5.35, 7.0, 32, 40)
    const mesh = add(geometry, new MeshStandardMaterial({ map: texture, bumpMap: texture, bumpScale: .008, roughness: .98, side: DoubleSide }), packet)
    return { mesh, geometry, rest: geometry.attributes.position.array.slice(), last: -1 }
  })

  const wax = new TextureLoader().load('/s03/textures/ancient-wax.webp', redraw)
  wax.colorSpace = SRGBColorSpace; wax.anisotropy = 4; textures.add(wax)
  const waxMaterial = new MeshStandardMaterial({ map: wax, bumpMap: wax, bumpScale: .035, roughness: .5, metalness: .12, transparent: true, alphaTest: .08, side: DoubleSide })
  const seals = [-1, 1].map(sign => {
    const geometry = new PlaneGeometry(.7, 1.4)
    const uv = geometry.attributes.uv
    for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * .5 + (sign > 0 ? .5 : 0))
    const seal = add(geometry, waxMaterial, packet); seal.position.set(sign * .35, 0, .31)
    return { seal, sign }
  })
  const clamp = (v: number) => Math.max(0, Math.min(1, v))
  const ease = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t) }
  return {
    group,
    update(mobile: boolean, aspect: number) {
      group.visible = deskMotion.opacity > .001
      map.update(deskMotion.mapLift, deskMotion.route, mobile)
      const focus = deskMotion.mapFocus
      group.children.forEach(child => { if (child !== map.group) child.visible = focus < .98 })

      // Fit the entire sheet, including borders, instead of enlarging past the viewport.
      const viewHeight = 2 * Math.tan((mobile ? 48 : 38) * Math.PI / 360) * 12.0
      const mapHeight = mobile ? 15.2 : 5
      const fitted = Math.min(viewHeight * aspect * .9 / 8, viewHeight * .83 / mapHeight)
      const restScale = mobile ? .36 : .85
      map.group.scale.setScalar(restScale + (fitted - restScale) * focus)
      map.group.rotation.x = -Math.PI / 2 + (1 - focus) * deskMotion.mapLift * .025
      map.group.rotation.z *= 1 - focus
      map.group.position.x += deskMotion.mapSettle * (mobile ? -5 : -9)
      map.group.position.y -= deskMotion.mapSettle * .69
      map.group.visible = deskMotion.mapLift > .001
      files.update(mobile)
      packet.visible = deskMotion.prizeOpacity > .001
      packet.position.set((mobile ? 4.5 : 9) * (1 - deskMotion.prizeOpacity), -1.38, 0)
      packet.scale.setScalar(mobile ? .74 : 1)
      const progress = deskMotion.prize
      for (let i = 0; i < leaves.length; i++) {
        const { mesh, geometry, rest, last } = leaves[i]
        const t = ease((progress - (3 - i) * .15 - .08) / .40), sign = i % 2 ? 1 : -1
        mesh.position.set(sign * t * (mobile ? 7 : 8), (i < 2 ? -1 : 1) * t * 2.7, .04 + i * .045 + Math.sin(t * Math.PI) * 1.6 + Math.sin(t * Math.PI) * .65)
        mesh.rotation.set(t * sign * .32, t * sign * .54, (i - 1.5) * .025 + sign * t * .40)
        if (Math.abs(t - last) > .0001) {
          const p = geometry.attributes.position
          for (let j = 0; j < p.count; j++) p.setZ(j, Math.sin(t * Math.PI) * Math.pow((rest[j * 3] + 2.675) / 5.35, 2) * 1.2)
          p.needsUpdate = true; geometry.computeVertexNormals(); geometry.computeBoundingSphere(); leaves[i].last = t
        }
      }
      for (const { seal, sign } of seals) { const t = ease(progress / .18); seal.position.set(sign * (.35 + t * 1.3), -.16 * t, .27 + .7 * Math.sin(t * Math.PI)); seal.rotation.z = sign * t * .6; seal.visible = progress < .32 }
    },
    dispose() { files.dispose(); paperAssets.forEach(asset => asset.dispose()); map.dispose(); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); group.removeFromParent() },
  }
}
