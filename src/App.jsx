import { useEffect, useState } from 'react'
import Home from './Home.jsx'
import CaseStudy from './CaseStudy.jsx'
import AboutPage from './AboutPage.jsx'
import ClickSpark from './components/ClickSpark.jsx'
import InkCursor from './components/InkCursor.jsx'

// Hash routes: '#/work/<slug>' opens a case study, '#/about' the about page, anything else is home.
const readRoute = () => {
  if (location.hash === '#/about') return 'about'
  const m = location.hash.match(/^#\/work\/([\w-]+)/)
  return m ? m[1] : null
}

function Loader({ onDone }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return onDone()
    const t0 = performance.now()
    let raf
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 1300)
      setN(Math.round((1 - Math.pow(1 - k, 3)) * 100))
      if (k < 1) raf = requestAnimationFrame(step)
      else setTimeout(onDone, 250)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [onDone])
  return (
    <div className={`loader ${n === 100 ? 'loader--out' : ''}`} aria-hidden="true">
      <span className="loader__name">Vatsal Tank</span>
      <span className="loader__n">{n}</span>
    </div>
  )
}

export default function App() {
  const [slug, setSlug] = useState(readRoute)
  const [returnTo, setReturnTo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const on = () => setSlug(readRoute())
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])

  const open = (s) => {
    location.hash = `/work/${s}`
  }
  const back = (to = 'work') => {
    setReturnTo(to)
    history.pushState('', '', location.pathname)
    setSlug(null)
  }

  return (
    <ClickSpark sparkColor="#c6ff3d" sparkSize={11} sparkRadius={22} sparkCount={9} duration={450}>
      <InkCursor />
      {loading && <Loader onDone={() => setLoading(false)} />}
      {slug === 'about' ? (
        <AboutPage onBack={() => back('about')} />
      ) : slug ? (
        <CaseStudy key={slug} slug={slug} onBack={() => back('work')} onOpen={open} />
      ) : (
        <Home onOpen={open} returnTo={returnTo} />
      )}
    </ClickSpark>
  )
}
