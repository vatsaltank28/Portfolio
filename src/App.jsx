import { useEffect, useState } from 'react'
import Home from './Home.jsx'
import CaseStudy from './CaseStudy.jsx'
import AboutPage from './AboutPage.jsx'
import HelloLoader from './components/HelloLoader.jsx'
import ClickSpark from './components/ClickSpark.jsx'
import InkCursor from './components/InkCursor.jsx'

// Hash routes: '#/work/<slug>' opens a case study, '#/about' the about page, anything else is home.
const readRoute = () => {
  if (location.hash === '#/about') return 'about'
  const m = location.hash.match(/^#\/work\/([\w-]+)/)
  return m ? m[1] : null
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [slug, setSlug] = useState(readRoute)
  const [returnTo, setReturnTo] = useState(null)
  const [loading, setLoading] = useState(!reduceMotion)

  // 'ready' releases the hero entrance animation, which waits behind the loader
  useEffect(() => {
    if (!loading) document.body.classList.add('ready')
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
      {loading && <HelloLoader onDone={() => setLoading(false)} />}
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
