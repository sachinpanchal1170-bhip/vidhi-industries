import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'

/* ───────────── helpers ───────────── */
let seed = 1
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
const R = (a, b) => a + rnd() * (b - a)
const pick = (arr) => arr[Math.floor(rnd() * arr.length)]

function valueNoise(size, octaves = 5, base = 4) {
  const out = new Float32Array(size * size)
  let amp = 1, total = 0
  for (let o = 0; o < octaves; o++) {
    const g = base * 2 ** o
    const grid = Array.from({ length: (g + 1) * (g + 1) }, () => rnd())
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const gx = (x / size) * g, gy = (y / size) * g
        const x0 = Math.floor(gx), y0 = Math.floor(gy)
        const fx = gx - x0, fy = gy - y0
        const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
        const i = (yy, xx) => grid[(yy % (g + 1)) * (g + 1) + (xx % (g + 1))]
        const a = i(y0, x0), b = i(y0, x0 + 1), c = i(y0 + 1, x0), d = i(y0 + 1, x0 + 1)
        out[y * size + x] += amp * (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy)
      }
    total += amp
    amp *= 0.5
  }
  for (let i = 0; i < out.length; i++) out[i] /= total
  return out
}

function canvasTex(size, painter, srgb = true, repeat = [1, 1]) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  painter(ctx, size)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(...repeat)
  t.anisotropy = 8
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Steel: mill scale / brushed variation (albedo) + roughness
function steelMaps({ tint = [150, 156, 164], scale = 0.35, streak = true, rust = 0.0, repeat = [1, 1] } = {}) {
  const size = 512
  const n = valueNoise(size, 6, 3)
  const n2 = valueNoise(size, 4, 12)
  const rows = Array.from({ length: size }, () => rnd())
  for (let k = 0; k < 3; k++) for (let y = 1; y < size - 1; y++) rows[y] = (rows[y - 1] + rows[y] * 2 + rows[y + 1]) / 4
  const albedo = canvasTex(size, (ctx) => {
    const img = ctx.createImageData(size, size)
    for (let i = 0; i < size * size; i++) {
      const y = Math.floor(i / size)
      const s = streak ? (rows[y] - 0.5) * 0.12 : 0
      let k = 0.78 + (n[i] - 0.5) * scale + s
      let [r, g, b] = tint.map((c) => c * k)
      if (rust > 0 && n2[i] > 1 - rust) {
        const t = (n2[i] - (1 - rust)) / rust
        r = r * (1 - t) + 120 * t; g = g * (1 - t) + 62 * t; b = b * (1 - t) + 34 * t
      }
      img.data.set([r, g, b, 255], i * 4)
    }
    ctx.putImageData(img, 0, 0)
  }, true, repeat)
  const rough = canvasTex(size, (ctx) => {
    const img = ctx.createImageData(size, size)
    for (let i = 0; i < size * size; i++) {
      const y = Math.floor(i / size)
      const s = streak ? (rows[y] - 0.5) * 70 : 0
      const v = 95 + n[i] * 80 + s
      img.data.set([v, v, v, 255], i * 4)
    }
    ctx.putImageData(img, 0, 0)
  }, false, repeat)
  return { albedo, rough }
}

function concreteMaps(repeat = [6, 6]) {
  const size = 512
  const n = valueNoise(size, 7, 4)
  const n2 = valueNoise(size, 3, 2)
  const albedo = canvasTex(size, (ctx) => {
    const img = ctx.createImageData(size, size)
    for (let i = 0; i < size * size; i++) {
      const v = 46 + n[i] * 44 - n2[i] * 22 + (rnd() - 0.5) * 8
      img.data.set([v * 0.95, v * 0.97, v, 255], i * 4)
    }
    ctx.putImageData(img, 0, 0)
    // expansion joints
    ctx.strokeStyle = 'rgba(20,20,22,0.55)'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, size, size)
  }, true, repeat)
  const rough = canvasTex(size, (ctx) => {
    const img = ctx.createImageData(size, size)
    for (let i = 0; i < size * size; i++) {
      const v = 150 + n[i] * 90 - n2[i] * 120 // some polished / wet patches
      img.data.set([v, v, v, 255], i * 4)
    }
    ctx.putImageData(img, 0, 0)
  }, false, repeat)
  return { albedo, rough }
}

const glowTexture = (() => {
  let t
  return () => {
    if (t) return t
    t = canvasTex(256, (ctx, s) => {
      const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.12, 'rgba(255,240,215,0.9)')
      g.addColorStop(0.35, 'rgba(255,170,90,0.35)')
      g.addColorStop(1, 'rgba(255,120,40,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, s, s)
    })
    return t
  }
})()

function steelMat(opts = {}) {
  const { albedo, rough } = steelMaps(opts)
  return new THREE.MeshStandardMaterial({
    color: opts.color ?? 0xffffff,
    map: albedo,
    roughnessMap: rough,
    roughness: opts.roughness ?? 0.55,
    metalness: opts.metalness ?? 1,
    envMapIntensity: opts.env ?? 1,
  })
}
function primerMat() {
  return steelMat({ tint: [150, 70, 38], metalness: 0.15, roughness: 0.75, streak: false, scale: 0.25 })
}

/* ───────────── profile geometry ───────────── */
function extrudeProfile(shape, length, bevel = 0.004) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 12 })
  g.translate(0, 0, -length / 2)
  return g
}
function iBeam(h = 0.3, w = 0.15, tf = 0.016, tw = 0.009, len = 4) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, -h / 2 + tf); s.lineTo(tw / 2, -h / 2 + tf)
  s.lineTo(tw / 2, h / 2 - tf); s.lineTo(w / 2, h / 2 - tf); s.lineTo(w / 2, h / 2); s.lineTo(-w / 2, h / 2)
  s.lineTo(-w / 2, h / 2 - tf); s.lineTo(-tw / 2, h / 2 - tf); s.lineTo(-tw / 2, -h / 2 + tf); s.lineTo(-w / 2, -h / 2 + tf); s.closePath()
  return extrudeProfile(s, len)
}
function channel(h = 0.2, w = 0.075, t = 0.009, len = 4) {
  const s = new THREE.Shape()
  s.moveTo(0, -h / 2); s.lineTo(w, -h / 2); s.lineTo(w, -h / 2 + t); s.lineTo(t, -h / 2 + t); s.lineTo(t, h / 2 - t)
  s.lineTo(w, h / 2 - t); s.lineTo(w, h / 2); s.lineTo(0, h / 2); s.closePath()
  return extrudeProfile(s, len)
}
function angleSec(a = 0.075, t = 0.008, len = 4) {
  const s = new THREE.Shape()
  s.moveTo(0, 0); s.lineTo(a, 0); s.lineTo(a, t); s.lineTo(t, t); s.lineTo(t, a); s.lineTo(0, a); s.closePath()
  return extrudeProfile(s, len, 0.002)
}
function boxTube(a = 0.08, b = 0.08, t = 0.004, len = 4) {
  const s = new THREE.Shape()
  s.moveTo(-a / 2, -b / 2); s.lineTo(a / 2, -b / 2); s.lineTo(a / 2, b / 2); s.lineTo(-a / 2, b / 2); s.closePath()
  const h = new THREE.Path()
  h.moveTo(-a / 2 + t, -b / 2 + t); h.lineTo(-a / 2 + t, b / 2 - t); h.lineTo(a / 2 - t, b / 2 - t); h.lineTo(a / 2 - t, -b / 2 + t); h.closePath()
  s.holes.push(h)
  return extrudeProfile(s, len, 0.003)
}
function pipe(r = 0.05, t = 0.005, len = 4) {
  const s = new THREE.Shape(); s.absarc(0, 0, r, 0, Math.PI * 2, false)
  const h = new THREE.Path(); h.absarc(0, 0, r - t, 0, Math.PI * 2, true); s.holes.push(h)
  const g = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, curveSegments: 40 })
  g.translate(0, 0, -len / 2)
  return g
}
function ringPlate(ro, ri, thick, holes = 0, holeR = 0.01, pcd = 0) {
  const s = new THREE.Shape(); s.absarc(0, 0, ro, 0, Math.PI * 2, false)
  if (ri > 0) { const h = new THREE.Path(); h.absarc(0, 0, ri, 0, Math.PI * 2, true); s.holes.push(h) }
  for (let i = 0; i < holes; i++) {
    const a = (i / holes) * Math.PI * 2
    const h = new THREE.Path(); h.absarc(Math.cos(a) * pcd, Math.sin(a) * pcd, holeR, 0, Math.PI * 2, true); s.holes.push(h)
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: true, bevelSize: thick * 0.12, bevelThickness: thick * 0.12, bevelSegments: 3, curveSegments: 64 })
  g.rotateX(-Math.PI / 2)
  return g
}
function hexNut(r = 0.03, hole = 0.016, thick = 0.025) {
  const s = new THREE.Shape()
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r) }
  s.closePath()
  const h = new THREE.Path(); h.absarc(0, 0, hole, 0, Math.PI * 2, true); s.holes.push(h)
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: true, bevelSize: thick * 0.15, bevelThickness: thick * 0.15, bevelSegments: 3, curveSegments: 32 })
  g.rotateX(-Math.PI / 2)
  return g
}
function gear(teeth = 24, r = 0.12, depth = 0.014, thick = 0.03, bore = 0.03) {
  const s = new THREE.Shape()
  const steps = teeth * 4
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const phase = i % 4
    const rr = phase === 1 || phase === 2 ? r : r - depth
    const p = [Math.cos(a) * rr, Math.sin(a) * rr]
    i ? s.lineTo(...p) : s.moveTo(...p)
  }
  const h = new THREE.Path(); h.absarc(0, 0, bore, 0, Math.PI * 2, true); s.holes.push(h)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    const hh = new THREE.Path(); hh.absarc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.14, 0, Math.PI * 2, true); s.holes.push(hh)
  }
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: true, bevelSize: 0.002, bevelThickness: 0.002, curveSegments: 24 })
  g.rotateX(-Math.PI / 2)
  return g
}
function bolt(len = 0.12, r = 0.012) {
  const pts = [new THREE.Vector2(0, 0)]
  const pitch = 0.004
  for (let y = 0; y < len; y += pitch / 2) pts.push(new THREE.Vector2(r - ((y / (pitch / 2)) % 2 ? 0.0012 : 0), y))
  pts.push(new THREE.Vector2(r, len), new THREE.Vector2(0, len))
  const shank = new THREE.LatheGeometry(pts, 32)
  const head = hexNut(r * 1.7, 0.0001, r * 0.8)
  head.translate(0, len, 0)
  return BufferGeometryUtils.mergeGeometries([shank.toNonIndexed(), head.toNonIndexed()])
}

/* ───────────── effects ───────────── */
function addSparks(scene, origin, { count = 600, dir = new THREE.Vector3(0, 1, 0), spread = 1.2, speed = 1, gravity = 1, length = 1, floorY = -Infinity } = {}) {
  const pos = [], col = []
  for (let i = 0; i < count; i++) {
    const d = dir.clone().normalize()
    const rand = new THREE.Vector3(R(-1, 1), R(-1, 1), R(-1, 1)).normalize().multiplyScalar(R(0, spread))
    const v = d.add(rand).normalize().multiplyScalar(R(0.4, 1.6) * speed)
    let p = origin.clone()
    const steps = Math.floor(R(4, 16) * length)
    const dt = 0.018
    const heat = rnd()
    // only draw the tail end segment of the trajectory (motion streak)
    const startAt = Math.floor(R(0, steps * 0.7))
    for (let s = 0; s < steps; s++) {
      const np = p.clone().addScaledVector(v, dt)
      v.y -= 9.8 * gravity * dt * 0.35
      if (np.y < floorY) { v.y = Math.abs(v.y) * 0.35; np.y = floorY }
      if (s >= startAt) {
        pos.push(p.x, p.y, p.z, np.x, np.y, np.z)
        const t = (s - startAt) / Math.max(1, steps - startAt)
        const c1 = heat > 0.6 ? [1, 0.95, 0.8] : [1, 0.62 + 0.2 * heat, 0.25]
        const fade = 1 - t * 0.6
        col.push(...c1.map((c) => c * 1.8 * fade), ...c1.map((c) => c * 1.8 * fade * 0.7))
      }
      p = np
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  const m = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  scene.add(new THREE.LineSegments(g, m))
}
function addGlow(scene, at, size = 0.6, color = 0xffd2a0, intensity = 1) {
  const sm = new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, opacity: intensity })
  const s = new THREE.Sprite(sm)
  s.position.copy(at)
  s.scale.setScalar(size)
  scene.add(s)
  return s
}
function addDust(scene, box, count = 1500, color = 0xc8d4e0, size = 0.008, opacity = 0.18) {
  count = Math.floor(count * 0.4)
  const p = []
  for (let i = 0; i < count; i++) p.push(R(box[0], box[1]), R(box[2], box[3]), R(box[4], box[5]))
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color, size, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })))
}
function addShaft(scene, from, to, width = 1.5, opacity = 0.08, color = 0xa9c4e0) {
  const len = from.distanceTo(to)
  const tex = canvasTex(64, (ctx, s) => {
    const g = ctx.createLinearGradient(0, 0, 0, s); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s)
    const g2 = ctx.createLinearGradient(0, 0, s, 0); g2.addColorStop(0, 'rgba(0,0,0,1)'); g2.addColorStop(0.5, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,1)')
    ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = g2; ctx.fillRect(0, 0, s, s)
  })
  const m = new THREE.MeshBasicMaterial({ map: tex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false })
  for (let k = 0; k < 2; k++) {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, len), m)
    plane.position.copy(from).lerp(to, 0.5)
    plane.lookAt(to)
    plane.rotateX(Math.PI / 2)
    plane.rotateY(k * Math.PI / 2)
    scene.add(plane)
  }
}

const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: R(0, 100) }, uVignette: { value: 0.9 }, uGrain: { value: 0.045 }, uRes: { value: new THREE.Vector2(1, 1) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform float uVignette; uniform float uGrain; uniform vec2 uRes; varying vec2 vUv;
  float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uTime) * 43758.5453); }
  void main(){
    vec4 c = texture2D(tDiffuse, vUv);
    // split-tone: cool shadows, warm highlights
    float l = dot(c.rgb, vec3(0.299,0.587,0.114));
    c.rgb = mix(c.rgb * vec3(0.92,0.98,1.08), c.rgb * vec3(1.05,1.0,0.94), smoothstep(0.2,0.8,l));
    // vignette
    vec2 d = vUv - 0.5; d.x *= uRes.x/uRes.y;
    c.rgb *= mix(1.0, 1.0 - uVignette*0.55, smoothstep(0.35, 1.05, length(d)));
    // grain
    c.rgb += (h(vUv*uRes) - 0.5) * uGrain;
    gl_FragColor = c;
  }`,
}

function setup({ w, h, fov = 40, bg = 0x0a1118, fog = 0.06, exposure = 1.0, envIntensity = 0.5 }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(1)
  renderer.setSize(w, h)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = exposure
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  document.body.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(bg)
  if (fog) scene.fog = new THREE.FogExp2(bg, fog)
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = envIntensity
  const camera = new THREE.PerspectiveCamera(fov, w / h, 0.05, 200)
  return { renderer, scene, camera }
}

function finish({ renderer, scene, camera, w, h }, { bloom = [0.9, 0.5, 0.75], dof = null, vignette = 0.9, grain = 0.04 } = {}) {
  const composer = new EffectComposer(renderer)
  composer.setPixelRatio(1)
  composer.setSize(w, h)
  composer.addPass(new RenderPass(scene, camera))
  if (dof) composer.addPass(new BokehPass(scene, camera, { focus: dof.focus, aperture: dof.aperture, maxblur: dof.maxblur ?? 0.008 }))
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), ...bloom))
  composer.addPass(new OutputPass())
  const grade = new ShaderPass(GradeShader)
  grade.uniforms.uRes.value.set(w, h)
  grade.uniforms.uVignette.value = vignette
  grade.uniforms.uGrain.value = grain
  composer.addPass(grade)
  composer.render()
}

function floor(scene, size = 60, repeat = [10, 10], y = 0) {
  const { albedo, rough } = concreteMaps(repeat)
  const m = new THREE.MeshStandardMaterial({ map: albedo, roughnessMap: rough, roughness: 0.9, metalness: 0, envMapIntensity: 0.6 })
  const f = new THREE.Mesh(new THREE.PlaneGeometry(size, size), m)
  f.rotation.x = -Math.PI / 2
  f.position.y = y
  f.receiveShadow = true
  scene.add(f)
  return f
}
function mesh(geo, mat, pos, rot = [0, 0, 0], shadow = true) {
  const m = new THREE.Mesh(geo, mat)
  m.position.set(...pos)
  m.rotation.set(...rot)
  m.castShadow = shadow
  m.receiveShadow = true
  return m
}
function spot(scene, color, intensity, pos, target, angle = 0.5, penumbra = 0.8, shadow = true) {
  const l = new THREE.SpotLight(color, intensity, 0, angle, penumbra, 1.6)
  l.position.set(...pos)
  l.target.position.set(...target)
  l.castShadow = shadow
  l.shadow.mapSize.set(2048, 2048)
  l.shadow.bias = -0.0004
  scene.add(l, l.target)
  return l
}

function corrugatedMat(tint = [52, 60, 72]) {
  const albedo = canvasTex(512, (ctx, s) => {
    for (let x = 0; x < s; x++) {
      const k = 0.75 + 0.25 * Math.sin((x / s) * Math.PI * 2 * 16)
      const n = 0.9 + rnd() * 0.1
      ctx.fillStyle = `rgb(${tint[0] * k * n},${tint[1] * k * n},${tint[2] * k * n})`
      ctx.fillRect(x, 0, 1, s)
    }
  }, true, [6, 1])
  return new THREE.MeshStandardMaterial({ map: albedo, metalness: 0.6, roughness: 0.6, envMapIntensity: 0.4 })
}
function room(scene, { w = 30, d = 40, h = 10, zBack = -30, windows = true } = {}) {
  const m = corrugatedMat()
  const back = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); back.position.set(0, h / 2, zBack); back.receiveShadow = true; scene.add(back)
  for (const sx of [-1, 1]) { const wall = new THREE.Mesh(new THREE.PlaneGeometry(d, h), m); wall.position.set((sx * w) / 2, h / 2, zBack + d / 2); wall.rotation.y = -sx * Math.PI / 2; wall.receiveShadow = true; scene.add(wall) }
  if (windows) {
    const wm = new THREE.MeshBasicMaterial({ color: 0x8fb4dc, toneMapped: true })
    for (let i = -3; i <= 3; i++) { const win = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.0), wm); win.position.set(i * 3.6, h - 1.6, zBack + 0.02); scene.add(win) }
  }
}

/* ───────────── scenes ───────────── */
const scenes = {
  // Wide workshop interior with welding station
  workshop(ctx, o) {
    const { scene, camera } = ctx
    const steel = steelMat({ tint: [120, 128, 138] })
    const dark = steelMat({ tint: [70, 76, 84], roughness: 0.6 })
    const primer = primerMat()
    floor(scene, 80, [14, 14])
    room(scene, { w: 15, d: 50, h: 10, zBack: -42 })
    // columns & roof trusses receding
    for (let i = 0; i < 7; i++) {
      const z = -i * 6 - 2
      for (const x of [-7, 7]) scene.add(mesh(iBeam(0.4, 0.2, 0.02, 0.012, 9), dark, [x, 4.5, z], [Math.PI / 2, 0, Math.PI / 2]))
      scene.add(mesh(iBeam(0.35, 0.18, 0.018, 0.01, 14.4), dark, [0, 8.6, z], [0, Math.PI / 2, 0]))
      for (let k = -6; k <= 6; k += 1.5) {
        const a = mesh(angleSec(0.06, 0.006, 1.6), dark, [k, 7.9, z], [Math.PI / 2, 0, (k % 3 === 0 ? 0.6 : -0.6)], false)
        scene.add(a)
      }
    }
    // workbench (welding table)
    const tx = o.tx ?? 1.2, tz = o.tz ?? -2
    const top = mesh(new THREE.BoxGeometry(3.2, 0.06, 1.4), steelMat({ tint: [95, 100, 108], roughness: 0.45 }), [tx, 0.9, tz])
    scene.add(top)
    for (const [dx, dz] of [[-1.5, -0.6], [1.5, -0.6], [-1.5, 0.6], [1.5, 0.6]]) scene.add(mesh(boxTube(0.06, 0.06, 0.004, 0.9), dark, [tx + dx, 0.45, tz + dz], [Math.PI / 2, 0, 0]))
    // workpiece: I-beam with welded plate
    scene.add(mesh(iBeam(0.2, 0.1, 0.012, 0.007, 2.4), steel, [tx - 0.2, 1.03, tz], [0, Math.PI / 2, 0]))
    scene.add(mesh(new THREE.BoxGeometry(0.02, 0.32, 0.32), primer, [tx + 0.6, 1.09, tz]))
    // torch
    const torch = mesh(new THREE.CylinderGeometry(0.018, 0.026, 0.35, 24), steelMat({ tint: [180, 150, 90], roughness: 0.3 }), [tx + 0.75, 1.32, tz + 0.12], [0.5, 0, 0.6])
    scene.add(torch)
    const arc = new THREE.Vector3(tx + 0.6, 1.15, tz + 0.05)
    addGlow(scene, arc, 0.26, 0xffd2a0, 0.75)
    addGlow(scene, arc, 0.06, 0xffffff, 1)
    const pl = new THREE.PointLight(0xffa860, 6, 0, 2); pl.position.copy(arc).add(new THREE.Vector3(0, 0.25, 0.35)); pl.castShadow = true; pl.shadow.mapSize.set(1024, 1024); scene.add(pl)
    addSparks(scene, arc, { count: 420, dir: new THREE.Vector3(0.2, 1, 0.4), spread: 1.5, speed: 2.6, gravity: 0.9, length: 1.3, floorY: 0.0 })
    // gas cylinders + welding power source behind the table
    const cylMat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.45, metalness: 0.3 })
    ;[[0x7a1f1f, -0.9], [0x1c1f24, -0.6]].forEach(([c, dx]) => {
      scene.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.3, 32), cylMat(c), [tx + dx, 0.65, tz - 1.1]))
      scene.add(mesh(new THREE.SphereGeometry(0.12, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), cylMat(c), [tx + dx, 1.3, tz - 1.1]))
      scene.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.12, 16), steelMat({ tint: [190, 160, 90], roughness: 0.3 }), [tx + dx, 1.46, tz - 1.1]))
    })
    const box = mesh(new THREE.BoxGeometry(0.55, 0.45, 0.35), new THREE.MeshStandardMaterial({ color: 0x1d3654, roughness: 0.5, metalness: 0.4 }), [tx + 1.0, 0.225, tz - 1.0], [0, -0.3, 0])
    scene.add(box)
    scene.add(mesh(new THREE.BoxGeometry(0.3, 0.12, 0.01), new THREE.MeshStandardMaterial({ color: 0x0b1828, emissive: 0xe58a35, emissiveIntensity: 0.4 }), [tx + 0.95, 0.33, tz - 0.82], [0, -0.3, 0], false))
    // second fabricated frame on trestles
    for (const dz of [-0.35, 0.35]) scene.add(mesh(boxTube(0.06, 0.06, 0.004, 2.2), steel, [tx - 3.2, 0.75, tz + 0.6 + dz], [0, Math.PI / 2 + 0.2, 0]))
    for (const dx of [-0.8, 0.8]) scene.add(mesh(new THREE.BoxGeometry(0.08, 0.72, 0.9), dark, [tx - 3.2 + dx, 0.36, tz + 0.6], [0, 0.2, 0]))
    // material racks on the left: stacked pipes and sheets
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6 - r; c++) scene.add(mesh(pipe(0.07, 0.006, 4), steel, [-4.6 + c * 0.145 + r * 0.072, 0.07 + r * 0.125, -3.5], [0, 0.15, 0]))
    for (let s = 0; s < 10; s++) scene.add(mesh(new THREE.BoxGeometry(2.4, 0.012, 1.2), steelMat({ tint: [140, 146, 154], roughness: 0.35 }), [-3.4 + R(-0.02, 0.02), 0.1 + s * 0.016, -7], [0, 0.4 + R(-0.02, 0.02), 0]))
    scene.add(mesh(new THREE.BoxGeometry(2.5, 0.1, 1.3), primer, [-3.4, 0.05, -7], [0, 0.4, 0]))
    // background beam stack
    for (let k = 0; k < 5; k++) scene.add(mesh(iBeam(0.25, 0.12, 0.014, 0.008, 6), primer, [4.5, 0.13 + Math.floor(k / 3) * 0.26, -10 + (k % 3) * 0.32], [0, 0.05, 0]))
    // lights
    scene.add(new THREE.HemisphereLight(0x8fa8c8, 0x1a1410, 0.16))
    spot(scene, 0xbcd4f0, 110, [-3, 12, -12], [0, 0, -4], 0.55, 0.9)
    spot(scene, 0xffd2a8, 22, [6, 6, 4], [tx, 1, tz], 0.35, 0.9)
    const fill = new THREE.DirectionalLight(0x9db6d6, 0.5); fill.position.set(-5, 5, 6); scene.add(fill)
    for (let i = 0; i < 4; i++) addShaft(scene, new THREE.Vector3(-4 + i * 3.5, 9, -6 - i * 4), new THREE.Vector3(-2 + i * 3.5, 0, -3 - i * 4), 1.6, 0.05)
    addDust(scene, [-8, 8, 0, 8, -25, 4], 2500)
    camera.position.set(o.cx ?? -1.2, o.cy ?? 1.55, o.cz ?? 4.2)
    camera.lookAt(o.lx ?? 0.6, o.ly ?? 1.6, o.lz ?? -4)
    return { bloom: [0.55, 0.35, 0.85] }
  },

  // Close-up weld on a T-joint
  welding(ctx, o) {
    const { scene, camera } = ctx
    const steel = steelMat({ tint: [125, 132, 142], roughness: 0.4 })
    const table = steelMat({ tint: [70, 74, 80], roughness: 0.55, rust: 0.08 })
    scene.add(mesh(new THREE.BoxGeometry(4, 0.05, 3), table, [0, -0.025, 0]))
    scene.add(mesh(new THREE.BoxGeometry(1.4, 0.016, 0.6), steel, [0, 0.008, 0]))
    scene.add(mesh(new THREE.BoxGeometry(1.4, 0.3, 0.016), steel, [0, 0.166, 0]))
    // weld bead (ripples) along the joint, partly done
    const bead = steelMat({ tint: [150, 120, 95], roughness: 0.35, streak: false })
    for (let i = 0; i < 70; i++) {
      const s = mesh(new THREE.SphereGeometry(0.014, 16, 10), bead, [-0.6 + i * 0.012, 0.02, 0.014], [0, 0, 0])
      s.scale.set(0.9, 0.6, 1)
      scene.add(s)
    }
    const arc = new THREE.Vector3(-0.6 + 70 * 0.012 + 0.01, 0.025, 0.02)
    // torch nozzle
    const nozzle = mesh(new THREE.CylinderGeometry(0.012, 0.02, 0.12, 32), steelMat({ tint: [200, 160, 90], roughness: 0.25 }), [arc.x + 0.05, arc.y + 0.08, arc.z + 0.05], [0.6, 0, -0.5])
    scene.add(nozzle)
    // heat tint glow on bead behind arc
    for (let i = 0; i < 10; i++) addGlow(scene, new THREE.Vector3(arc.x - i * 0.012, 0.022, 0.016), 0.03 - i * 0.002, 0xff6a10, 0.7 - i * 0.06)
    addGlow(scene, arc, 0.09, 0xffd8b0, 0.85)
    addGlow(scene, arc, 0.022, 0xffffff, 1)
    const pl = new THREE.PointLight(0xffb070, 0.05, 0, 2); pl.position.copy(arc).add(new THREE.Vector3(0.0, 0.09, 0.03)); pl.castShadow = true; scene.add(pl)
    addSparks(scene, arc, { count: 260, dir: new THREE.Vector3(0.6, 0.9, -0.2), spread: 1.2, speed: 0.55, gravity: 0.5, length: 1.1, floorY: 0 })
    scene.add(new THREE.HemisphereLight(0x8fa8c8, 0x0c0a08, 0.12))
    spot(scene, 0x9fb8d8, 6, [-1.5, 1.8, -1], [0, 0, 0], 0.5, 1)
    camera.position.set(o.cx ?? 0.38, o.cy ?? 0.22, o.cz ?? 0.55)
    camera.lookAt(arc.x - 0.08, 0.07, 0)
    return { dof: { focus: 0.55, aperture: 0.003, maxblur: 0.008 }, bloom: [0.55, 0.3, 0.85] }
  },

  // Plasma cutting through plate
  cutting(ctx, o) {
    const { scene, camera } = ctx
    const plate = steelMat({ tint: [118, 124, 132], roughness: 0.45, rust: 0.04 })
    const slats = steelMat({ tint: [60, 58, 56], roughness: 0.8, rust: 0.25 })
    // slatted cutting bed
    for (let i = -10; i <= 10; i++) scene.add(mesh(new THREE.BoxGeometry(0.008, 0.12, 1.5), slats, [i * 0.1, -0.07, 0]))
    scene.add(mesh(new THREE.BoxGeometry(2.4, 0.014, 1.6), plate, [0, 0.007, 0]))
    // cut kerf with cooling glow
    const pts = []
    for (let t = 0; t <= 1; t += 0.02) pts.push(new THREE.Vector3(-0.6 + t * 0.6, 0.0145, Math.sin(t * Math.PI) * 0.18 - 0.05))
    const curve = new THREE.CatmullRomCurve3(pts)
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 80, 0.003, 6), new THREE.MeshBasicMaterial({ color: 0x0a0a0a })))
    const head = pts[pts.length - 1]
    for (let i = 0; i < 18; i++) addGlow(scene, pts[pts.length - 1 - i], 0.025 - i * 0.001, 0xff6a10, 0.7 - i * 0.035)
    // torch head
    const torch = mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.22, 32), steelMat({ tint: [90, 95, 102], roughness: 0.35 }), [head.x, 0.14, head.z])
    scene.add(torch)
    scene.add(mesh(new THREE.CylinderGeometry(0.012, 0.022, 0.04, 32), steelMat({ tint: [205, 165, 95], roughness: 0.25 }), [head.x, 0.03, head.z]))
    addGlow(scene, head, 0.1, 0xd8e4ff, 0.85)
    addGlow(scene, head, 0.025, 0xffffff, 1)
    const pl = new THREE.PointLight(0xc8d8ff, 0.05, 0, 2); pl.position.copy(head).add(new THREE.Vector3(0.03, 0.06, 0.03)); scene.add(pl)
    const pl2 = new THREE.PointLight(0xff8a30, 0.3, 0, 2); pl2.position.copy(head).add(new THREE.Vector3(0, -0.08, 0)); scene.add(pl2)
    // sparks shooting down through the kerf and bouncing on the slats
    addSparks(scene, head.clone().add(new THREE.Vector3(0, -0.01, 0)), { count: 450, dir: new THREE.Vector3(0.6, -1, 0.3), spread: 0.9, speed: 2.4, gravity: 0.8, length: 1.6, floorY: -0.13 })
    addSparks(scene, head, { count: 80, dir: new THREE.Vector3(0, 1, 0), spread: 1.2, speed: 0.5, gravity: 0.8, length: 1 })
    scene.add(new THREE.HemisphereLight(0x8fa8c8, 0x0c0a08, 0.15))
    spot(scene, 0xa8c0e0, 10, [1.6, 2.2, -1.2], [0, 0, 0], 0.5, 1)
    camera.position.set(o.cx ?? -0.55, o.cy ?? 0.32, o.cz ?? 0.75)
    camera.lookAt(head.x - 0.15, 0.0, head.z - 0.05)
    return { dof: { focus: 0.85, aperture: 0.002, maxblur: 0.006 }, bloom: [0.55, 0.3, 0.85] }
  },

  // Stacked steel sections on timber skids
  beams(ctx, o) {
    const { scene, camera } = ctx
    floor(scene, 60, [8, 8])
    room(scene, { w: 16, d: 30, h: 8, zBack: -12 })
    const mats = [steelMat({ tint: [118, 126, 136], rust: 0.05 }), steelMat({ tint: [96, 102, 110], rust: 0.12 }), primerMat()]
    const wood = new THREE.MeshStandardMaterial({ color: 0x5a4430, roughness: 0.9 })
    for (const z of [-2.5, 0, 2.5]) scene.add(mesh(new THREE.BoxGeometry(2.6, 0.1, 0.12), wood, [0, 0.05, z]))
    const L = 7
    let y = 0.1
    for (let row = 0; row < 3; row++) {
      const mat = row === 1 ? mats[2] : mats[row === 0 ? 0 : 1]
      const n = 6 - row
      for (let i = 0; i < n; i++) {
        const x = -1.0 + i * 0.32 + row * 0.16
        scene.add(mesh(iBeam(0.3, 0.15, 0.016, 0.009, L), mat, [x, y + 0.15, R(-0.08, 0.08)], [0, R(-0.01, 0.01), 0]))
      }
      y += 0.3
      for (const z of [-2.2, 0.3, 2.6]) scene.add(mesh(new THREE.BoxGeometry(2.2, 0.06, 0.1), wood, [0, y + 0.03, z]))
      y += 0.06
    }
    // channels and angles nearby
    for (let i = 0; i < 8; i++) scene.add(mesh(angleSec(0.08, 0.008, 6), mats[1], [-2.2 + (i % 4) * 0.1, 0.1 + Math.floor(i / 4) * 0.09, 0.4], [0, 0, 0]))
    scene.add(new THREE.HemisphereLight(0x8fa8c8, 0x1a1410, 0.3))
    spot(scene, 0xffd2a8, 120, [-6, 5, 3], [0, 0.5, 0], 0.45, 0.8)
    spot(scene, 0x9dbadc, 60, [5, 7, -6], [0, 0, 0], 0.6, 1)
    addShaft(scene, new THREE.Vector3(-4, 8, -3), new THREE.Vector3(-1, 0, 0), 2.5, 0.05, 0xffe2c4)
    addDust(scene, [-5, 5, 0, 5, -8, 4], 1500, 0xffe8d0)
    camera.position.set(o.cx ?? 3.2, o.cy ?? 1.5, o.cz ?? 7.2)
    camera.lookAt(o.lx ?? -0.3, o.ly ?? 0.55, o.lz ?? 1.5)
    return { dof: { focus: 6.5, aperture: 0.0015, maxblur: 0.006 }, bloom: [0.5, 0.6, 0.85] }
  },

  // Steel frame against dusk sky
  structure(ctx, o) {
    const { scene, camera } = ctx
    scene.background = null
    // sky dome
    const sky = new THREE.Mesh(new THREE.SphereGeometry(90, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: {},
      vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `varying vec3 p; void main(){ float t = clamp(p.y*1.4+0.1,0.0,1.0); vec3 top=vec3(0.05,0.12,0.22); vec3 mid=vec3(0.28,0.33,0.42); vec3 hor=vec3(0.95,0.6,0.32);
        float sun = pow(max(dot(p, normalize(vec3(-0.6,0.12,-0.8))),0.0), 24.0);
        vec3 c = mix(hor, mid, smoothstep(0.0,0.35,t)); c = mix(c, top, smoothstep(0.35,1.0,t)); c += vec3(1.0,0.7,0.4)*sun*1.4; gl_FragColor=vec4(c,1.0); }`,
    }))
    scene.add(sky)
    scene.fog = new THREE.FogExp2(0x6c6e78, 0.012)
    const col = steelMat({ tint: [100, 108, 118], roughness: 0.5 })
    const primer = primerMat()
    const H = 4, bay = 5
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
      const x = i * bay - 7, z = -j * bay
      for (let lvl = 0; lvl < 3; lvl++) scene.add(mesh(iBeam(0.3, 0.3, 0.02, 0.012, H), col, [x, H / 2 + lvl * H, z], [Math.PI / 2, 0, 0]))
      for (let lvl = 1; lvl <= 3; lvl++) {
        if (i < 3) scene.add(mesh(iBeam(0.36, 0.17, 0.018, 0.01, bay), lvl === 3 ? primer : col, [x + bay / 2, lvl * H, z], [0, Math.PI / 2, 0]))
        if (j < 2) scene.add(mesh(iBeam(0.3, 0.15, 0.016, 0.009, bay), primer, [x, lvl * H - 0.03, z - bay / 2]))
        // connection plates
        scene.add(mesh(new THREE.BoxGeometry(0.42, 0.5, 0.02), col, [x + 0.16, lvl * H, z + 0.16]))
      }
      // X bracing in some bays
      if (j === 0 && i < 3 && (i + 1) % 2) {
        const len = Math.hypot(bay, H)
        const a = Math.atan2(H, bay)
        for (const s of [1, -1]) scene.add(mesh(angleSec(0.1, 0.01, len), col, [x + bay / 2, H / 2, z + 0.02], [0, Math.PI / 2, s * a]))
      }
    }
    const sun = new THREE.DirectionalLight(0xffc48a, 4); sun.position.set(-30, 8, -40); sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20 }); scene.add(sun)
    scene.add(new THREE.HemisphereLight(0x8fa8d0, 0x302820, 0.8))
    camera.fov = 50; camera.updateProjectionMatrix()
    camera.position.set(o.cx ?? 9, o.cy ?? 1.6, o.cz ?? 6)
    camera.lookAt(o.lx ?? -2, o.ly ?? 6, o.lz ?? -4)
    return { bloom: [0.35, 0.6, 0.9], vignette: 0.7 }
  },

  // Pipes and bent pipe work
  pipes(ctx, o) {
    const { scene, camera } = ctx
    floor(scene, 40, [6, 6])
    room(scene, { w: 12, d: 20, h: 6, zBack: -5 })
    const steel = steelMat({ tint: [150, 156, 164], roughness: 0.3 })
    const dark = steelMat({ tint: [100, 106, 114], roughness: 0.45 })
    // fabricated railing: bent tubes
    const r = 0.025
    for (let k = 0; k < 3; k++) {
      const z = -0.6 * k
      const path = new THREE.CurvePath()
      path.add(new THREE.LineCurve3(new THREE.Vector3(-1.5, 0, z), new THREE.Vector3(-1.5, 0.9, z)))
      path.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-1.5, 0.9, z), new THREE.Vector3(-1.5, 1.1, z), new THREE.Vector3(-1.3, 1.1, z)))
      path.add(new THREE.LineCurve3(new THREE.Vector3(-1.3, 1.1, z), new THREE.Vector3(1.3, 1.1, z)))
      path.add(new THREE.QuadraticBezierCurve3(new THREE.Vector3(1.3, 1.1, z), new THREE.Vector3(1.5, 1.1, z), new THREE.Vector3(1.5, 0.9, z)))
      path.add(new THREE.LineCurve3(new THREE.Vector3(1.5, 0.9, z), new THREE.Vector3(1.5, 0, z)))
      const t = new THREE.Mesh(new THREE.TubeGeometry(path, 300, r, 32), steel); t.castShadow = true; t.receiveShadow = true
      t.position.y = 0.0
      scene.add(t)
      for (let b = -1.2; b <= 1.25; b += 0.3) scene.add(mesh(new THREE.CylinderGeometry(0.009, 0.009, 1.06, 16), dark, [b, 0.55, z]))
      scene.add(mesh(new THREE.CylinderGeometry(0.016, 0.016, 3.0, 24), steel, [0, 0.55, z], [0, 0, Math.PI / 2]))
    }
    // pipe bends lying on floor
    for (let i = 0; i < 4; i++) {
      const torus = mesh(new THREE.TorusGeometry(0.22, 0.05, 32, 64, Math.PI / 2), steel, [1.2 + i * 0.4, 0.05, 1.2 + R(-0.2, 0.2)], [-Math.PI / 2, 0, R(0, 6)])
      scene.add(torus)
    }
    for (let i = 0; i < 5; i++) scene.add(mesh(pipe(0.045, 0.004, 3.5), dark, [-1.6 + i * 0.095, 0.045, 1.4], [0, 0.3, 0]))
    scene.add(new THREE.HemisphereLight(0x8fa8c8, 0x14100c, 0.35))
    spot(scene, 0xffd8b0, 80, [-4, 5, 4], [0, 0.6, 0], 0.5, 0.9)
    spot(scene, 0x8fb0e0, 50, [4, 4, -4], [0, 0.6, 0], 0.5, 1)
    spot(scene, 0xe58a35, 25, [3, 1.2, 3], [0, 0.8, 0], 0.4, 1, false)
    addDust(scene, [-4, 4, 0, 4, -4, 4], 1000)
    camera.position.set(o.cx ?? 2.4, o.cy ?? 1.5, o.cz ?? 3.4)
    camera.lookAt(o.lx ?? -0.2, o.ly ?? 0.7, o.lz ?? -0.4)
    return { dof: { focus: 3.6, aperture: 0.002, maxblur: 0.007 }, bloom: [0.4, 0.6, 0.85] }
  },

  // Machined components on a steel bench
  components(ctx, o) {
    const { scene, camera } = ctx
    const bench = steelMat({ tint: [74, 80, 88], roughness: 0.55, rust: 0.03, repeat: [3, 3] })
    scene.add(mesh(new THREE.BoxGeometry(6, 0.05, 4), bench, [0, -0.025, 0]))
    const bright = steelMat({ tint: [175, 180, 186], roughness: 0.22, streak: true })
    const mid = steelMat({ tint: [140, 146, 154], roughness: 0.35 })
    const blk = steelMat({ tint: [55, 58, 62], roughness: 0.45 })
    const placed = []
    const place = (geo, mat, rMin) => {
      for (let t = 0; t < 40; t++) {
        const x = R(-0.6, 0.6), z = R(-0.55, 0.3)
        if (placed.every((p) => Math.hypot(p[0] - x, p[1] - z) > p[2] + rMin)) {
          placed.push([x, z, rMin])
          const m = mesh(geo, mat, [x, 0, z], [0, R(0, 6), 0])
          scene.add(m)
          return m
        }
      }
    }
    place(ringPlate(0.26, 0.08, 0.03, 8, 0.018, 0.19), mid, 0.27)
    place(gear(28, 0.2, 0.016, 0.04, 0.04), bright, 0.21)
    place(ringPlate(0.18, 0.05, 0.04, 6, 0.014, 0.13), bright, 0.19)
    place(gear(18, 0.12, 0.014, 0.035, 0.025), mid, 0.13)
    for (let i = 0; i < 9; i++) place(hexNut(R(0.03, 0.05), 0.016, 0.03), pick([bright, mid, blk]), 0.06)
    for (let i = 0; i < 4; i++) {
      const b = place(bolt(R(0.14, 0.22), 0.014), mid, 0.16)
      if (b) { b.rotation.set(0, R(0, 6), Math.PI / 2); b.position.y = 0.022 }
    }
    for (let i = 0; i < 3; i++) place(ringPlate(R(0.06, 0.09), 0.02, 0.006), bright, 0.1)
    scene.add(new THREE.HemisphereLight(0xa8bcd8, 0x14100c, 0.25))
    // softbox overhead + warm rim
        spot(scene, 0xe8f0ff, 30, [0.4, 3, 0.8], [0, 0, 0], 0.6, 1)
    spot(scene, 0xffb070, 6, [-2.5, 0.9, -2.5], [0, 0, 0], 0.35, 1)
    scene.environmentIntensity = 0.45
    camera.position.set(o.cx ?? 0.25, o.cy ?? 0.55, o.cz ?? 0.85)
    camera.lookAt(0, 0, -0.12)
    return { dof: { focus: 1.0, aperture: 0.006, maxblur: 0.01 }, bloom: [0.25, 0.5, 0.9] }
  },

  // Steel sheets and box tubes
  sheets(ctx, o) {
    const { scene, camera } = ctx
    floor(scene, 40, [6, 6])
    room(scene, { w: 12, d: 20, h: 6, zBack: -4 })
    const sheet = steelMat({ tint: [150, 158, 168], roughness: 0.28, repeat: [1, 1] })
    const sheet2 = steelMat({ tint: [120, 126, 134], roughness: 0.4, rust: 0.04 })
    const primer = primerMat()
    scene.add(mesh(new THREE.BoxGeometry(2.6, 0.12, 1.35), primer, [0, 0.06, 0]))
    for (let s = 0; s < 22; s++) scene.add(mesh(new THREE.BoxGeometry(2.5, 0.01, 1.25), s % 5 ? sheet : sheet2, [R(-0.015, 0.015), 0.125 + s * 0.012, R(-0.015, 0.015)], [0, R(-0.008, 0.008), 0]))
    // leaning sheets
    for (let s = 0; s < 6; s++) scene.add(mesh(new THREE.BoxGeometry(2.5, 1.25, 0.008), sheet, [-0.2 + s * 0.02, 0.62, -1.2 - s * 0.03], [-0.18, 0, 0]))
    // box tube stack
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) scene.add(mesh(boxTube(0.08, 0.08, 0.004, 3.2), sheet2, [1.8 + c * 0.085, 0.04 + r * 0.085, 0.2], [0, 0.08, 0]))
    scene.add(new THREE.HemisphereLight(0x8fa8c8, 0x14100c, 0.3))
    spot(scene, 0xffd8b0, 90, [-3, 4.5, 3], [0, 0.3, 0], 0.5, 0.9)
    spot(scene, 0x9dbadc, 50, [4, 5, -3], [0, 0, 0], 0.6, 1)
    addDust(scene, [-4, 4, 0, 4, -4, 4], 1000)
    camera.position.set(o.cx ?? -2.2, o.cy ?? 1.2, o.cz ?? 2.6)
    camera.lookAt(o.lx ?? 0.4, o.ly ?? 0.3, o.lz ?? -0.2)
    return { dof: { focus: 3.2, aperture: 0.0018, maxblur: 0.006 }, bloom: [0.35, 0.5, 0.9] }
  },
}

/* ───────────── entry ───────────── */
window.renderScene = (spec) => {
  seed = spec.seed * 7919 + 1
  const ctx = setup({ w: spec.w, h: spec.h, fov: spec.fov ?? 40, fog: spec.fog ?? 0.05, exposure: spec.exposure ?? 1, envIntensity: spec.env ?? 0.5 })
  ctx.w = spec.w; ctx.h = spec.h
  const post = scenes[spec.scene](ctx, spec.o || {}) || {}
  finish(ctx, post)
  return ctx.renderer.domElement.toDataURL('image/png')
}
window.ready = true
