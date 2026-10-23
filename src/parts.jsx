/* ---------- Project cover art, drawn once on a canvas (no stock photos) ---------- */
const loadImg = (src) =>
  new Promise((res) => {
    const im = new Image()
    im.onload = () => res(im)
    im.onerror = () => res(null)
    im.src = src
  })

// `scale` shrinks the canvas for small thumbnails; the art is laid out at 1200x1500 either way.
export async function makeCovers(projects, scale = 1) {
  await document.fonts.ready
  const shots = await Promise.all(projects.map((p) => (p.shot ? loadImg(p.shot) : null)))
  return Promise.all(projects.map(async (p, i) => {
    const c = document.createElement('canvas')
    c.width = Math.round(1200 * scale)
    c.height = Math.round(1500 * scale)
    const x = c.getContext('2d')
    x.scale(scale, scale)
    x.fillStyle = '#0c0c0c'
    x.fillRect(0, 0, 1200, 1500)

    const shot = shots[i]
    if (shot) {
      // real screenshot fills the top of the card, fading into the title area
      const h = 1500 * 0.72
      const s = Math.max(1200 / shot.width, h / shot.height)
      x.drawImage(shot, (1200 - shot.width * s) / 2, 0, shot.width * s, shot.height * s)
      const f = x.createLinearGradient(0, h * 0.45, 0, h + 60)
      f.addColorStop(0, 'rgba(12,12,12,0)')
      f.addColorStop(1, 'rgba(12,12,12,1)')
      x.fillStyle = f
      x.fillRect(0, 0, 1200, 1500)
    } else {
      const g = x.createRadialGradient(860, 420, 40, 860, 420, 980)
      g.addColorStop(0, p.color)
      g.addColorStop(0.45, p.color + '55')
      g.addColorStop(1, 'rgba(12,12,12,0)')
      x.fillStyle = g
      x.fillRect(0, 0, 1200, 1500)
    }

    x.fillStyle = 'rgba(255,255,255,0.9)'
    x.font = '500 38px "JetBrains Mono", monospace'
    x.textAlign = 'right'
    x.fillText(p.status.toUpperCase(), 1120, 1450)
    x.textAlign = 'left'

    x.fillStyle = '#fff'
    x.font = '600 200px "Inter Tight", sans-serif'
    if ('letterSpacing' in x) x.letterSpacing = '-10px'
    let size = 200
    while (x.measureText(p.title).width > 1040 && size > 80) {
      size -= 10
      x.font = `600 ${size}px "Inter Tight", sans-serif`
    }
    x.fillText(p.title, 70, 1260)
    if ('letterSpacing' in x) x.letterSpacing = '0px'
    x.font = 'italic 400 56px "Inter Tight", sans-serif'
    x.fillStyle = 'rgba(255,255,255,0.75)'
    x.fillText(p.kicker, 80, 1360)
    // toBlob encodes off the main thread, unlike toDataURL
    const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.85))
    return { src: URL.createObjectURL(blob), alt: `${p.title}, ${p.kicker}`, title: p.title }
  }))
}
