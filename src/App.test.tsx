import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { unlockAudio } from './audio'

vi.mock('./audio', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./audio')>()
  return { ...actual, unlockAudio: vi.fn() }
})

describe('workout entry', () => {
  afterEach(cleanup)

  beforeEach(() => {
    localStorage.clear()
    vi.mocked(unlockAudio).mockClear()
  })

  it('unlocks audio from the Start button gesture', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))

    expect(unlockAudio).toHaveBeenCalledTimes(1)
  })

  it('unlocks audio from the resume button gesture', () => {
    localStorage.setItem('kadens.settings', JSON.stringify({ language: 'da' }))
    localStorage.setItem(
      'kadens.activeSession',
      JSON.stringify({
        sessionId: '1-1',
        segmentEndsAt: Date.now() + 60_000,
        segmentIndex: 0,
        paused: false,
        pausedRemainingMs: 0,
        startedAt: new Date().toISOString(),
        demo: false,
      }),
    )
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /fortsæt træning/i }))

    expect(unlockAudio).toHaveBeenCalledTimes(1)
  })
})
