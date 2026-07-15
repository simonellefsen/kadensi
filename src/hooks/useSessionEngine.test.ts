import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sessionById } from '../program'
import { loadActiveSession, type Settings } from '../store'
import { useSessionEngine } from './useSessionEngine'

const settings: Settings = { beeps: true, speech: true, language: 'da', holdMs: 650 }

// Week 10 / session 1: warmup + a single run + cooldown (3 segments).
// In demo mode every segment is capped at 5s, giving a clean, minimal fixture.
const session = sessionById('10-1')!

describe('useSessionEngine', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('advances through a full demo session and calls onFinished exactly once', () => {
    const onFinished = vi.fn()
    const { result, unmount } = renderHook(() =>
      useSessionEngine(session, { demo: true, settings, onFinished }),
    )

    expect(result.current.segment.type).toBe('warmup')
    expect(result.current.remainingSeconds).toBe(5)
    expect(result.current.totalSeconds).toBe(15)

    act(() => {
      vi.advanceTimersByTime(16_000)
    })

    expect(result.current.finished).toBe(true)
    expect(onFinished).toHaveBeenCalledTimes(1)
    expect(onFinished).toHaveBeenCalledWith(15)

    // Time continuing to pass after completion must not fire it again.
    act(() => {
      vi.advanceTimersByTime(5_000)
    })
    expect(onFinished).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('carries an overshoot across more than one segment boundary in a single tick', () => {
    const onFinished = vi.fn()
    const { result, unmount } = renderHook(() =>
      useSessionEngine(session, { demo: true, settings, onFinished }),
    )

    // Jump the clock forward (simulating a throttled/backgrounded tab) so the
    // next single interval tick has to skip past the entire "run" segment.
    vi.setSystemTime(new Date(Date.now() + 12_000))
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current.segment.type).toBe('cooldown')
    expect(result.current.remainingSeconds).toBe(3)
    expect(result.current.finished).toBe(false)
    expect(onFinished).not.toHaveBeenCalled()

    unmount()
  })

  it('freezes remaining time while paused and resumes from the same point', () => {
    const onFinished = vi.fn()
    const { result, unmount } = renderHook(() =>
      useSessionEngine(session, { demo: true, settings, onFinished }),
    )

    act(() => {
      vi.advanceTimersByTime(2_000) // 2s into the 5s warmup
    })
    expect(result.current.remainingSeconds).toBe(3)

    act(() => {
      result.current.pause()
    })
    expect(result.current.paused).toBe(true)

    // Time passing while paused must not affect the frozen countdown.
    act(() => {
      vi.advanceTimersByTime(10_000)
    })
    expect(result.current.paused).toBe(true)
    expect(result.current.remainingSeconds).toBe(3)

    act(() => {
      result.current.resume()
    })
    expect(result.current.paused).toBe(false)
    expect(result.current.remainingSeconds).toBe(3)

    act(() => {
      vi.advanceTimersByTime(1_000)
    })
    expect(result.current.remainingSeconds).toBe(2)

    unmount()
  })

  it('restores a running session from a persisted snapshot after a reload', () => {
    const first = renderHook(() =>
      useSessionEngine(session, { demo: true, settings, onFinished: vi.fn() }),
    )

    act(() => {
      vi.advanceTimersByTime(3_000) // 3s into the 5s warmup
    })
    expect(first.result.current.remainingSeconds).toBe(2)

    // Simulate the app closing without ever pausing.
    first.unmount()

    // Real time keeps passing while the app is closed.
    vi.setSystemTime(new Date(Date.now() + 1_000))

    const snapshot = loadActiveSession()
    expect(snapshot?.sessionId).toBe(session.id)
    expect(snapshot?.paused).toBe(false)

    const second = renderHook(() =>
      useSessionEngine(session, { demo: true, settings, snapshot, onFinished: vi.fn() }),
    )

    // 4s have now elapsed since the segment started (3s + 1s) -> ~1s left.
    expect(second.result.current.segment.type).toBe('warmup')
    expect(second.result.current.remainingSeconds).toBe(1)

    second.unmount()
  })

  it('restores a paused snapshot with the exact frozen remaining time', () => {
    const first = renderHook(() =>
      useSessionEngine(session, { demo: true, settings, onFinished: vi.fn() }),
    )

    act(() => {
      vi.advanceTimersByTime(1_000) // 1s into the 5s warmup
    })
    act(() => {
      first.result.current.pause()
    })
    expect(first.result.current.remainingSeconds).toBe(4)

    first.unmount()

    // A lot of real time passes while the paused app is closed.
    vi.setSystemTime(new Date(Date.now() + 60_000))

    const snapshot = loadActiveSession()
    expect(snapshot?.paused).toBe(true)

    const second = renderHook(() =>
      useSessionEngine(session, { demo: true, settings, snapshot, onFinished: vi.fn() }),
    )

    expect(second.result.current.paused).toBe(true)
    expect(second.result.current.remainingSeconds).toBe(4)

    second.unmount()
  })
})
