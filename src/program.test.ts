import { describe, expect, it } from 'vitest'
import { ALL_SESSIONS, PROGRAM, nextSession, runDuration, sessionById, sessionDuration } from './program'

describe('training programme', () => {
  it('defines ten weeks of three uniquely identifiable sessions', () => {
    expect(PROGRAM).toHaveLength(10)
    expect(ALL_SESSIONS).toHaveLength(30)
    expect(new Set(ALL_SESSIONS.map((session) => session.id)).size).toBe(30)
    expect(PROGRAM.every((week) => week.sessions.length === 3)).toBe(true)
  })

  it('wraps every session in a five-minute warm-up and cool-down', () => {
    for (const session of ALL_SESSIONS) {
      expect(session.segments[0]).toEqual({ type: 'warmup', seconds: 300 })
      expect(session.segments.at(-1)).toEqual({ type: 'cooldown', seconds: 300 })
      expect(sessionDuration(session)).toBeGreaterThan(runDuration(session))
    }
  })

  it('keeps the published milestones and session lookup stable', () => {
    expect(PROGRAM[5].milestone).toBe('3km')
    expect(PROGRAM[9].milestone).toBe('5km')
    expect(sessionById('1-1')?.id).toBe('1-1')
    expect(sessionById('missing')).toBeUndefined()
  })

  it('selects the earliest uncompleted session', () => {
    expect(nextSession(new Set())?.id).toBe('1-1')
    expect(nextSession(new Set(['1-1', '1-2']))?.id).toBe('1-3')
    expect(nextSession(new Set(ALL_SESSIONS.map((session) => session.id)))).toBeUndefined()
  })
})
