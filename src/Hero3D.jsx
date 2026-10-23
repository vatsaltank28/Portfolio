import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, Lightformer } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'

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

export default function Hero3D() {
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
        {/* reflections come from a few in-scene light panels instead of a 1.5 MB HDR download */}
        <Environment resolution={64}>
          <Lightformer intensity={2} position={[0, 4, -6]} scale={[10, 3, 1]} />
          <Lightformer intensity={1.2} position={[-6, 0, -2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
          <Lightformer intensity={1.2} position={[6, -1, 0]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
          <Lightformer intensity={0.6} position={[0, -5, 2]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

