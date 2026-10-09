import * as THREE from 'three';
import { createOccultBook } from './OccultBook.mjs';
import { hackathon } from './hackathon-data.mjs';

/** Mount a complete scene inside your own element. No global styles or UI. */
export async function mountD3COYBook(container, {
  event = hackathon,
  scrollElement = null,
  autoScroll = Boolean(scrollElement),
  maxPixelRatio = 2,
} = {}) {
  if (!container || typeof container.appendChild !== 'function') {
    throw new TypeError('mountD3COYBook requires a DOM container.');
  }
  if (document.fonts) {
    await document.fonts.load('32px "Segoe Print"');
    await document.fonts.ready;
  }
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'D3COY interactive hackathon diary');
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x14110d);
  scene.fog = new THREE.Fog(0x14110d, 12, 28);
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 60);
  camera.position.set(6, 7, 10);
  camera.lookAt(0, 1.5, 0);
  scene.add(new THREE.HemisphereLight(0xd9d3c6, 0x8b7760, .4));
  const key = new THREE.SpotLight(0xffd3a0, 150, 30, .75, .55, 2);
  key.position.set(-3, 8, 4);
  key.target.position.set(0, 1, 0);
  key.castShadow = true;
  const shadowSize = Math.min(2048, renderer.capabilities.maxTextureSize);
  key.shadow.mapSize.set(shadowSize, shadowSize);
  key.shadow.bias = -.00008;
  key.shadow.normalBias = .004;
  key.shadow.camera.near = .3;
  key.shadow.camera.far = 22;
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xffebd0, 1.05);
  fill.position.set(6, 8, 12);
  scene.add(fill);
  const rim = new THREE.PointLight(0xffe6c5, 9, 20, 2);
  rim.position.set(4, 4, -4);
  scene.add(rim);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x27221c);
  for (const [position, color, strength] of [
    [[0, 7, 0], 0xffd9a7, 4], [[-5, 2, 4], 0xd6d1c5, 2], [[5, 3, -4], 0xffb66e, 3],
  ]) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(4, 4),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength), side: THREE.DoubleSide }));
    panel.position.fromArray(position);
    panel.lookAt(0, 0, 0);
    envScene.add(panel);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(envScene, .08);
  scene.environment = environment.texture;
  pmrem.dispose();
  envScene.traverse(o => { o.geometry?.dispose(); o.material?.dispose(); });
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const context = canvas.getContext('2d');
  context.fillStyle = '#483321';
  context.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 1600; i++) {
    context.strokeStyle = `rgba(12,6,3,${.02 + (i % 7) * .014})`;
    context.beginPath();
    context.moveTo(0, i * 512 / 1600);
    context.bezierCurveTo(160, i * 512 / 1600 + Math.sin(i) * 5, 350, i * 512 / 1600 - 4, 512, i * 512 / 1600);
    context.stroke();
  }
  for (let i = 0; i < 4; i++) {
    context.fillStyle = '#1f160f'; context.fillRect(i * 128, 0, 2, 512);
  }
  const wood = new THREE.CanvasTexture(canvas);
  wood.colorSpace = THREE.SRGBColorSpace;
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(3, 3);
  const table = new THREE.Mesh(new THREE.BoxGeometry(18, .22, 14),
    new THREE.MeshStandardMaterial({ map: wood, bumpMap: wood, bumpScale: .022, roughness: .78 }));
  table.position.y = -.18;
  table.receiveShadow = true;
  scene.add(table);
  const book = createOccultBook({ pageCount: 3, event });
  scene.add(book.group);
  let disposed = false;
  const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));
  function setProgress(progress) { if (!disposed) book.setProgress(clamp(progress)); }
  function syncScroll() {
    if (!scrollElement || disposed) return;
    const bounds = scrollElement.getBoundingClientRect();
    setProgress(-bounds.top / Math.max(1, bounds.height - window.innerHeight));
  }
  function resize() {
    if (disposed) return;
    const width = Math.max(1, container.clientWidth), height = Math.max(1, container.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 700 ? 58 : 38;
    camera.updateProjectionMatrix();
    book.setView(camera);
    if (autoScroll) syncScroll();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  if (autoScroll) window.addEventListener('scroll', syncScroll, { passive: true });
  let previous = performance.now();
  renderer.setAnimationLoop(now => {
    book.update(Math.min(.08, (now - previous) / 1000));
    previous = now;
    renderer.render(scene, camera);
  });
  return {
    book, scene, camera, renderer, setProgress, resize,
    goToSection(index) {
      const progress = [.36, .57, .77, .98][Math.max(0, Math.min(3, Math.floor(index) || 0))];
      if (autoScroll && scrollElement) {
        const top = window.scrollY + scrollElement.getBoundingClientRect().top;
        window.scrollTo({ top: top + progress * Math.max(1, scrollElement.getBoundingClientRect().height - window.innerHeight), behavior: 'smooth' });
      } else setProgress(progress);
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      renderer.setAnimationLoop(null);
      observer.disconnect();
      window.removeEventListener('scroll', syncScroll);
      book.dispose();
      table.geometry.dispose();
      table.material.dispose();
      wood.dispose();
      environment.dispose();
      scene.traverse(object => {
        if (object.isLight) object.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
