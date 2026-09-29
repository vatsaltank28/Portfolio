import { useEffect, useRef } from 'react'
import './Reel.css'

/* Plays a muted <video> only while it is on screen, so off-screen videos never cost decode time. */
export function AutoVideo({ className = '', ...props }) {
  const ref = useRef()
  useEffect(() => {
    const v = ref.current
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 })
    io.observe(v)
    // a load aborted by fast scrolling leaves the element dead; retry once
    let retried = false
    const onError = () => {
      if (retried) return
      retried = true
      v.load()
    }
    v.addEventListener('error', onError)
    return () => {
      io.disconnect()
      v.removeEventListener('error', onError)
    }
  }, [])
  return <video ref={ref} className={className} muted loop playsInline preload="metadata" aria-hidden="true" {...props} />
}

/* Firma-style reel: the project name is cut out of a black plate and the video plays through the letters.
   Clicking opens the full video with sound. */
export function Reel({ id, nav, index, title, kicker, loop, poster, onPlay, color, tint }) {
  const size = `min(${(92 / title.length) * 1.72}vw, 46vh)`
  return (
    <section id={id} data-nav={nav} className="panel reel" aria-label={`${title} showreel`} style={{ '--c': color }}>
      <button className="reel__stage" onClick={onPlay} aria-label={`Play the ${title} video`} data-hover>
        <AutoVideo className="reel__video" src={loop} poster={poster} />
        {tint && <span className="reel__tint" aria-hidden="true" />}
        <div className="reel__plate" aria-hidden="true">
          <span className="reel__word" style={{ fontSize: size, '--len-size': `${(84 / title.length) * 1.6}vw` }}>{title}</span>
        </div>
        <span className="reel__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          Play reel
        </span>
      </button>
      <div className="reel__meta">
        <span className="mono">{index}</span>
        <p className="it">{kicker}</p>
        <span className="mono">Click to watch with sound</span>
      </div>
    </section>
  )
}

export function VideoModal({ src, poster, title, onClose }) {
  const ref = useRef()
  useEffect(() => {
    if (!src) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    ref.current?.focus()
    return () => {
      removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [src, onClose])
  if (!src) return null
  return (
    <div className="vmodal" role="dialog" aria-modal="true" aria-label={`${title} video`}>
      <button className="vmodal__bg" onClick={onClose} aria-label="Close video" />
      <div className="vmodal__box">
        <video ref={ref} src={src} poster={poster} controls autoPlay playsInline tabIndex={-1} />
        <button className="vmodal__x" onClick={onClose} aria-label="Close video">×</button>
      </div>
    </div>
  )
}
