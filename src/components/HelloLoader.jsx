import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import './HelloLoader.css'

// Port of the Framer "HelloLoader": greetings cycle until the page is ready, then the overlay slides away.
const GREETINGS = [
  ['Hello', 'English'], ['नमस्ते', 'Hindi'], ['Bonjour', 'French'], ['Hola', 'Spanish'], ['こんにちは', 'Japanese'],
  ['Ciao', 'Italian'], ['નમસ્તે', 'Gujarati'], ['안녕하세요', 'Korean'], ['Hallo', 'German'], ['Olá', 'Portuguese'],
  ['你好', 'Chinese'], ['Привет', 'Russian'], ['Merhaba', 'Turkish'], ['Γεια', 'Greek'],
]

const pageReady = () =>
  Promise.all([
    document.fonts.ready,
    new Promise((res) => (document.readyState === 'complete' ? res() : addEventListener('load', res, { once: true }))),
  ])

export default function HelloLoader({ onDone, speed = 0.45, minDuration = 1800, maxDuration = 8000 }) {
  const [i, setI] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const tick = setInterval(() => setI((k) => (k + 1) % GREETINGS.length), speed * 1000)
    let live = true
    const finish = () => live && setVisible(false)
    const wait = (ms) => new Promise((res) => setTimeout(res, ms))
    // keep looping until fonts and assets are in, but never less than a few greetings or more than maxDuration
    Promise.race([Promise.all([pageReady(), wait(minDuration)]), wait(maxDuration)]).then(finish)
    return () => {
      live = false
      clearInterval(tick)
    }
  }, [speed, minDuration, maxDuration])

  const [text, lang] = GREETINGS[i]
  const d = Math.min(speed * 0.4, 0.3)

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div className="hello" aria-hidden="true" exit={{ y: '-100%', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              className="hello__word"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { duration: d, ease: 'easeOut' } }}
              exit={{ opacity: 0, y: -40, transition: { duration: d * 0.7, ease: 'easeIn' } }}
            >
              <span className="hello__text">{text}</span>
              <span className="hello__lang">{lang}</span>
            </motion.div>
          </AnimatePresence>
          <span className="hello__name">Vatsal Tank</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
