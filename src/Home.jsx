import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import FlexCarousel from './components/FlexCarousel.jsx'
import TechText from './components/TechText.jsx'
import { AutoVideo, Reel, VideoModal } from './components/Reel.jsx'
import { Hero3D, makeCovers } from './parts.jsx'
import GooeyNav from './components/GooeyNav.jsx'
import { StaggeredMenu } from './components/StaggeredMenu.jsx'
import LogoLoop from './components/LogoLoop.jsx'
import FlowingMenu from './components/FlowingMenu.jsx'
import OptionWheel from './components/OptionWheel.jsx'
import HalftoneReveal from './components/HalftoneReveal.jsx'
import ImageTrail from './components/ImageTrail.jsx'
import GhostCursor from './components/GhostCursor.jsx'
import GlareHover from './components/GlareHover.jsx'
import { achievements, archive, journey, links, liveWork, projects, proof, repos, skillLogos, skills, stack } from './data.js'

const NAV = [
  ['home', 'Home'],
  ['work', 'Work'],
  ['about', 'About'],
  ['skills', 'Skills'],
  ['journey', 'Journey'],
  ['contact', 'Contact'],
]

/* Vertical scroll drives a pinned horizontal track (desktop / landscape).
   Below the breakpoint the same panels simply stack vertically. */
function useHorizontal(wrapRef, trackRef, barRef, onActive) {
  const s = useRef({ cur: 0, target: 0, max: 0, enabled: false })

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    const st = s.current
    const mq = matchMedia('(min-width: 900px) and (min-aspect-ratio: 1/1)')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let pars = []
    let panels = []
    let lastActive = ''

    const measure = () => {
      st.enabled = mq.matches
      panels = [...track.children].map((el) => ({ id: el.id, nav: el.dataset.nav || el.id, left: el.offsetLeft, w: el.offsetWidth }))
      if (!st.enabled) {
        wrap.style.height = ''
        track.style.transform = ''
        pars.forEach((p) => (p.el.style.transform = ''))
        pars = []
        return
      }
      st.max = Math.max(0, track.scrollWidth - innerWidth)
      wrap.style.height = `${st.max + innerHeight}px`
      pars = [...track.querySelectorAll('[data-speed]')].map((el) => ({
        el,
        speed: +el.dataset.speed,
        left: el.closest('.panel').offsetLeft,
      }))
    }

    const tick = () => {
      if (st.enabled) {
        st.target = Math.min(st.max, Math.max(0, scrollY - wrap.offsetTop))
        st.cur = reduce ? st.target : st.cur + (st.target - st.cur) * 0.1
        if (Math.abs(st.target - st.cur) < 0.05) st.cur = st.target
        track.style.transform = `translate3d(${-st.cur}px,0,0)`
        for (const p of pars) p.el.style.transform = `translate3d(${(st.cur - p.left) * p.speed}px,0,0)`
        barRef.current.style.transform = `scaleX(${st.max ? st.cur / st.max : 0})`
        const pos = st.cur + innerWidth * 0.5
        const a = panels.find((p) => pos >= p.left && pos < p.left + p.w)
        if (a && a.nav !== lastActive) onActive((lastActive = a.nav))
      } else {
        const m = document.documentElement.scrollHeight - innerHeight
        barRef.current.style.transform = `scaleX(${m ? scrollY / m : 0})`
      }
      raf = requestAnimationFrame(tick)
    }

    // trackpad sideways swipes + arrow keys also move the page
    const onWheel = (e) => {
      if (!st.enabled || e.target.closest('.flex-carousel')) return
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) scrollBy(0, e.deltaX)
    }
    const onKey = (e) => {
      if (!st.enabled || e.target.closest('input, textarea')) return
      if (e.key === 'ArrowRight') scrollBy(0, innerWidth * 0.6)
      if (e.key === 'ArrowLeft') scrollBy(0, -innerWidth * 0.6)
    }

    measure()
    let raf = requestAnimationFrame(tick)
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    addEventListener('resize', measure)
    addEventListener('wheel', onWheel, { passive: true })
    addEventListener('keydown', onKey)
    mq.addEventListener('change', measure)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      removeEventListener('resize', measure)
      removeEventListener('wheel', onWheel)
      removeEventListener('keydown', onKey)
      mq.removeEventListener('change', measure)
    }
  }, [wrapRef, trackRef, barRef, onActive])

  return (id) => {
    const el = document.getElementById(id)
    if (!el) return
    if (s.current.enabled) scrollTo({ top: wrapRef.current.offsetTop + el.offsetLeft, behavior: 'instant' })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
}

function useViewport() {
  const [w, setW] = useState(innerWidth)
  useEffect(() => {
    const on = () => setW(innerWidth)
    addEventListener('resize', on)
    return () => removeEventListener('resize', on)
  }, [])
  return w
}

function Tech({ text, size }) {
  return (
    <div className="techtext" style={{ height: size * 1.15 }}>
      <TechText
        text={text}
        fontFamily="Inter Tight"
        fontWeight={700}
        fontSize={size}
        color="#f2f2f0"
        accentColor="#c6ff3d"
        labels
        specks={12}
      />
    </div>
  )
}

// explicit width/height: LogoLoop measures the row before images load, and a 0-wide row makes it clone endlessly
const logos = skillLogos.map(([slug, label]) => ({ src: `https://cdn.simpleicons.org/${slug}/f2f2f0`, alt: label, title: label, width: 40, height: 40 }))
const logoRows = [logos.slice(0, 10), logos.slice(10)]

// One row per project or live site for the flowing index. Case studies open in place; the rest go to the live site.
const indexItems = [
  ...projects.map((p) => ({ text: p.title, link: `#/work/${p.slug}`, image: p.gallery?.[0] || p.shot })),
  ...liveWork.filter((w) => !w.slug).map((w) => ({ text: w.t, link: w.url, image: w.shot })),
]
const trailImages = [...new Set(projects.flatMap((p) => p.gallery || []).concat(liveWork.flatMap((w) => w.gallery || [])))]
const fine = typeof matchMedia !== 'undefined' && matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches

// Only this small component re-renders when the section changes; Home pushes the id in through `bind`.
function NavGooey({ bind, onGo }) {
  const [active, setActiveId] = useState('home')
  useEffect(() => bind(setActiveId), [bind])
  return (
    <GooeyNav
      items={NAV.map(([id, label]) => ({ label, href: `#${id}` }))}
      activeIndex={NAV.findIndex(([id]) => id === active)}
      onSelect={(k, e) => onGo(NAV[k][0])(e)}
      particleCount={12}
      particleDistances={[70, 8]}
      particleR={80}
      animationTime={550}
    />
  )
}

const Ext = ({ href, children, className = '' }) => (
  <a href={href} target="_blank" rel="noreferrer" className={className}>{children}</a>
)

export default function Home({ onOpen, returnTo }) {
  const wrapRef = useRef()
  const trackRef = useRef()
  const barRef = useRef()
  const navRef = useRef()
  // Highlight the current section by toggling a class directly: a React state update here would
  // re-render the whole page (carousel, reels, 3D) every time a panel boundary is crossed.
  const gooeySet = useRef(null)
  const bindGooey = useCallback((fn) => { gooeySet.current = fn }, [])
  const setActive = useCallback((id) => {
    navRef.current?.querySelectorAll('a').forEach((a) => a.classList.toggle('is-active', a.dataset.id === id))
    gooeySet.current?.(id)
  }, [])
  const [covers, setCovers] = useState(null)
  const [cur, setCur] = useState(0)
  const [filter, setFilter] = useState('All')
  const [reel, setReel] = useState(null)
  const [repo, setRepo] = useState(0)
  const [menuKey, setMenuKey] = useState(0)
  const closeReel = useCallback(() => setReel(null), [])
  const curRef = useRef(0)
  const vw = useViewport()
  const goTo = useHorizontal(wrapRef, trackRef, barRef, setActive)

  useEffect(() => {
    makeCovers(projects).then(setCovers)
  }, [])

  useEffect(() => {
    if (returnTo) requestAnimationFrame(() => goTo(returnTo))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // reveal-on-enter; IntersectionObserver works for horizontally transformed panels too
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.2 }
    )
    document.querySelectorAll('.rv').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [covers])

  const cats = useMemo(() => ['All', ...new Set(archive.map((a) => a.c))], [])
  const shown = filter === 'All' ? archive : archive.filter((a) => a.c === filter)
  const p = projects[cur]
  const techSize = Math.round(Math.min(vw * 0.11, 170))
  const nav = (id) => (e) => {
    e.preventDefault()
    goTo(id)
  }

  return (
    <>
      <a className="skip" href="#work" onClick={nav('work')}>Skip to work</a>

      {vw >= 900 ? (
        <header className="nav">
          <a href="#home" className="logo" onClick={nav('home')} aria-label="Vatsal Tank, home">
            VT<span>.</span>
          </a>
          <div className="nav__gooey">
            <NavGooey bind={bindGooey} onGo={nav} />
          </div>
          <div className="nav__ext">
            <Ext href={links.github}>GitHub</Ext>
            <Ext href={links.linkedin}>LinkedIn</Ext>
            <Ext href={links.resume} className="pill">Résumé</Ext>
          </div>
        </header>
      ) : (
        <div className="sm-wrap" onClickCapture={(e) => e.target.closest('.sm-panel-item') && setTimeout(() => setMenuKey((k) => k + 1), 350)}>
          <StaggeredMenu
            key={menuKey}
            isFixed
            position="right"
            colors={['#1a1a18', '#c6ff3d']}
            accentColor="#c6ff3d"
            menuButtonColor="#f2f2f0"
            openMenuButtonColor="#0a0a0a"
            logoUrl="/favicon.svg"
            items={[...NAV.map(([id, label]) => ({ label, link: `#${id}`, ariaLabel: `Go to ${label}` })), { label: 'My story', link: '#/about', ariaLabel: 'Open the about page' }]}
            socialItems={[{ label: 'GitHub', link: links.github }, { label: 'LinkedIn', link: links.linkedin }, { label: 'Résumé', link: links.resume }, { label: 'Instagram', link: links.instagram }]}
          />
        </div>
      )}

      <div className="progress"><div ref={barRef} /></div>

      <main ref={wrapRef} className="hwrap">
        <div className="sticky">
          <div ref={trackRef} className="track">
            {/* HERO */}
            <section id="home" className="panel hero" aria-label="Introduction">
              <AutoVideo className="hero__video" src="/hero.mp4" autoPlay />
              <div className="hero__shade" />
              <Hero3D />
              {fine && <GhostCursor color="#c6ff3d" brightness={1.1} trailLength={40} bloomStrength={0.12} maxDevicePixelRatio={0.5} zIndex={1} />}
              <div className="hero__content">
                <p className="eyebrow">Full-stack developer and UI engineer</p>
                <h1 className="hero__name">
                  <span className="mask"><span>Vatsal</span></span>
                  <span className="mask"><span>Tank<em>.</em></span></span>
                </h1>
                <p className="hero__sub">
                  I build real products at the point where <i>code</i>, <i>design</i> and <i>interaction</i> meet.
                </p>
                <div className="hero__cta">
                  <a href="#work" className="btn" onClick={nav('work')}>View work</a>
                  <Ext href={links.resume} className="btn btn--ghost">Résumé</Ext>
                </div>
              </div>
            </section>

            {/* WHAT I DO: bento */}
            <section id="proof" className="panel proof" data-nav="home" aria-label="What I do">
              <div className="proof__head rv">
                <Tech text="I BUILD." size={techSize} />
                <p className="proof__lede">
                  Computer Engineering student in Mumbai. Four sites live on the web, one of them for a paying client.
                </p>
              </div>
              <div className="bento">
                {proof.map((x, i) => (
                  <article key={x.k} className={`bento__cell bento__cell--${i + 1} rv`} style={{ transitionDelay: `${i * 90}ms` }}>
                    {x.video ? <AutoVideo src={x.video} poster={x.shot} /> : x.shot && <img src={x.shot} alt="" loading="lazy" decoding="async" />}
                    <div className="bento__text">
                      <h3>{x.k}</h3>
                      <p>{x.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* FEATURED WORK */}
            <section id="work" className="panel work" aria-label="Featured work">
              <div className="work__info">
                <p className="eyebrow">Featured work</p>
                <div key={p.slug} className="work__detail">
                  <span className="status">{p.status}</span>
                  <h2>{p.title}</h2>
                  <p className="it work__kicker">{p.kicker}</p>
                  <p className="work__sum">{p.summary}</p>
                  <ul className="chips">
                    {p.tech.slice(0, 5).map((t) => <li key={t}>{t}</li>)}
                  </ul>
                  <div className="work__actions">
                    <button className="btn" onClick={() => onOpen(p.slug)}>Case study</button>
                    {p.live && <Ext href={p.live} className="btn btn--ghost">Live site</Ext>}
                  </div>
                </div>
                <div className="work__list" role="tablist" aria-label="Featured projects">
                  {projects.map((x, i) => (
                    <button key={x.slug} className={i === cur ? 'on' : ''} onClick={() => onOpen(x.slug)}>
                      {x.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="work__carousel">
                {covers ? (
                  <FlexCarousel
                    items={covers}
                    preset="liquid"
                    intro="rise"
                    cardHeight={0.62}
                    gap={18}
                    radius={16}
                    captions={false}
                    captureWheel={false}
                    onChange={(i) => {
                      curRef.current = i
                      setCur(i)
                    }}
                    onSelect={(i) => i === curRef.current && onOpen(projects[i].slug)}
                  />
                ) : (
                  <div className="skeleton" aria-hidden="true" />
                )}
                <p className="work__tip">Drag the cards. Click the focused one to open it.</p>
              </div>
            </section>

            {/* SHOWREELS: video playing inside the project name */}
            {projects.filter((x) => x.loop).map((x, i) => (
              <Reel
                key={x.slug}
                id={`reel-${x.slug}`}
                nav="work"
                index={`Reel 0${i + 1}`}
                title={x.title}
                kicker={x.kicker}
                loop={x.loop}
                poster={x.poster || x.shot}
                color={x.color}
                tint={x.tint}
                onPlay={() => setReel(x)}
              />
            ))}

            {/* LIVE ON THE WEB: screenshot gallery */}
            <section id="live" className="panel live" data-nav="work" aria-label="Live on the web">
              <h2 className="live__title rv">Live on<br />the web</h2>
              <div className="live__row">
                {liveWork.map((w, i) => (
                  <article key={w.t} className={`shot shot--${i % 2 ? 'low' : 'high'} rv`} style={{ transitionDelay: `${i * 80}ms` }}>
                    <GlareHover width="100%" height="auto" background="transparent" borderColor="transparent" borderRadius="14px" glareColor="#ffffff" glareOpacity={0.22} glareSize={220} className="shot__glare">
                    <Ext href={w.url} className="shot__frame">
                      <span className="shot__bar"><i /><i /><i /><b>{w.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</b></span>
                      {w.loop ? <AutoVideo src={w.loop} poster={w.shot} /> : <img src={w.shot} alt={`${w.t} homepage`} loading="lazy" decoding="async" />}
                    </Ext>
                    </GlareHover>
                    <div className="shot__meta">
                      <div>
                        <h3>{w.t}</h3>
                        <p>{w.d}</p>
                      </div>
                      {w.slug ? (
                        <button className="link" onClick={() => onOpen(w.slug)}>Case study</button>
                      ) : (
                        <Ext href={w.url} className="link">Visit</Ext>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* PROJECT INDEX: flowing menu */}
            <section id="index" className="panel pindex" data-nav="work" aria-label="Project index">
              <div className="pindex__head rv">
                <p className="eyebrow">Index</p>
                <h2>Every<br /><span className="it">project</span></h2>
                <p className="muted">Hover a row to see it. Click to open the case study or the live site.</p>
              </div>
              <div className="pindex__menu">
                <FlowingMenu items={indexItems} speed={18} textColor="#f2f2f0" bgColor="#0a0a0a" marqueeBgColor="#c6ff3d" marqueeTextColor="#0a0a0a" borderColor="rgba(255,255,255,.12)" />
              </div>
            </section>

            {/* ARCHIVE */}
            <section id="archive" className="panel archive" data-nav="work" aria-label="Project archive">
              <div className="archive__head rv">
                <h2>Everything<br /><span className="it">else</span></h2>
                <div className="filters" role="group" aria-label="Filter projects">
                  {cats.map((c) => (
                    <button key={c} className={filter === c ? 'on' : ''} onClick={() => setFilter(c)} aria-pressed={filter === c}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <ol className="archive__list">
                {shown.map((a, i) => {
                  const row = (
                    <>
                      <b>{a.t}</b>
                      <span className="archive__cat">{a.c}</span>
                      <span className="tag">{a.s}</span>
                    </>
                  )
                  return (
                    <li key={a.t} style={{ animationDelay: `${i * 35}ms` }}>
                      {a.url ? <Ext href={a.url} className="archive__row">{row}<span className="arrow">↗</span></Ext> : <div className="archive__row">{row}<span /></div>}
                    </li>
                  )
                })}
              </ol>
            </section>

            {/* STATEMENT + single marquee */}
            <section id="statement" className="panel statement" data-nav="about" aria-label="Approach">
              <div className="bigword" data-speed="0.25" aria-hidden="true">SHIP</div>
              <p className="statement__text rv">
                Engineering is how it <em>works</em>. Design is how it <em>feels</em>. I care about both, and I finish what I start.
              </p>
              <div className="logos" aria-label="Tools I use">
                <LogoLoop logos={logoRows[0]} speed={70} direction="left" logoHeight={40} gap={64} pauseOnHover scaleOnHover fadeOut fadeOutColor="#0a0a0a" ariaLabel="Tools I use" />
                <LogoLoop logos={logoRows[1]} speed={55} direction="right" logoHeight={40} gap={64} pauseOnHover scaleOnHover fadeOut fadeOutColor="#0a0a0a" ariaLabel="More tools I use" />
              </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="panel about" aria-label="About">
              <a href="#/about" className="about__photo rv" data-hover aria-label="Read the full about page">
                {fine ? (
                  <HalftoneReveal src="/media/about-me.webp" inkColor="#0a0a0a" paperColor="#f4f4f2" dotDensity={90} revealRadius={0.32} idleReveal={0} trigger="hover" borderRadius="0px" />
                ) : (
                  <img src="/media/about-me.webp" alt="Portrait of Vatsal Tank" loading="lazy" width="1100" height="1563" />
                )}
                <span className="about__tag mono">Hi, I'm Vatsal</span>
              </a>
              <div className="about__body">
                <h2 className="about__lead rv">
                  I'm a Computer Engineering student who builds <span className="hl">web apps</span>,{' '}
                  <span className="hl">realtime systems</span> and <span className="it">interfaces that feel right.</span>
                </h2>
                <div className="about__cols">
                  <p className="rv">
                    I started with tribute pages and CSS experiments, moved into Python and data structures, then shipped a
                    live website for a real restaurant. Now I build full-stack platforms with auth, payments and realtime data.
                  </p>
                  <p className="rv">
                    I care about the parts people feel: how a page loads, how a button answers, how a layout breathes. The
                    engineering has to hold up, and the interface has to earn attention.
                  </p>
                </div>
                <dl className="about__facts rv">
                  <div><dt>Studying</dt><dd>Computer Engineering, SVKM's Shri Bhagubhai Mafatlal Polytechnic, 2025 to present</dd></div>
                  <div><dt>Involved in</dt><dd>Sankhya maths committee, co-committee member</dd></div>
                  <div><dt>Based in</dt><dd>Mumbai, India</dd></div>
                </dl>
                <a href="#/about" className="btn about__more rv">Read my story</a>
              </div>
            </section>

            {/* JOURNEY: 3D milestone cards */}
            <section id="journey" className="panel journey" aria-label="Journey">
              <div className="journey__head rv">
                <h2>How I got<br /><span className="it">here</span></h2>
                <p className="muted">From tribute pages to realtime platforms. Hover a card to bring it forward.</p>
                <div className="orbit" aria-hidden="true">
                  <div className="orbit__ring">
                    {stack.slice(0, 10).map((t, k) => (
                      <span key={t} style={{ '--i': k }}>{t}</span>
                    ))}
                  </div>
                  <span className="orbit__core" />
                </div>
              </div>
              <ol className="timeline">
                {journey.map((m, i) => (
                  <li key={m.t} className={`tcard ${m.img ? 'tcard--img' : ''} ${i % 2 ? 'tcard--low' : ''} rv`} style={{ transitionDelay: `${i * 70}ms` }} data-speed={i % 2 ? 0.05 : -0.04}>
                    <div className="tcard__inner">
                      <span className="tcard__n">{String(i + 1).padStart(2, '0')}</span>
                      {m.img && <img src={m.img} alt="" loading="lazy" decoding="async" />}
                      <span className="tcard__tag mono">{m.tag}</span>
                      <h3>{m.t}</h3>
                      <p>{m.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* SKILLS */}
            <section id="skills" className="panel skills" aria-label="Skills">
              <div className="skills__head rv">
                <h2>Skills,<br /><span className="it">with receipts</span></h2>
                <p className="muted">Each group names the work where it was actually used.</p>
              </div>
              <div className="skills__grid">
                {skills.map((g, i) => (
                  <article key={g.g} className="skill rv" style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
                    <h3>{g.g}</h3>
                    <ul>{g.items.map((t) => <li key={t}>{t}</li>)}</ul>
                    {g.used && <p className="skill__used">Used in {g.used}</p>}
                  </article>
                ))}
              </div>
            </section>

            {/* LAB */}
            <section id="lab" className="panel lab" data-nav="skills" aria-label="Lab and creative work">
              <div className="lab__copy rv">
                <p className="eyebrow">Lab</p>
                <h2>Experiments<br /><span className="it">and side work</span></h2>
                <p className="muted">
                  Move your cursor across the panel: it leaves a trail of screens from the projects on this site.
                </p>
                <ul className="lab__list">
                  <li><Ext href={links.instagram}>Echoverse Lyrics <span>Instagram lyrics page ↗</span></Ext></li>
                  <li><div>AR Product Viewer <span>AR experiment, redeploying soon</span></div></li>
                  <li><div>Hospital Website UI <span>Interface design study</span></div></li>
                  <li><div>Golden ratio and Gestalt <span>Layout studies</span></div></li>
                </ul>
              </div>
              <div className="lab__scene">
                <div className="lab__grid" />
                <span className="lab__w lab__w1">CODE</span>
                <span className="lab__w lab__w2">design</span>
                <span className="lab__w lab__w3">INTERACTION</span>
                <div className="lab__trail">{fine ? <ImageTrail items={trailImages} variant={1} /> : null}</div>
              </div>
            </section>

            {/* NUMBERS + REPOS */}
            <section id="github" className="panel github" data-nav="journey" aria-label="GitHub and achievements">
              <h2 className="rv">Proof in<br /><span className="it">numbers</span></h2>
              <div className="stats">
                {achievements.map(([n, l], i) => (
                  <div key={l} className="stat rv" style={{ transitionDelay: `${i * 80}ms` }}>
                    <strong>{n}</strong>
                    <p>{l}</p>
                  </div>
                ))}
              </div>
              <div className="repos rv">
                <h3>On GitHub</h3>
                <div className="repos__wheel">
                  <OptionWheel items={repos.map((r) => r.n)} defaultSelected={0} onChange={(k) => setRepo(k)} fontSize={1.35} spacing={1.7} inset={0} tilt={8} blur={1.5} activeColor="#c6ff3d" textColor="#8d8d8a" />
                </div>
                <p className="repos__desc">{repos[repo].d}</p>
                <Ext href={repos[repo].u} className="btn btn--ghost repos__open">Open {repo === repos.length - 1 ? 'GitHub' : 'repository'} ↗</Ext>
              </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="panel contact" aria-label="Contact">
              <Tech text="LET'S TALK" size={Math.round(techSize * 0.9)} />
              <a className="contact__mail" href={`mailto:${links.email}`}>{links.email}</a>
              <div className="contact__row">
                <a className="btn" href={`mailto:${links.email}`}>Email me</a>
                <Ext href={links.linkedin} className="btn btn--ghost">LinkedIn</Ext>
                <Ext href={links.github} className="btn btn--ghost">GitHub</Ext>
                <Ext href={links.resume} className="btn btn--ghost">Résumé</Ext>
              </div>
              <footer className="foot">
                <span><b>Vatsal Tank</b>, full-stack developer and UI engineer</span>
                <span>Updated September 2026</span>
              </footer>
            </section>
          </div>
        </div>
      </main>
      <VideoModal src={reel?.video} poster={reel?.poster || reel?.shot} title={reel?.title} onClose={closeReel} />
    </>
  )
}
