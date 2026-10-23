import { lazy, Suspense, useEffect, useState } from 'react'
import Home from './Home.jsx'
import ClickSpark from './components/ClickSpark.jsx'
import InkCursor from './components/InkCursor.jsx'

// Hash routes: '#/work/<slug>' opens a case study, '#/about' the about page, anything else is home.
// Secondary routes load on demand
const HelloLoader = lazy(() => import('./components/HelloLoader.jsx'))
const CaseStudy = lazy(() => import('./CaseStudy.jsx'))
const AboutPage = lazy(() => import('./AboutPage.jsx'))

const readRoute = () => {
  if (location.hash === '#/about') return 'about'
  const m = location.hash.match(/^#\/work\/([\w-]+)/)
  return m ? m[1] : null
}

// The greeting loader is a desktop flourish; phones go straight to content.
const skipLoader = matchMedia('(prefers-reduced-motion: reduce), (max-width: 899px), (pointer: coarse)').matches

export default function App() {
  const [slug, setSlug] = useState(readRoute)
  const [returnTo, setReturnTo] = useState(null)
  const [loading, setLoading] = useState(!skipLoader)

  // 'ready' releases the hero entrance animation, which waits behind the loader
  useEffect(() => {
    if (loading) return
    // without the loader to cover it, hold the hero text until the web fonts land (max 1.5s) so the swap can't shift it
    let done = false
    const go = () => {
      if (done) return
      done = true
      document.body.classList.add('ready')
      document.querySelector('.pre .hero')?.remove() // the static stand-in text from index.html
    }
    document.fonts.ready.then(go)
    const t = setTimeout(go, 1500)
    return () => clearTimeout(t)
  }, [loading])

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
      {loading && <Suspense fallback={<div className="hello" aria-hidden="true" />}><HelloLoader onDone={() => setLoading(false)} /></Suspense>}
      <Suspense fallback={null}>
      {slug === 'about' ? (
        <AboutPage onBack={() => back('about')} />
      ) : slug ? (
        <CaseStudy key={slug} slug={slug} onBack={() => back('work')} onOpen={open} />
      ) : (
        <Home onOpen={open} returnTo={returnTo} />
      )}
      </Suspense>
    </ClickSpark>
  )
}
