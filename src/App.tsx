import { useCallback, useMemo, useState } from 'react'
import type { SessionDef } from './program'
import { sessionById } from './program'
import type { ActiveSessionSnapshot, CompletedSession, Settings } from './store'
import {
  loadActiveSession,
  loadCompleted,
  loadSettings,
  saveActiveSession,
  saveCompleted,
  saveSettings,
} from './store'
import { t } from './i18n'
import { Home } from './components/Home'
import { SessionScreen } from './components/Session'
import { History } from './components/History'
import { SettingsScreen } from './components/Settings'
import { InstallBanner } from './components/InstallBanner'
import { Advice } from './components/Advice'

type View = 'home' | 'advice' | 'history' | 'settings'

interface RunningSession {
  session: SessionDef
  snapshot: ActiveSessionSnapshot | null
  demo: boolean
}

const DEMO = new URLSearchParams(window.location.search).get('demo') === '1'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [completed, setCompleted] = useState<CompletedSession[]>(() => loadCompleted())
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const [running, setRunning] = useState<RunningSession | null>(null)
  const [pendingResume, setPendingResume] = useState<ActiveSessionSnapshot | null>(() => {
    const snap = loadActiveSession()
    return snap && sessionById(snap.sessionId) ? snap : null
  })

  const strings = t(settings.language)
  const completedIds = useMemo(() => new Set(completed.map((c) => c.id)), [completed])

  const updateSettings = useCallback((next: Settings) => {
    setSettings(next)
    saveSettings(next)
  }, [])

  const startSession = useCallback((session: SessionDef) => {
    setPendingResume(null)
    saveActiveSession(null)
    setRunning({ session, snapshot: null, demo: DEMO })
  }, [])

  const resumeSession = useCallback(() => {
    if (!pendingResume) return
    const session = sessionById(pendingResume.sessionId)
    if (session) setRunning({ session, snapshot: pendingResume, demo: pendingResume.demo })
    setPendingResume(null)
  }, [pendingResume])

  const discardResume = useCallback(() => {
    saveActiveSession(null)
    setPendingResume(null)
  }, [])

  const onSessionFinished = useCallback((session: SessionDef, elapsedSeconds: number) => {
    setCompleted((prev) => {
      const next = [
        ...prev,
        { id: session.id, completedAt: new Date().toISOString(), durationSeconds: elapsedSeconds },
      ]
      saveCompleted(next)
      return next
    })
  }, [])

  const onDataChanged = useCallback(() => {
    setCompleted(loadCompleted())
    setSettings(loadSettings())
  }, [])

  if (running) {
    return (
      <SessionScreen
        session={running.session}
        snapshot={running.snapshot}
        demo={running.demo}
        settings={settings}
        strings={strings}
        onFinished={(elapsed) => onSessionFinished(running.session, elapsed)}
        onExit={() => setRunning(null)}
      />
    )
  }

  return (
    <div className="app">
      {pendingResume && (
        <div className="resume-banner card">
          <p>{strings.resumePrompt}</p>
          <div className="row">
            <button className="btn btn-primary" onClick={resumeSession}>
              {strings.resumeYes}
            </button>
            <button className="btn btn-ghost" onClick={discardResume}>
              {strings.resumeNo}
            </button>
          </div>
        </div>
      )}

      <main className="view">
        {view === 'home' && (
          <Home
            completed={completed}
            completedIds={completedIds}
            strings={strings}
            onStart={startSession}
          />
        )}
        {view === 'advice' && <Advice strings={strings} />}
        {view === 'history' && <History completed={completed} strings={strings} />}
        {view === 'settings' && (
          <SettingsScreen
            settings={settings}
            strings={strings}
            onChange={updateSettings}
            onDataChanged={onDataChanged}
          />
        )}
      </main>

      <InstallBanner strings={strings} />

      <nav className="tabbar">
        <button className={view === 'home' ? 'tab active' : 'tab'} onClick={() => setView('home')}>
          <span className="tab-icon">🏃</span>
          {strings.navHome}
        </button>
        <button
          className={view === 'advice' ? 'tab active' : 'tab'}
          onClick={() => setView('advice')}
        >
          <span className="tab-icon">🥗</span>
          {strings.navAdvice}
        </button>
        <button
          className={view === 'history' ? 'tab active' : 'tab'}
          onClick={() => setView('history')}
        >
          <span className="tab-icon">📅</span>
          {strings.navHistory}
        </button>
        <button
          className={view === 'settings' ? 'tab active' : 'tab'}
          onClick={() => setView('settings')}
        >
          <span className="tab-icon">⚙️</span>
          {strings.navSettings}
        </button>
      </nav>
    </div>
  )
}
