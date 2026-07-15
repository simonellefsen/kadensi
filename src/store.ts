import { detectLanguage, LANGUAGES, type Language } from './i18n'
import { sessionById } from './program'

export interface CompletedSession {
  id: string
  completedAt: string // ISO date-time
  durationSeconds: number
}

export interface Settings {
  beeps: boolean
  speech: boolean
  language: Language
  /** How long the in-session control buttons must be held before they fire, in ms */
  holdMs: number
}

export interface ActiveSessionSnapshot {
  sessionId: string
  /** Epoch ms when the current segment ends (while running) */
  segmentEndsAt: number
  segmentIndex: number
  paused: boolean
  /** Remaining ms in current segment when paused */
  pausedRemainingMs: number
  startedAt: string
  demo: boolean
}

const KEYS = {
  completed: 'kadens.completed',
  settings: 'kadens.settings',
  active: 'kadens.activeSession',
  installDismissed: 'kadens.installDismissed',
} as const

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable — app still works for the session
  }
}

export const HOLD_MS_MIN = 300
export const HOLD_MS_MAX = 1500
export const HOLD_MS_DEFAULT = 650

export const DEFAULT_SETTINGS: Settings = {
  beeps: true,
  speech: true,
  language: detectLanguage(),
  holdMs: HOLD_MS_DEFAULT,
}

export function loadCompleted(): CompletedSession[] {
  return read<CompletedSession[]>(KEYS.completed) ?? []
}

export function saveCompleted(sessions: CompletedSession[]): void {
  write(KEYS.completed, sessions)
}

export function loadSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...(read<Partial<Settings>>(KEYS.settings) ?? {}) }
}

export function saveSettings(settings: Settings): void {
  write(KEYS.settings, settings)
}

export function loadActiveSession(): ActiveSessionSnapshot | null {
  return read<ActiveSessionSnapshot>(KEYS.active)
}

export function saveActiveSession(snapshot: ActiveSessionSnapshot | null): void {
  if (snapshot === null) localStorage.removeItem(KEYS.active)
  else write(KEYS.active, snapshot)
}

export function loadInstallDismissed(): boolean {
  return read<boolean>(KEYS.installDismissed) ?? false
}

export function saveInstallDismissed(): void {
  write(KEYS.installDismissed, true)
}

export interface ExportData {
  version: 1
  exportedAt: string
  completed: CompletedSession[]
  settings: Settings
}

export function exportData(): string {
  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    completed: loadCompleted(),
    settings: loadSettings(),
  }
  return JSON.stringify(data, null, 2)
}

const KNOWN_LANGUAGES = new Set<string>(LANGUAGES.map((l) => l.code))

function isValidCompletedSession(value: unknown): value is CompletedSession {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  if (typeof v.id !== 'string' || !sessionById(v.id)) return false
  if (typeof v.completedAt !== 'string' || Number.isNaN(Date.parse(v.completedAt))) return false
  if (typeof v.durationSeconds !== 'number' || !Number.isFinite(v.durationSeconds) || v.durationSeconds < 0) {
    return false
  }
  return true
}

function isValidSettingsPatch(value: unknown): value is Partial<Settings> {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  if ('beeps' in v && typeof v.beeps !== 'boolean') return false
  if ('speech' in v && typeof v.speech !== 'boolean') return false
  if ('language' in v && !KNOWN_LANGUAGES.has(v.language as string)) return false
  if ('holdMs' in v) {
    const h = v.holdMs
    if (typeof h !== 'number' || !Number.isFinite(h) || h < HOLD_MS_MIN || h > HOLD_MS_MAX) return false
  }
  return true
}

export type ImportError = 'parse' | 'version' | 'completed' | 'settings'

/**
 * Validates the entire file before writing anything, so a malformed,
 * incompatible, or hand-edited backup can never partially overwrite
 * existing progress.
 */
export function importData(json: string): { ok: true } | { ok: false; error: ImportError } {
  let data: unknown
  try {
    data = JSON.parse(json)
  } catch {
    return { ok: false, error: 'parse' }
  }
  if (typeof data !== 'object' || data === null) return { ok: false, error: 'parse' }

  const d = data as Record<string, unknown>
  if (d.version !== 1) return { ok: false, error: 'version' }
  if (!Array.isArray(d.completed) || !d.completed.every(isValidCompletedSession)) {
    return { ok: false, error: 'completed' }
  }
  if (d.settings !== undefined && !isValidSettingsPatch(d.settings)) {
    return { ok: false, error: 'settings' }
  }

  saveCompleted(d.completed)
  if (d.settings) saveSettings({ ...DEFAULT_SETTINGS, ...(d.settings as Partial<Settings>) })
  return { ok: true }
}

export function resetProgress(): void {
  localStorage.removeItem(KEYS.completed)
  localStorage.removeItem(KEYS.active)
}
