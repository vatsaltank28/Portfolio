// Screenshots and stills that have -sm (720w) and -md (1440w) webp variants next to them in /public.
const RESIZED = /^\/(shots\/hd\/[\w-]+\.webp|media\/(livevote|mixculturepizzeria|about-me)\.(jpg|webp))$/
const base = (src) => src.replace(/\.\w+$/, '')

export const srcSet = (src) => (src && RESIZED.test(src) ? `${base(src)}-sm.webp 720w, ${base(src)}-md.webp 1440w` : undefined)

// <video poster> has no srcset, so pick one size up front
export const poster = (src) =>
  src && RESIZED.test(src) ? `${base(src)}-${matchMedia('(max-width: 899px)').matches ? 'sm' : 'md'}.webp` : src

// smallest variant, for thumbnails like the spiral cards
export const small = (src) => (src && RESIZED.test(src) ? `${base(src)}-sm.webp` : src)
