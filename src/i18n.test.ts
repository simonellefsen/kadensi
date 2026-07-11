import { describe, expect, it } from 'vitest'
import { formatClock, formatDuration, t } from './i18n'

describe('Danish formatting', () => {
  it('formats whole and partial minutes for the programme UI', () => {
    expect(formatDuration(300)).toBe('5 min')
    expect(formatDuration(90)).toBe('1:30')
    expect(formatClock(65)).toBe('1:05')
  })

  it('provides a complete Danish locale', () => {
    expect(t().appName).toBe('KadensI')
    expect(t().segment).toMatchObject({ run: 'LØB', walk: 'GÅ' })
  })
})
