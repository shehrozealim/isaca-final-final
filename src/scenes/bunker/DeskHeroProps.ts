import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader } from 'three'

/** Camera-matched photographs; close contact shadows belong to each cutout. */
export function createDeskHeroProps(redraw: () => void) {
  const group = new Group(), resources: { dispose(): void }[] = []
  const place = (name: string, width: number, height: number, x: number, z: number, angle = 0) => {
    const texture = new TextureLoader().load(`/s03/props/${name}.webp`, redraw); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 8
    const geometry = new PlaneGeometry(width, height)
    const material = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false })
    const mesh = new Mesh(geometry, material); mesh.rotation.set(-Math.PI / 2, 0, angle); mesh.position.set(x, -1.81, z)
    group.add(mesh); resources.push(texture, geometry, material); return mesh
  }
  const sword = place('sword', 5.4, 8.1, .1, -3.45, Math.PI / 2 + .06)
  const skull = place('skull', 3.375, 2.25, -5.55, -2.55, -.14)
  const candle = place('candle', 1.4, 1.4, 5.55, -2.8)
  const television = place('television', 4.5, 3.2, 0, 0)
  return { group, television, update(mobile: boolean) {
    sword.scale.setScalar(mobile ? .58 : 1); sword.position.z = mobile ? -4.2 : -3.45
    skull.scale.setScalar(mobile ? .7 : 1); skull.position.x = mobile ? -1.8 : -5.55
    candle.scale.setScalar(mobile ? .8 : 1); candle.position.x = mobile ? 1.9 : 5.55
  }, dispose() { resources.forEach(resource => resource.dispose()); group.removeFromParent() } }
}
