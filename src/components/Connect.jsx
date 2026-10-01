import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { links } from '../data.js'
import './Connect.css'

// FormSubmit relays the form to the inbox below; no backend needed.
const ENDPOINT = `https://formsubmit.co/ajax/${links.email}`
const REASONS = ['Just saying hi', 'Work or internship', 'Collaboration']

const SOCIAL = {
  linkedin: {
    title: 'Let’s connect on LinkedIn',
    body: 'Your note is in my inbox. Follow me and drop a message on LinkedIn so we can keep talking there.',
    cta: 'Follow and message on LinkedIn',
    href: links.linkedin,
  },
  instagram: {
    title: 'Collaborate on Echoverse',
    body: 'Your note is in my inbox. For collaborations, follow and message @_echoverse.lyrics on Instagram.',
    cta: 'Open @_echoverse.lyrics',
    href: links.instagram,
  },
}

function Popup({ kind, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [onClose])
  const s = SOCIAL[kind]
  // portal: the page track is transformed, which would trap a fixed overlay inside the panel
  return createPortal(
    <div className="popup" onClick={onClose}>
      <div className="popup__card" role="dialog" aria-modal="true" aria-labelledby="popup-title" onClick={(e) => e.stopPropagation()}>
        <button className="popup__x" onClick={onClose} aria-label="Close">×</button>
        <p className="eyebrow">Message sent</p>
        <h3 id="popup-title">{s.title}</h3>
        <p className="muted">{s.body}</p>
        <div className="popup__row">
          <a className="btn" href={s.href} target="_blank" rel="noreferrer" autoFocus>{s.cta} ↗</a>
          <button className="btn btn--ghost" onClick={onClose}>Maybe later</button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function Connect() {
  const [state, setState] = useState('idle') // idle | sending | error
  const [popup, setPopup] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data._honey) return
    setState('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: `Portfolio: ${data.name} wants to connect (${data.reason})`, _template: 'table', _captcha: 'false' }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || String(json.success) === 'false') throw new Error(json.message || `Request failed (${res.status})`)
      form.reset()
      setState('idle')
      setPopup(data.reason === 'Collaboration' ? 'instagram' : 'linkedin')
    } catch (err) {
      console.error('Contact form failed:', err)
      setState('error')
    }
  }

  return (
    <>
      <form className="connect" onSubmit={submit}>
        <p className="eyebrow">Stay in touch</p>
        <h3>Leave your details and I’ll get back to you.</h3>
        <label>Name<input name="name" type="text" autoComplete="name" required maxLength={80} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required maxLength={120} /></label>
        <label>I’m here for
          <select name="reason" defaultValue={REASONS[0]}>
            {REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
        <label>Message<textarea name="message" rows={3} maxLength={2000} placeholder="Optional" /></label>
        <input className="connect__honey" name="_honey" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button className="btn" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send'}</button>
        {state === 'error' && (
          <p className="connect__err" role="alert">
            That didn’t send. Please email me at <a href={`mailto:${links.email}`}>{links.email}</a> instead.
          </p>
        )}
      </form>
      {popup && <Popup kind={popup} onClose={() => setPopup(null)} />}
    </>
  )
}
