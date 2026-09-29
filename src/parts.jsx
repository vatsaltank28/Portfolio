import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import LiquidGlass from 'liquid-glass-js'

/* ---------- Project cover art, drawn once on a canvas (no stock photos) ---------- */
const loadImg = (src) =>
  new Promise((res) => {
    const im = new Image()
    im.onload = () => res(im)
    im.onerror = () => res(null)
    im.src = src
  })

export async function makeCovers(projects) {
  await document.fonts.ready
  const shots = await Promise.all(projects.map((p) => (p.shot ? loadImg(p.shot) : null)))
  return projects.map((p, i) => {
    const c = document.createElement('canvas')
    c.width = 1200
    c.height = 1500
    const x = c.getContext('2d')
    x.fillStyle = '#0c0c0c'
    x.fillRect(0, 0, 1200, 1500)

    const shot = shots[i]
    if (shot) {
      // real screenshot fills the top of the card, fading into the title area
      const h = 1500 * 0.72
      const s = Math.max(1200 / shot.width, h / shot.height)
      x.drawImage(shot, (1200 - shot.width * s) / 2, 0, shot.width * s, shot.height * s)
      const f = x.createLinearGradient(0, h * 0.45, 0, h + 60)
      f.addColorStop(0, 'rgba(12,12,12,0)')
      f.addColorStop(1, 'rgba(12,12,12,1)')
      x.fillStyle = f
      x.fillRect(0, 0, 1200, 1500)
    } else {
      const g = x.createRadialGradient(860, 420, 40, 860, 420, 980)
      g.addColorStop(0, p.color)
      g.addColorStop(0.45, p.color + '55')
      g.addColorStop(1, 'rgba(12,12,12,0)')
      x.fillStyle = g
      x.fillRect(0, 0, 1200, 1500)
    }

    x.fillStyle = 'rgba(255,255,255,0.9)'
    x.font = '500 38px "JetBrains Mono", monospace'
    x.textAlign = 'right'
    x.fillText(p.status.toUpperCase(), 1120, 1450)
    x.textAlign = 'left'

    x.fillStyle = '#fff'
    x.font = '600 200px "Inter Tight", sans-serif'
    if ('letterSpacing' in x) x.letterSpacing = '-10px'
    let size = 200
    while (x.measureText(p.title).width > 1040 && size > 80) {
      size -= 10
      x.font = `600 ${size}px "Inter Tight", sans-serif`
    }
    x.fillText(p.title, 70, 1260)
    if ('letterSpacing' in x) x.letterSpacing = '0px'
    x.font = 'italic 400 56px "Inter Tight", sans-serif'
    x.fillStyle = 'rgba(255,255,255,0.75)'
    x.fillText(p.kicker, 80, 1360)
    return { src: c.toDataURL('image/jpeg', 0.9), alt: `${p.title}, ${p.kicker}`, title: p.title }
  })
}

/* ---------- Hero 3D: distorted chrome blobs that follow the pointer ---------- */
function Blob({ position, color, scale = 1, speed = 1 }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    ref.current.rotation.x = t * 0.3
    ref.current.rotation.y = t * 0.4
    ref.current.position.x += (position[0] + state.pointer.x * 0.5 - ref.current.position.x) * 0.05
    ref.current.position.y += (position[1] + state.pointer.y * 0.35 - ref.current.position.y) * 0.05
  })
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.6}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 48]} />
        <MeshDistortMaterial color={color} distort={0.38} speed={1.8} roughness={0.08} metalness={0.9} />
      </mesh>
    </Float>
  )
}

export function Hero3D() {
  const wrap = useRef()
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={wrap} className="hero__canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.75]} frameloop={visible ? 'always' : 'never'}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} />
        <Blob position={[2.9, 1.1, -0.5]} color="#c6ff3d" scale={0.75} />
        <Blob position={[3.6, -1.4, -1.5]} color="#ff5c39" scale={0.55} speed={0.8} />
        <Blob position={[4.4, 0.1, -2.5]} color="#e8e8e8" scale={0.4} speed={1.3} />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

/* ---------- Liquid-glass lens that drifts after the pointer inside a DOM scene ---------- */
export function LiquidLens({ sceneRef }) {
  useEffect(() => {
    const bg = sceneRef.current
    if (!bg) return
    let glass = null
    let raf = 0
    let mx = 0.5, my = 0.5, cx = 0.5, cy = 0.5
    const w = Math.min(360, window.innerWidth * 0.55)
    const h = Math.round(w * 0.6)

    const onMove = (e) => {
      const r = bg.getBoundingClientRect()
      mx = (e.clientX - r.left) / r.width
      my = (e.clientY - r.top) / r.height
    }
    const tick = () => {
      cx += (mx - cx) * 0.08
      cy += (my - cy) * 0.08
      const r = bg.getBoundingClientRect()
      glass._syncBg?.()
      glass.moveTo(r.left + cx * r.width - w / 2, r.top + cy * r.height - h / 2)
      raf = requestAnimationFrame(tick)
    }
    // Building the lens clones the scene and renders its refraction maps, which blocks for ~1s.
    // Do it once while the page is idle (behind the loader), then only show/hide it.
    const build = () => {
      if (glass) return
      glass = new LiquidGlass({
        background: bg, width: w, height: h, radius: h / 2,
        scale: 58, depth: 46, chroma: 0.2, edge: 0.85, glow: 0.22, draggable: false, zIndex: 40,
      })
      show(false)
    }
    const show = (on) => {
      for (const el of [glass?.glassEl, glass?.lensEl]) if (el) el.style.display = on ? '' : 'none'
    }
    const start = () => {
      build()
      show(true)
      cancelAnimationFrame(raf)
      tick()
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      show(false)
    }
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 200))
    const idleId = idle(build, { timeout: 1500 })
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio > 0.35 ? start() : stop()), {
      threshold: [0, 0.35, 0.6],
    })
    io.observe(bg)
    bg.addEventListener('pointermove', onMove)
    return () => {
      ;(window.cancelIdleCallback || clearTimeout)(idleId)
      io.disconnect()
      bg.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      glass?.destroy()
    }
  }, [sceneRef])
  return null
}

/* ---------- Custom cursor (pointer devices only) ---------- */
export function Cursor() {
  const dot = useRef()
  const ring = useRef()
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      const hot = e.target.closest?.('a, button, [data-hover]')
      ring.current.classList.toggle('is-hot', !!hot)
    }
    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', move)
    loop()
    document.body.classList.add('has-cursor')
    return () => {
      removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
      document.body.classList.remove('has-cursor')
    }
  }, [])
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
