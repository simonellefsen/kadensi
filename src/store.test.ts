import { beforeEach, describe, expect, it } from 'vitest'
import {
  DEFAULT_SETTINGS,
  HOLD_MS_MAX,
  HOLD_MS_MIN,
  exportData,
  importData,
  loadCompleted,
  loadSettings,
  saveCompleted,
  saveSettings,
  type CompletedSession,
} from './store'

const validSession: CompletedSession = {
  id: '1-1',
  completedAt: '2026-07-13T08:00:00.000Z',
  durationSeconds: 1710,
}

function seedExistingData(): CompletedSession[] {
  const existing: CompletedSession[] = [validSession]
  saveCompleted(existing)
  saveSettings({ ...DEFAULT_SETTINGS, beeps: false, holdMs: 900 })
  return existing
}

describe('importData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips a real export produced by exportData', () => {
    seedExistingData()
    const exported = exportData()

    localStorage.clear()
    const result = importData(exported)

    expect(result.ok).toBe(true)
    expect(loadCompleted()).toEqual([validSession])
    expect(loadSettings().holdMs).toBe(900)
    expect(loadSettings().beeps).toBe(false)
  })

  it('rejects unparsable JSON and preserves existing data', () => {
    const existing = seedExistingData()
    const result = importData('{not valid json')

    expect(result).toEqual({ ok: false, error: 'parse' })
    expect(loadCompleted()).toEqual(existing)
  })

  it('rejects a JSON value that is not an object', () => {
    const result = importData('42')
    expect(result).toEqual({ ok: false, error: 'parse' })
  })

  it('rejects an incompatible or missing version and preserves existing data', () => {
    const existing = seedExistingData()
    const result = importData(JSON.stringify({ version: 2, completed: [] }))

    expect(result).toEqual({ ok: false, error: 'version' })
    expect(loadCompleted()).toEqual(existing)
  })

  it('rejects a completed entry referencing an unknown session id', () => {
    const existing = seedExistingData()
    const result = importData(
      JSON.stringify({
        version: 1,
        completed: [{ id: '99-9', completedAt: '2026-07-13T08:00:00.000Z', durationSeconds: 100 }],
      }),
    )

    expect(result).toEqual({ ok: false, error: 'completed' })
    expect(loadCompleted()).toEqual(existing)
  })

  it('rejects a completed entry with an invalid date or negative duration', () => {
    const badDate = importData(
      JSON.stringify({
        version: 1,
        completed: [{ id: '1-1', completedAt: 'not-a-date', durationSeconds: 100 }],
      }),
    )
    expect(badDate).toEqual({ ok: false, error: 'completed' })

    const badDuration = importData(
      JSON.stringify({
        version: 1,
        completed: [{ id: '1-1', completedAt: '2026-07-13T08:00:00.000Z', durationSeconds: -5 }],
      }),
    )
    expect(badDuration).toEqual({ ok: false, error: 'completed' })
  })

  it('rejects settings with an out-of-range hold duration or unknown language', () => {
    seedExistingData()

    const tooLow = importData(
      JSON.stringify({ version: 1, completed: [], settings: { holdMs: HOLD_MS_MIN - 1 } }),
    )
    expect(tooLow).toEqual({ ok: false, error: 'settings' })

    const tooHigh = importData(
      JSON.stringify({ version: 1, completed: [], settings: { holdMs: HOLD_MS_MAX + 1 } }),
    )
    expect(tooHigh).toEqual({ ok: false, error: 'settings' })

    const badLanguage = importData(
      JSON.stringify({ version: 1, completed: [], settings: { language: 'fr' } }),
    )
    expect(badLanguage).toEqual({ ok: false, error: 'settings' })

    // None of the rejected imports should have touched existing settings.
    expect(loadSettings().holdMs).toBe(900)
  })

  it('accepts a completed-only backup with no settings key', () => {
    const result = importData(JSON.stringify({ version: 1, completed: [validSession] }))
    expect(result.ok).toBe(true)
    expect(loadCompleted()).toEqual([validSession])
  })
})
