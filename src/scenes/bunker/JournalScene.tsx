import { prepareBunkerAssets, signalBunkerRenderReady } from './bunkerAssets'
import { siteContent } from '../../data/content'
import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Euler, PerspectiveCamera, Quaternion, Vector3 } from 'three'
import { createOccultBook } from '../../vendor/d3coy-book/OccultBook.mjs'
import { event } from '../../data/event'
import { getBunkerBackgroundState } from '../../components/bunker/bunkerBackgroundState'
import { journalMotion, deskMotion } from './journalMotion'
import { createOverheadDesk } from './OverheadDesk'
import { waitForThreeTextures } from './textureReadiness'

const journalEvent = { ...siteContent.journal, date: event.dateTime, duration: event.duration, registrationUrl: event.registrationUrl }

export default function JournalScene({ mobile }: { mobile: boolean }) {
  const { get, size, invalidate } = useThree()
  const corners = useRef([new Vector3(),new Vector3(),new Vector3(),new Vector3()])
  const bookRef = useRef<ReturnType<typeof createOccultBook> | null>(null)
  const deskRef = useRef<ReturnType<typeof createOverheadDesk> | null>(null)
  const aim = useRef(new PerspectiveCamera())
  const tableRotation = useRef(new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, -.06)))
  const tableBook = useRef(new Vector3())
  const readingCamera = useRef(new Vector3())
  const readingRotation = useRef(new Quaternion())
  const center = useRef(new Vector3())
  const settling = useRef(0)
  const crtFrame = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useLayoutEffect(() => {
    journalMotion.draw = () => { settling.current = 36; invalidate() }
    journalMotion.draw()
    return () => { journalMotion.draw = undefined; clearTimeout(crtFrame.current) }
  }, [invalidate])
  useLayoutEffect(() => {
    const instance = createOccultBook({ pageCount: 3, event: journalEvent, onTextureReady: () => journalMotion.draw?.() })
    bookRef.current = instance
    get().scene.add(instance.group)
    const desk = createOverheadDesk(() => journalMotion.draw?.())
    deskRef.current = desk
    get().scene.add(desk.group)
    let disposed = false
    void Promise.all([prepareBunkerAssets(), instance.ready, desk.ready, waitForThreeTextures()]).then(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))).then(async () => {
      if (disposed) return
      const renderer = get()
      await renderer.gl.compileAsync(renderer.scene, renderer.camera)
      if (!disposed) { signalBunkerRenderReady(); invalidate() }
    }).catch(() => { signalBunkerRenderReady(false) })
    return () => { disposed = true; instance.dispose(); desk.dispose(); bookRef.current = null; deskRef.current = null }
  }, [get, mobile, invalidate])
  useLayoutEffect(() => {
    const book = bookRef.current
    const camera = get().camera
    if (!book || !(camera instanceof PerspectiveCamera)) return
    camera.position.set(0, 0, 12)
    camera.lookAt(0, 0, 0)
    camera.fov = mobile ? 48 : 38
    camera.updateProjectionMatrix()
    book.setView(camera)
    const { image, room, finalVisual } = getBunkerBackgroundState()
    if (!image?.naturalWidth || !room || !finalVisual) return
    // Reconstruct the settled shutter pose instead of measuring a later camera
    // pose. Resizing in another chapter must preserve the return-to-table path.
    const settled = new DOMMatrix(finalVisual.roomTransform)
    const rect = {
      width: room.clientWidth * settled.a, height: room.clientHeight * settled.d,
      left: room.offsetLeft + room.clientWidth * .5 * (1 - settled.a) + settled.e,
      top: room.offsetTop + room.clientHeight * .58 * (1 - settled.d) + settled.f,
    }
    const fit = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight)
    const w = image.naturalWidth * fit, h = image.naturalHeight * fit
    const px = rect.left + (rect.width - w) * .5 + w * .476
    const py = rect.top + (rect.height - h) * .58 + h * .588
    const halfH = Math.tan(camera.fov * Math.PI / 360) * 12
    center.current.set((px / size.width * 2 - 1) * halfH * camera.aspect, (1 - py / size.height * 2) * halfH, 0)
    const scale = w * .085 / size.width * (halfH * camera.aspect * 2) / 2.8
    book.setRestPose(center.current, scale, mobile)
    journalMotion.draw?.()
  }, [get, mobile, size])
  useFrame(({ gl, camera }, dt) => {
    const book = bookRef.current
    if (!book) return
    book.group.visible = journalMotion.opacity > .001
    book.setProgress(journalMotion.progress)
    book.setClosing(journalMotion.closing)
    if (book.group.visible) book.update(Math.min(dt, .05))
    const approach = deskMotion.approach, prize = deskMotion.prize, reveal = deskMotion.prizeOpacity
    if (approach > 0 && book.group.visible) {
      tableBook.current.set(mobile ? -1.8 : -3.5, -1.73, mobile ? .9 : .2)
      book.group.position.lerp(tableBook.current, approach)
      book.group.quaternion.slerp(tableRotation.current, approach)
      book.group.scale.multiplyScalar(1 - approach * .42)
    }
    const drift = Math.sin(deskMotion.drift * Math.PI)
    readingCamera.current.set(drift * .28, drift * .10, 12 - drift * .35)
    camera.position.copy(readingCamera.current); camera.lookAt(0, 0, 0)
    readingRotation.current.copy(camera.quaternion)
    aim.current.up.set(0, 0, -1)
    // Overhead reading holds stay centered; the orbit resolves before the ink appears.
    const sealArc = Math.sin(prize * Math.PI) * reveal
    aim.current.position.set(sealArc * .12, 11.1 + sealArc * .18, .08 + sealArc * .12)
    aim.current.lookAt(0, -1.5, 0)
    camera.position.lerp(aim.current.position, approach)
    camera.quaternion.slerpQuaternions(readingRotation.current, aim.current.quaternion, approach)
    const broadcast = deskMotion.broadcast
    if (broadcast > 0) {
      aim.current.up.set(0,1,0)
      aim.current.position.set(mobile ? .648 : 2.018, mobile ? -.10 : .55, mobile ? 1.1 : 1.0)
      aim.current.lookAt(mobile ? .648 : 2.018, mobile ? -.757 : -.19, mobile ? -2.632 : -2.339)
      camera.position.lerp(aim.current.position,broadcast)
      camera.quaternion.slerp(aim.current.quaternion,broadcast)
    }
    camera.updateMatrixWorld()
    deskRef.current?.update(mobile, size.width / size.height, dt)
    const screen=deskRef.current?.screen, readout=document.querySelector<HTMLElement>('.bunker-experience:not(.bunker-experience--reduced) .desk-broadcast')
    if(screen && readout && broadcast > .01){
      screen.updateWorldMatrix(true,false)
      const positions=[[-1.118445,.846084],[1.118445,.846084],[-1.118445,-.846084],[1.118445,-.846084]]
      const projected=corners.current.map((v,i)=>v.set(positions[i][0],positions[i][1],0).applyMatrix4(screen.matrixWorld).project(camera))
      const points=projected.map(v=>({x:(v.x+1)*size.width/2,y:(1-v.y)*size.height/2}))
      // Project the actual glass corners, preserving perspective through the approach.
      const [tl,tr,bl,br]=points
      const dx1=tr.x-br.x,dx2=bl.x-br.x,dy1=tr.y-br.y,dy2=bl.y-br.y
      const dx3=tl.x-tr.x+br.x-bl.x,dy3=tl.y-tr.y+br.y-bl.y
      const determinant=dx1*dy2-dx2*dy1
      if(Math.abs(determinant)>.00001){
        const g=(dx3*dy2-dx2*dy3)/determinant,h=(dx1*dy3-dx3*dy1)/determinant
        const a=tr.x-tl.x+g*tr.x,b=bl.x-tl.x+h*bl.x,d=tr.y-tl.y+g*tr.y,e=bl.y-tl.y+h*bl.y
        Object.assign(readout.style,{left:'0px',top:'0px',width:'1024px',height:'768px',transformOrigin:'0 0',transform:`matrix3d(${a/1024},${d/1024},0,${g/1024},${b/768},${e/768},0,${h/768},0,0,1,0,${tl.x},${tl.y},0,1)`})
      }
    }
    const surface = gl.domElement.closest<HTMLElement>('.journal-world')
    if (surface) {
      surface.style.opacity = String(Math.max(journalMotion.opacity, deskMotion.opacity))
      surface.style.backgroundColor = `rgba(8, 6, 3, ${deskMotion.opacity})`
    }
    clearTimeout(crtFrame.current)
    if (broadcast > .01) crtFrame.current = setTimeout(invalidate, 50)
    if (settling.current-- > 0 && (book.group.visible || deskMotion.opacity > .001)) invalidate()
  })
  return <>
    <hemisphereLight args={['#e4d5b5', '#332619', .85]} />
    <directionalLight position={[3, 6, 9]} color="#ffd3a0" intensity={2.4} castShadow={!mobile}
      shadow-mapSize={[2048, 2048]} shadow-camera-left={-14} shadow-camera-right={14}
      shadow-camera-top={12} shadow-camera-bottom={-12} shadow-normalBias={.015} shadow-bias={-.0001} />
    <directionalLight position={[-2, 8, -5]} color="#c1c8c8" intensity={.55} />
    <directionalLight position={[-5, 2, 5]} color="#d1d4cf" intensity={.7} />
  </>
}

