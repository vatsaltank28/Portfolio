import { useEffect, useState } from 'react'
import ScrollExpand from './components/ScrollExpand.jsx'
import ScrollStack, { ScrollStackItem } from './components/ScrollStack.jsx'
import GlareHover from './components/GlareHover.jsx'
import { makeCovers } from './parts.jsx'
import { links, projects } from './data.js'

export default function CaseStudy({ slug, onBack, onOpen }) {
  const i = Math.max(0, projects.findIndex((p) => p.slug === slug))
  const p = projects[i]
  const next = projects[(i + 1) % projects.length]
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const [cover, setCover] = useState(null)

  useEffect(() => {
    scrollTo(0, 0)
    document.title = `${p.title}, ${p.kicker} | Vatsal Tank`
    makeCovers(projects).then((c) => setCover(c[i].src))
    return () => (document.title = 'Vatsal Tank | Full-stack developer and UI engineer')
  }, [i, p])

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.15 }
    )
    document.querySelectorAll('.cs .rv').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [slug])

  return (
    <div className="cs" style={{ '--c': p.color }}>
      <header className="nav nav--cs">
        <button className="back" onClick={onBack}>← Back to work</button>
        <span className="mono">Case study 0{i + 1} / 0{projects.length}</span>
        <a href={links.resume} target="_blank" rel="noreferrer" className="pill">Résumé</a>
      </header>

      {cover && (
        <ScrollExpand
          key={slug}
          src={cover}
          alt={`${p.title} cover`}
          title={p.title}
          
          useWindowScroll
          startWidth={46}
          startHeight={60}
          startRadius={22}
          mediaZoom={1.2}
          scrollDistance={1}
          holdDistance={0.2}
        >
          <div className="cs__over">
            <span className="status">{p.status}</span>
            <p className="it">{p.kicker}</p>
          </div>
        </ScrollExpand>
      )}

      <article className="cs__body">
        <section className="cs__intro rv">
          <p className="eyebrow">Case study</p>
          <h1>{p.summary}</h1>
          <div className="cs__links">
            {p.live && <a className="btn" href={p.live} target="_blank" rel="noreferrer">Live site</a>}
            {p.github && <a className="btn btn--ghost" href={p.github} target="_blank" rel="noreferrer">GitHub</a>}
          </div>
        </section>

        <section className="cs__grid">
          {[
            ['My role', p.role],
            ['The problem', p.problem],
            ['The solution', p.solution],
          ].map(([h, t]) => (
            <div key={h} className="rv">
              <p className="mono">{h}</p>
              <p>{t}</p>
            </div>
          ))}
        </section>

        {/* A look inside: stacked screenshots, or the usage flow as cards when there are no screenshots */}
        <section className="cs__inside">
          <div className="cs__inside-head rv">
            <p className="eyebrow">A look inside</p>
            <h2 className="cs__h">{p.gallery ? 'Screens from the live product' : 'How it works'}</h2>
            {!p.gallery && <p className="muted">No public build to screenshot yet, so here is what using it looks like, step by step.</p>}
          </div>
          <ScrollStack useWindowScroll className="cs-stack" itemDistance={60} itemStackDistance={26} stackPosition="14%" scaleEndPosition="8%" baseScale={0.88} itemScale={0.025}>
            {p.gallery
              ? p.gallery.map((src, k) => (
                  <ScrollStackItem key={src} itemClassName="cs-card cs-card--img">
                    <img src={src} alt={`${p.title} screen ${k + 1}`} loading="lazy" />
                    <span className="cs-card__n mono">{String(k + 1).padStart(2, '0')} / {String(p.gallery.length).padStart(2, '0')}</span>
                  </ScrollStackItem>
                ))
              : p.usage.map((u, k) => (
                  <ScrollStackItem key={u} itemClassName="cs-card cs-card--step">
                    <span className="cs-card__big">{String(k + 1).padStart(2, '0')}</span>
                    <div><p className="mono">Step {k + 1}</p><h3>{u}</h3></div>
                  </ScrollStackItem>
                ))}
          </ScrollStack>
          {p.gallery && p.usage && (
            <ol className="cs__usage">
              {p.usage.map((u, k) => (
                <li key={u} className="rv" style={{ transitionDelay: `${k * 60}ms` }}>
                  <GlareHover width="100%" height="100%" background="#111" borderColor="rgba(255,255,255,.1)" borderRadius="18px" glareColor="#c6ff3d" glareOpacity={0.25}>
                    <div className="cs__usage-in"><span className="mono">0{k + 1}</span><p>{u}</p></div>
                  </GlareHover>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="cs__feat rv">
          <h2 className="cs__h">Key features</h2>
          <ol>
            {p.features.map((f, k) => (
              <li key={f}><span className="mono">{String(k + 1).padStart(2, '0')}</span>{f}</li>
            ))}
          </ol>
        </section>

        <section className="cs__arch rv">
          <h2 className="cs__h">Architecture</h2>
          <dl>
            {p.architecture.map(([k, v]) => (
              <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </section>

        <section className="cs__split">
          <div className="rv">
            <h2 className="cs__h">Technology</h2>
            <ul className="chips">{p.tech.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="rv">
            <h2 className="cs__h">Challenges</h2>
            {p.challenges.map((c) => <p key={c} className="cs__chal">{c}</p>)}
          </div>
        </section>

        <nav className="cs__next" aria-label="Project navigation">
          <button onClick={() => onOpen(prev.slug)}>
            <span className="mono">← Previous</span>{prev.title}
          </button>
          <button onClick={onBack} className="cs__backall">
            <span className="mono">All work</span>Back to work
          </button>
          <button onClick={() => onOpen(next.slug)} className="cs__nextbtn">
            <span className="mono">Next project →</span>{next.title}
          </button>
        </nav>
      </article>
    </div>
  )
}
