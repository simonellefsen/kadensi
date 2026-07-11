import type { SessionDef } from '../program'
import { ALL_SESSIONS, PROGRAM, nextSession, runDuration, sessionDuration } from '../program'
import type { CompletedSession } from '../store'
import type { Strings } from '../i18n'
import { formatDuration } from '../i18n'

interface Props {
  completed: CompletedSession[]
  completedIds: ReadonlySet<string>
  strings: Strings
  onStart: (session: SessionDef) => void
}

export function Home({ completed, completedIds, strings, onStart }: Props) {
  void completed
  const next = nextSession(completedIds)
  const progressPct = Math.round((completedIds.size / ALL_SESSIONS.length) * 100)

  return (
    <div className="home">
      <header className="app-header">
        <h1 className="brand">
          <span className="brand-name">{strings.appName.slice(0, -1)}</span>
          <span className="brand-i">{strings.appName.slice(-1)}</span>
        </h1>
        <p className="tagline">{strings.tagline}</p>
      </header>

      {next ? (
        <section className="card hero">
          <p className="hero-label">{strings.nextSession}</p>
          <h2>
            {strings.week} {next.week} · {strings.session} {next.index}
          </h2>
          <p className="hero-desc">{PROGRAM[next.week - 1].label}</p>
          <div className="hero-stats">
            <span>
              {strings.totalTime}: <strong>{formatDuration(sessionDuration(next))}</strong>
            </span>
            <span>
              {strings.runTime}: <strong>{formatDuration(runDuration(next))}</strong>
            </span>
          </div>
          <button className="btn btn-primary btn-big" onClick={() => onStart(next)}>
            {strings.start} ▶
          </button>
        </section>
      ) : (
        <section className="card hero">
          <h2>{strings.programDone}</h2>
        </section>
      )}

      <section className="progress-section">
        <div className="progress-header">
          <span>{strings.progress}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </section>

      <section className="weeks">
        {PROGRAM.map((week) => {
          const done = week.sessions.filter((s) => completedIds.has(s.id)).length
          const weekDone = done === week.sessions.length
          return (
            <div key={week.week} className={weekDone ? 'card week done' : 'card week'}>
              <div className="week-header">
                <h3>
                  {strings.week} {week.week}
                  {week.milestone && (
                    <span className="milestone">
                      {' '}
                      🏅 {week.milestone === '3km' ? strings.milestone3km : strings.milestone5km}
                    </span>
                  )}
                </h3>
                <span className="week-count">
                  {done}/{week.sessions.length}
                </span>
              </div>
              <p className="week-label">{week.label}</p>
              <div className="week-sessions">
                {week.sessions.map((s) => {
                  const isDone = completedIds.has(s.id)
                  const isNext = next?.id === s.id
                  return (
                    <button
                      key={s.id}
                      className={
                        'session-chip' + (isDone ? ' chip-done' : '') + (isNext ? ' chip-next' : '')
                      }
                      onClick={() => onStart(s)}
                    >
                      {isDone ? '✓' : s.index}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
