const audioCtx = () => {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
}

let ctx: AudioContext | null = null

const getCtx = (): AudioContext | null => {
  if (!ctx) ctx = audioCtx()
  return ctx
}

const beep = (freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.12) => {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = vol
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + duration)
}

export const SoundManager = {
  click: () => beep(800, 0.06, 'square', 0.05),
  success: () => {
    beep(523, 0.12, 'sine', 0.1)
    setTimeout(() => beep(659, 0.12, 'sine', 0.1), 100)
    setTimeout(() => beep(784, 0.18, 'sine', 0.1), 200)
  },
  error: () => {
    beep(220, 0.15, 'sawtooth', 0.08)
    setTimeout(() => beep(180, 0.2, 'sawtooth', 0.08), 120)
  },
  warning: () => {
    beep(440, 0.1, 'triangle', 0.08)
    setTimeout(() => beep(440, 0.1, 'triangle', 0.08), 200)
  },
  save: () => {
    beep(440, 0.08, 'sine', 0.08)
    setTimeout(() => beep(660, 0.15, 'sine', 0.1), 80)
  },
}
