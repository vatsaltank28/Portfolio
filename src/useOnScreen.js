import { useEffect, useState } from 'react'

// True while the element is on (or near) the screen, so animation loops can sleep when it isn't.
export default function useOnScreen(ref, rootMargin = '100px') {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return on
}
