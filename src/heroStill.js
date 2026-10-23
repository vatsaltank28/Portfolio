// The hero's first frame ships in index.html (.pre) so it paints before any JS and stays the LCP element.
// Stacked layout: it stays put under the transparent hero. Sideways layout: the hero panel scrolls away,
// so the same <picture> node moves into the panel (no new element, so no second LCP candidate).
const pre = document.querySelector('.pre')
const still = pre?.querySelector('picture')

export function placeHeroStill(slot, horizontal) {
  if (!still) return
  // the live hero draws the same shade over everything (video included), so the static one steps aside
  pre.querySelector('i')?.remove()
  if (horizontal && slot) {
    slot.appendChild(still)
    pre.style.display = 'none'
  } else if (!horizontal && still.parentNode !== pre) {
    pre.prepend(still)
    pre.style.display = ''
  }
}
