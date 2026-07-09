import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SessionDef } from '../program'
import type { ActiveSessionSnapshot, Settings } from '../store'
import { saveActiveSession } from '../store'
import { cueExtra, cueSegment, playCountdownBeep } from '../audio'

export interface EngineState {
  segmentIndex: number
  remainingMs: number
  paused: boolean
  finished: boolean
}

interface Options {
  demo: boolean
  settings: Settings
  /** Restore a session that was interrupted (reload/lock) */
  snapshot?: ActiveSessionSnapshot | null
  onFinished: (elapsedSeconds: number) => void
}

const DEMO_SEGMENT_SECONDS = 5
const TICK_MS = 200

export function useSessionEngine(session: SessionDef, opts: Options) {
  const { demo, settings, snapshot, onFinished } = opts

  const segments = useMemo(
    () =>
      session.segments.map((seg) => ({
        ...seg,
        seconds: demo ? Math.min(seg.seconds, DEMO_SEGMENT_SECONDS) : seg.seconds,
      })),
    [session, demo],
  )

  const totalSeconds = useMemo(() => segments.reduce((s, seg) => s + seg.seconds, 0), [segments])

  const startedAtRef = useRef<string>(snapshot?.startedAt ?? new Date().toISOString())
  const settingsRef = useRef(settings)
  settingsRef.current = settings
  const onFinishedRef = useRef(onFinished)
  onFinishedRef.current = onFinished
  const lastCountdownSecondRef = useRef<number>(-1)

  const [state, setState] = useState<EngineState>(() => {
    if (snapshot && snapshot.sessionId === session.id) {
      return {
        segmentIndex: Math.min(snapshot.segmentIndex, segments.length - 1),
        remainingMs: snapshot.paused
          ? snapshot.pausedRemainingMs
          : Math.max(0, snapshot.segmentEndsAt - Date.now()),
        paused: snapshot.paused,
        finished: false,
      }
    }
    return {
      segmentIndex: 0,
      remainingMs: segments[0].seconds * 1000,
      paused: false,
      finished: false,
    }
  })

  // Absolute end time of the current segment while running; null while paused
  const endsAtRef = useRef<number | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  const persist = useCallback(
    (s: EngineState) => {
      if (s.finished) {
        saveActiveSession(null)
        return
      }
      saveActiveSession({
        sessionId: session.id,
        segmentIndex: s.segmentIndex,
        paused: s.paused,
        segmentEndsAt: endsAtRef.current ?? 0,
        pausedRemainingMs: s.remainingMs,
        startedAt: startedAtRef.current,
        demo,
      })
    },
    [session.id, demo],
  )

  // Initialise endsAt + first cue exactly once
  const initialisedRef = useRef(false)
  useEffect(() => {
    if (initialisedRef.current) return
    initialisedRef.current = true
    const s = stateRef.current
    if (!s.paused) {
      endsAtRef.current = Date.now() + s.remainingMs
      if (!snapshot) cueSegment(segments[0].type, settingsRef.current)
    }
    persist(stateRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const halfwayCuedRef = useRef(false)
  const lastRunCuedRef = useRef(false)
  const lastRunIndex = useMemo(() => {
    for (let i = segments.length - 1; i >= 0; i--) {
      if (segments[i].type === 'run') return i
    }
    return -1
  }, [segments])
  const runCount = useMemo(() => segments.filter((s) => s.type === 'run').length, [segments])

  const advance = useCallback(
    (fromState: EngineState, overshootMs: number): EngineState => {
      let idx = fromState.segmentIndex
      let carry = overshootMs
      while (true) {
        idx += 1
        if (idx >= segments.length) {
          endsAtRef.current = null
          cueExtra('done', settingsRef.current)
          const finished: EngineState = { segmentIndex: segments.length - 1, remainingMs: 0, paused: false, finished: true }
          saveActiveSession(null)
          onFinishedRef.current(totalSeconds)
          return finished
        }
        const segMs = segments[idx].seconds * 1000
        if (carry < segMs) {
          endsAtRef.current = Date.now() + (segMs - carry)
          cueSegment(segments[idx].type, settingsRef.current)
          if (idx === lastRunIndex && runCount > 1 && !lastRunCuedRef.current) {
            lastRunCuedRef.current = true
            setTimeout(() => cueExtra('lastInterval', settingsRef.current), 1500)
          }
          const next: EngineState = { segmentIndex: idx, remainingMs: segMs - carry, paused: false, finished: false }
          persist(next)
          return next
        }
        carry -= segMs
      }
    },
    [segments, totalSeconds, lastRunIndex, runCount, persist],
  )

  // Main tick loop
  useEffect(() => {
    if (state.paused || state.finished) return
    const timer = setInterval(() => {
      const endsAt = endsAtRef.current
      if (endsAt === null) return
      const remaining = endsAt - Date.now()

      if (remaining <= 0) {
        setState((s) => advance(s, -remaining))
        return
      }

      // Countdown beeps for the last 3 seconds of a segment
      const secLeft = Math.ceil(remaining / 1000)
      if (secLeft <= 3 && secLeft !== lastCountdownSecondRef.current && settingsRef.current.beeps) {
        lastCountdownSecondRef.current = secLeft
        playCountdownBeep()
      }

      // Halfway cue (based on total elapsed vs total duration)
      if (!halfwayCuedRef.current) {
        const elapsedBefore = segments
          .slice(0, stateRef.current.segmentIndex)
          .reduce((s, seg) => s + seg.seconds, 0)
        const elapsed = elapsedBefore + (segments[stateRef.current.segmentIndex].seconds - remaining / 1000)
        if (elapsed >= totalSeconds / 2) {
          halfwayCuedRef.current = true
          cueExtra('halfway', settingsRef.current)
        }
      }

      setState((s) => (s.paused || s.finished ? s : { ...s, remainingMs: remaining }))
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [state.paused, state.finished, advance, segments, totalSeconds])

  const pause = useCallback(() => {
    setState((s) => {
      if (s.paused || s.finished) return s
      const remaining = endsAtRef.current !== null ? Math.max(0, endsAtRef.current - Date.now()) : s.remainingMs
      endsAtRef.current = null
      const next = { ...s, paused: true, remainingMs: remaining }
      persist(next)
      return next
    })
  }, [persist])

  const resume = useCallback(() => {
    setState((s) => {
      if (!s.paused || s.finished) return s
      endsAtRef.current = Date.now() + s.remainingMs
      const next = { ...s, paused: false }
      persist(next)
      return next
    })
  }, [persist])

  const skip = useCallback(() => {
    setState((s) => (s.finished ? s : advance({ ...s, paused: false }, 0)))
  }, [advance])

  /** Abandon without recording completion */
  const abort = useCallback(() => {
    endsAtRef.current = null
    saveActiveSession(null)
  }, [])

  const elapsedSeconds = useMemo(() => {
    const before = segments.slice(0, state.segmentIndex).reduce((s, seg) => s + seg.seconds, 0)
    return before + (segments[state.segmentIndex].seconds - state.remainingMs / 1000)
  }, [segments, state.segmentIndex, state.remainingMs])

  return {
    segments,
    segment: segments[state.segmentIndex],
    segmentIndex: state.segmentIndex,
    remainingSeconds: Math.max(0, Math.ceil(state.remainingMs / 1000)),
    paused: state.paused,
    finished: state.finished,
    totalSeconds,
    elapsedSeconds: Math.min(elapsedSeconds, totalSeconds),
    pause,
    resume,
    skip,
    abort,
  }
}
