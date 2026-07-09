import type { SegmentType } from './program'
import type { Settings } from './store'
import { t } from './i18n'

let ctx: AudioContext | null = null

/**
 * Must be called from a user-gesture handler (the Start button) —
 * iOS refuses to start audio otherwise.
 */
export function unlockAudio(): void {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (Ctor) ctx = new Ctor()
  }
  if (ctx && ctx.state === 'suspended') void ctx.resume()
  // Prime speech synthesis with an empty utterance inside the gesture
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance('')
    u.volume = 0
    window.speechSynthesis.speak(u)
  }
}

function tone(freq: number, startAt: number, duration: number, volume = 0.5): void {
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  const t0 = ctx.currentTime + startAt
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.02)
  gain.gain.setValueAtTime(volume, t0 + duration - 0.05)
  gain.gain.linearRampToValueAtTime(0, t0 + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + duration)
}

/** Rising double beep = time to run; falling long beep = time to walk */
export function playSegmentBeep(type: SegmentType): void {
  if (!ctx) return
  if (ctx.state === 'suspended') void ctx.resume()
  switch (type) {
    case 'run':
      tone(660, 0, 0.18)
      tone(880, 0.22, 0.28)
      break
    case 'walk':
      tone(660, 0, 0.18)
      tone(440, 0.22, 0.4)
      break
    case 'warmup':
    case 'cooldown':
      tone(550, 0, 0.25)
      break
  }
}

export function playCountdownBeep(): void {
  tone(880, 0, 0.09, 0.35)
}

export function playFinishedFanfare(): void {
  if (!ctx) return
  tone(660, 0, 0.15)
  tone(880, 0.18, 0.15)
  tone(1100, 0.36, 0.35)
}

let daVoice: SpeechSynthesisVoice | null | undefined
function danishVoice(): SpeechSynthesisVoice | null {
  if (daVoice !== undefined) return daVoice
  const voices = window.speechSynthesis?.getVoices() ?? []
  daVoice = voices.find((v) => v.lang.toLowerCase().startsWith('da')) ?? null
  return daVoice
}

// Voice list loads async in some browsers
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    daVoice = undefined
  })
}

export function speak(text: string): void {
  if (!('speechSynthesis' in window)) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'da-DK'
  const voice = danishVoice()
  if (voice) u.voice = voice
  u.rate = 1.0
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}

export function cueSegment(type: SegmentType, settings: Settings): void {
  if (settings.beeps) playSegmentBeep(type)
  if (settings.speech) speak(t(settings.language).speech[type])
}

export function cueExtra(kind: 'halfway' | 'lastInterval' | 'done', settings: Settings): void {
  if (kind === 'done' && settings.beeps) playFinishedFanfare()
  if (settings.speech) speak(t(settings.language).speech[kind])
}
