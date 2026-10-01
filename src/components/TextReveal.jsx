import { useEffect, useRef } from 'react'

/* Port of the Framer "Text Reveal Scroll" helper: words (or characters) start dimmed and light up as the
   block travels through the viewport. `axis="x"` follows the sideways track on desktop. */
function split(el, mode, dim, out) {
  for (const node of [...el.childNodes]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment()
      const parts = mode === 'chars' ? [...node.textContent] : node.textContent.split(/(\s+)/)
      for (const part of parts) {
        if (!part) continue
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part))
          continue
        }
        const span = document.createElement('span')
        span.textContent = part
        span.style.opacity = dim
        out.push(span)
        frag.appendChild(span)
      }
      el.replaceChild(frag, node)
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
      split(node, mode, dim, out)
    }
  }
}

export default function TextReveal({ as: Tag = 'p', axis = 'y', mode = 'words', start = 90, end = 35, dim = 0.2, children, ...rest }) {
  const ref = useRef()
  const segs = useRef([])

  // The text is static, so React never rewrites these nodes after the one-time split.
  useEffect(() => {
    if (!segs.current.length) split(ref.current, mode, dim, segs.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = ref.current
    const list = segs.current
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      list.forEach((s) => (s.style.opacity = 1))
      return
    }
    let raf = 0
    let last = -1
    const tick = () => {
      const r = el.getBoundingClientRect()
      const x = axis === 'x'
      const view = x ? innerWidth : innerHeight
      const startPx = (view * start) / 100
      const range = (x ? r.width : r.height) + startPx - (view * end) / 100
      const p = Math.min(1, Math.max(0, (startPx - (x ? r.left : r.top)) / range)) * list.length
      if (p !== last) {
        last = p
        const lit = Math.floor(p)
        list.forEach((s, i) => (s.style.opacity = i < lit ? 1 : i === lit ? dim + (p - lit) * (1 - dim) : dim))
      }
      raf = requestAnimationFrame(tick)
    }
    // the sideways track moves by transform, so poll while the block is near the viewport
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      if (e.isIntersecting) raf = requestAnimationFrame(tick)
    }, { rootMargin: '200px' })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [axis, start, end, dim])

  return <Tag ref={ref} {...rest}>{children}</Tag>
}
