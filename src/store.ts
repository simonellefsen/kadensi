import { detectLanguage, type Language } from './i18n'

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

export function importData(json: string): { ok: true } | { ok: false; error: string } {
  try {
    const data = JSON.parse(json) as Partial<ExportData>
    if (!Array.isArray(data.completed)) return { ok: false, error: 'invalid' }
    saveCompleted(data.completed)
    if (data.settings) saveSettings({ ...DEFAULT_SETTINGS, ...data.settings })
    return { ok: true }
  } catch {
    return { ok: false, error: 'parse' }
  }
}

export function resetProgress(): void {
  localStorage.removeItem(KEYS.completed)
  localStorage.removeItem(KEYS.active)
}
