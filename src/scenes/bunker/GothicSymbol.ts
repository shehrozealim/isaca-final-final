import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader } from 'three'
/** Reference-derived raised engravings with alpha-cut cast shadows. */
export function createGothicSymbol(index: number, size: number, redraw: () => void) {
  const map = new TextureLoader().load('/s03/textures/gothic-symbols.webp', redraw)
  map.colorSpace = SRGBColorSpace; map.anisotropy = 4
  const geometry = new PlaneGeometry(size, size), uv = geometry.attributes.uv
  for (let i = 0; i < uv.count; i++) { uv.setX(i, (uv.getX(i) + index % 3) / 3); uv.setY(i, (uv.getY(i) + (index < 3 ? 1 : 0)) / 2) }
  const material = new MeshStandardMaterial({ map, bumpMap: map, bumpScale: .018, roughness: .68, metalness: .22, transparent: true, alphaTest: .15, side: DoubleSide })
  const mesh = new Mesh(geometry, material); mesh.castShadow = true; mesh.receiveShadow = true
  return { mesh, dispose: () => { geometry.dispose(); material.dispose(); map.dispose() } }
}
