import { BoxGeometry, CanvasTexture, CylinderGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry, RepeatWrapping, SRGBColorSpace, TextureLoader, TorusGeometry } from 'three'
import { createEvidenceMap } from './EvidenceMap'
import { deskMotion } from './journalMotion'
import { createPrizePaper } from './PrizePaper'
import { createDeskFiles } from './DeskFiles'
import { createDeskProps } from './DeskProps'
import { createDeskHeroProps } from './DeskHeroProps'

export function createOverheadDesk(redraw: () => void) {
  const group = new Group()
  const paperAssets: ReturnType<typeof createPrizePaper>[] = []
  const paperTexture = (index: number) => {
    const asset = createPrizePaper(index, redraw); paperAssets.push(asset); return asset.texture
  }
  const files = createDeskFiles(redraw)
  const props = createDeskProps(redraw); group.add(props.group)
  const heroProps = createDeskHeroProps(redraw); group.add(heroProps.group)

  const geometries = new Set<BoxGeometry | PlaneGeometry | CylinderGeometry | TorusGeometry>()
  const materials = new Set<MeshStandardMaterial>()
  const textures = new Set<CanvasTexture | ReturnType<TextureLoader['load']>>()
  const add = (geometry: BoxGeometry | PlaneGeometry | CylinderGeometry | TorusGeometry, material: MeshStandardMaterial, parent = group) => {
    const mesh = new Mesh(geometry, material); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh)
    geometries.add(geometry); materials.add(material); return mesh
  }
  const wood = new TextureLoader().load('/s03/textures/desk-wood-real.webp', redraw)
  wood.colorSpace = SRGBColorSpace; wood.wrapS = wood.wrapT = RepeatWrapping; wood.repeat.set(1.35, 1.05); wood.anisotropy = 8; textures.add(wood)
  const woodMaterial = new MeshStandardMaterial({ map: wood, roughness: .91, bumpMap: wood, bumpScale: .012, color: '#bca88e' })
  const table = add(new BoxGeometry(10.4, .35, 9.2), woodMaterial); table.position.y = -2.05
  const darkMetal = new MeshStandardMaterial({ color: '#32332a', roughness: .72, metalness: .45 })
  const brass = new MeshStandardMaterial({ color: '#ad8950', roughness: .55, metalness: .72 })
  // Foreground lamp rim and the brass instruments stay quiet during the reveal.
  const saucer = add(new CylinderGeometry(.9, .85, .08, 48), brass); saucer.position.set(-4, -1.82, 3.3)
  const cup = add(new CylinderGeometry(.58, .42, .6, 40, 1, true), new MeshStandardMaterial({ color: '#5a4835', roughness: .65, side: DoubleSide })); cup.position.set(-4, -1.49, 3.3)
  const coffee = add(new CylinderGeometry(.52, .52, .025, 40), new MeshStandardMaterial({ color: '#170f09', roughness: .26 })); coffee.position.set(-4, -1.26, 3.3)
  const handle = add(new TorusGeometry(.31, .07, 12, 24), brass); handle.position.set(-3.38, -1.52, 3.3)
  for (let i = 0; i < 2; i++) { const pen = add(new CylinderGeometry(.038, .038, 2.7, 12), i ? brass : darkMetal); pen.rotation.z = Math.PI / 2; pen.rotation.y = -.2; pen.position.set(0, -1.78, 4.3 + i * .18) }
  const map = createEvidenceMap(redraw); group.add(map.group, files.group)
  const packet = new Group(); group.add(packet); packet.rotation.x = -Math.PI / 2
  const baseTexture = paperTexture(0)
  const base = add(new PlaneGeometry(5.35, 7.0), new MeshStandardMaterial({ map: baseTexture, bumpMap: baseTexture, bumpScale: .008, roughness: .97, side: DoubleSide }), packet)
  base.position.z = .01
  const leaves = Array.from({ length: 2 }, (_, i) => {
    const texture = paperTexture(i + 1)
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
    screen: heroProps.screen,
    ready: Promise.all([heroProps.ready, files.ready, props.ready, ...paperAssets.map(asset => asset.ready)]),
    update(mobile: boolean, aspect: number, dt: number) {
      group.visible = deskMotion.opacity > .001
      heroProps.update(mobile, dt, deskMotion.broadcast)
      map.update(deskMotion.mapLift, deskMotion.route, mobile)
      const focus = deskMotion.mapFocus


      // Fit the entire sheet, including borders, instead of enlarging past the viewport.
      const viewHeight = 2 * Math.tan((mobile ? 48 : 38) * Math.PI / 360) * (12.94 - focus * 2.94)
      const mapHeight = mobile ? 15.2 : 5
      const fitted = Math.min(viewHeight * aspect * .9 / 8, viewHeight * .83 / mapHeight)
      const restScale = mobile ? .12 : .30
      map.group.scale.setScalar(restScale + (fitted - restScale) * focus)
      map.group.rotation.x = -Math.PI / 2 + (1 - focus) * deskMotion.mapLift * .025
      map.group.rotation.z *= 1 - focus
      const held = deskMotion.mapLift * (1 - deskMotion.mapSettle)
      map.group.position.set((mobile ? -2.1 : -2.5) * (1 - held), -1.84 + focus * 2.94, (mobile ? -2.5 : -2.0) * (1 - held))
      map.group.visible = true
      files.update(mobile)
      packet.visible = true
      packet.position.set((mobile ? -1.75 : -1.0) * (1 - deskMotion.prizeOpacity), -1.84 + deskMotion.prizeOpacity * 2.94, (mobile ? 3.8 : 2.6) * (1 - deskMotion.prizeOpacity))
      packet.scale.setScalar(((mobile ? .24 : .36) + deskMotion.prizeOpacity * (mobile ? .50 : .64)) * (1 - deskMotion.prizeOpacity * (1 - 10 / 12.35)))
      const progress = deskMotion.prize
      base.position.y = mobile ? progress * 1.7 : 0
      for (let i = 0; i < leaves.length; i++) {
        const { mesh, geometry, rest, last } = leaves[i]
        const t = ease((progress - (1 - i) * .19 - .08) / .46), sign = i % 2 ? 1 : -1
        mesh.position.set(sign * t * (mobile ? 1.72 : 4.45), mobile ? -t * 3.95 : 0, .10 + i * .045 + Math.sin(t * Math.PI) * .08)
        mesh.scale.setScalar(1 - t * (mobile ? .46 : .43))
        mesh.rotation.set(0, 0, 0)
        if (Math.abs(t - last) > .0001) {
          const p = geometry.attributes.position
          for (let j = 0; j < p.count; j++) p.setZ(j, Math.sin(t * Math.PI) * Math.pow((rest[j * 3] + 2.675) / 5.35, 2) * .08)
          p.needsUpdate = true; geometry.computeVertexNormals(); geometry.computeBoundingSphere(); leaves[i].last = t
        }
      }
      for (const { seal, sign } of seals) { const t = ease(progress / .24); seal.position.set(sign * (.35 + t * 2.85), -t * 3.8, .27 * (1 - t) + .045 * t + .5 * Math.sin(t * Math.PI)); seal.rotation.z = sign * t * .6; seal.visible = progress < .4 }
    },
    dispose() { heroProps.dispose(); props.dispose(); files.dispose(); paperAssets.forEach(asset => asset.dispose()); map.dispose(); geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); group.removeFromParent() },
  }
}
