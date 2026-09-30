import { useEffect, useRef } from 'react'
import './InkCursor.css'

/* Ink cursor (after the gooey "ink" trail on speckyboy's cursor list): a chain of dots that
   follow the pointer and melt together through an SVG goo filter. Pointer devices only. */
const COUNT = 18

export default function InkCursor() {
  const wrap = useRef()

  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const dots = [...wrap.current.children]
    const pts = dots.map(() => ({ x: innerWidth / 2, y: innerHeight / 2 }))
    let mx = pts[0].x, my = pts[0].y, raf, idle = 0, shown = false

    const move = (e) => {
      mx = e.clientX
      my = e.clientY
      idle = 0
      if (!shown) {
        shown = true
        pts.forEach((p) => { p.x = mx; p.y = my })
        wrap.current.classList.add('is-on')
      }
      wrap.current.classList.toggle('is-hot', !!e.target.closest?.('a, button, [role="button"], [data-hover]'))
    }
    const leave = () => { shown = false; wrap.current?.classList.remove('is-on') }

    const loop = () => {
      let x = mx, y = my
      idle++
      pts.forEach((p, i) => {
        const next = pts[i + 1] || pts[0]
        p.x = x
        p.y = y
        dots[i].style.transform = `translate3d(${p.x}px,${p.y}px,0) scale(${(COUNT - i) / COUNT})`
        // the tail collapses into the head once the pointer rests
        const k = idle > 20 ? 0.5 : 0.35
        x += (next.x - x) * k
        y += (next.y - y) * k
      })
      raf = requestAnimationFrame(loop)
    }

    addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <>
      <svg className="ink-filter" aria-hidden="true">
        <defs>
          <filter id="ink-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12" />
          </filter>
        </defs>
      </svg>
      <div ref={wrap} className="ink-cursor" aria-hidden="true">
        {Array.from({ length: COUNT }, (_, i) => <span key={i} />)}
      </div>
    </>
  )
}
