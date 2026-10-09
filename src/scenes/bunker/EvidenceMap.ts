import { CatmullRomCurve3, Group, Mesh, MeshStandardMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader, TubeGeometry, Vector3, SphereGeometry, TorusGeometry } from 'three'

export function createEvidenceMap(redraw: () => void) {
  const portrait = matchMedia('(max-width: 767px)').matches
  const group = new Group()
  const sheetHeight = portrait ? 15.2 : 5
  const geometry = new PlaneGeometry(8, sheetHeight, 40, 24)
  const p = geometry.attributes.position
  for (let i = 0; i < p.count; i++) p.setZ(i, Math.abs(p.getX(i)) * .012 + Math.sin(p.getX(i) * 3) * .012)
  geometry.computeVertexNormals()
  const paper = new TextureLoader().load(portrait ? '/s03/map/djsce-investigation-portrait.svg' : '/s03/map/djsce-investigation.svg', redraw)
  paper.colorSpace = SRGBColorSpace; paper.anisotropy = 4
  const material = new MeshStandardMaterial({ map: paper, roughness: .97 })
  const sheet = new Mesh(geometry, material); sheet.castShadow = true; sheet.receiveShadow = true
  group.add(sheet)
  const fromPixel = (x: number, y: number) => new Vector3((portrait ? x / 1000 - .5 : x / 1600 - .5) * 8, (portrait ? .5 - y / 1900 : .5 - y / 1000) * sheetHeight, .09)
  const pinPoint = portrait ? [450, 665] : [764, 395]
  const routePoints = portrait ? [[805,1600],[730,1470],[670,1260],[530,1090],[460,890],[450,665]] : [[1390,756],[1240,652],[1104,650],[960,522],[810,490],[764,395]]
  const route = new CatmullRomCurve3(routePoints.map(([x, y]) => fromPixel(x, y)))
  const threadGeometry = new TubeGeometry(route, 160, .014, 6, false)
  const threadMaterial = new MeshStandardMaterial({ color: '#963f2d', roughness: .8 })
  const thread = new Mesh(threadGeometry, threadMaterial); group.add(thread)
  const pinMaterial = new MeshStandardMaterial({ color: '#b49657', metalness: .65, roughness: .5 })
  const pin = new Mesh(new SphereGeometry(.085, 20, 12), pinMaterial)
  pin.position.copy(fromPixel(pinPoint[0], pinPoint[1])); pin.position.z = .14; group.add(pin)
  const ring = new Mesh(new TorusGeometry(.29, .013, 8, 48), threadMaterial); ring.position.copy(fromPixel(pinPoint[0], pinPoint[1])); ring.position.z = .11; group.add(ring)
  const indices = threadGeometry.index!.count
  return {
    group,
    update(lift: number, progress: number, mobile: boolean) {
      group.position.set(0, -1.72 + Math.sin(lift * Math.PI / 2) * .55, -.3)
      group.rotation.set(-Math.PI / 2 + lift * .035, 0, -.035 * lift)
      group.scale.setScalar(mobile ? .65 : 1)
      threadGeometry.setDrawRange(0, Math.floor(indices * Math.min(1, progress) / 3) * 3)
      pin.visible = ring.visible = progress > .96
    },
    dispose() { geometry.dispose(); threadGeometry.dispose(); pin.geometry.dispose(); ring.geometry.dispose(); material.dispose(); pinMaterial.dispose(); threadMaterial.dispose(); paper.dispose(); group.removeFromParent() },
  }
}
