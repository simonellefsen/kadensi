import { useRef } from 'react'
import type { SessionDef } from '../program'
import type { ActiveSessionSnapshot, Settings } from '../store'
import type { Strings } from '../i18n'
import { formatClock } from '../i18n'
import { useSessionEngine } from '../hooks/useSessionEngine'
import { useWakeLock } from '../hooks/useWakeLock'
import { HoldButton } from './HoldButton'

interface Props {
  session: SessionDef
  snapshot: ActiveSessionSnapshot | null
  demo: boolean
  settings: Settings
  strings: Strings
  onFinished: (elapsedSeconds: number) => void
  onExit: () => void
}

export function SessionScreen(props: Props) {
  const { session, snapshot, demo, settings, strings, onFinished, onExit } = props
  const finishedReportedRef = useRef(false)

  const engine = useSessionEngine(session, {
    demo,
    settings,
    snapshot,
    onFinished: (elapsed) => {
      if (!finishedReportedRef.current) {
        finishedReportedRef.current = true
        onFinished(elapsed)
      }
    },
  })

  useWakeLock(!engine.finished)

  if (engine.finished) {
    return (
      <div className="session seg-done">
        <div className="session-inner">
          <h1 className="finished-title">🎉</h1>
          <h2>{strings.finished}</h2>
          <p>{strings.finishedBody}</p>
          <button className="btn btn-primary btn-big" onClick={onExit}>
            {strings.backToPlan}
          </button>
        </div>
      </div>
    )
  }

  const seg = engine.segment
  const nextSeg = engine.segments[engine.segmentIndex + 1]
  const totalPct = (engine.elapsedSeconds / engine.totalSeconds) * 100

  const handleEnd = () => {
    engine.abort()
    onExit()
  }

  return (
    <div className={`session seg-${seg.type}${engine.paused ? ' is-paused' : ''}`}>
      <div className="session-inner">
        <header className="session-top">
          <span className="session-week">
            {strings.week} {session.week} · {strings.session} {session.index}
            {demo && ' · DEMO'}
          </span>
          <span className="session-total">
            {formatClock(engine.elapsedSeconds)} / {formatClock(engine.totalSeconds)}
          </span>
        </header>

        <div className="segment-name">{strings.segment[seg.type]}</div>
        <div className="countdown" data-testid="countdown">
          {formatClock(engine.remainingSeconds)}
        </div>

        {nextSeg ? (
          <div className="next-up">
            {strings.next}: {strings.segment[nextSeg.type]} · {formatClock(nextSeg.seconds)}
          </div>
        ) : (
          <div className="next-up">🏁</div>
        )}

        <div className="segment-dots">
          {engine.segments.map((s, i) => (
            <span
              key={i}
              className={
                'dot dot-' + s.type + (i < engine.segmentIndex ? ' past' : i === engine.segmentIndex ? ' current' : '')
              }
            />
          ))}
        </div>

        <div className="progress-track session-progress">
          <div className="progress-fill" style={{ width: `${totalPct}%` }} />
        </div>

        <div className="session-controls">
          {engine.paused ? (
            <button className="btn btn-primary btn-big" onClick={engine.resume}>
              ▶ {strings.resume}
            </button>
          ) : (
            <HoldButton
              className="btn-primary btn-big"
              label={`⏸ ${strings.pause}`}
              holdingLabel={strings.holdHint}
              onActivate={engine.pause}
            />
          )}
          <div className="session-controls-row">
            <HoldButton
              className="btn-ghost"
              label={strings.endSession}
              holdingLabel={strings.holdHint}
              onActivate={handleEnd}
            />
            <HoldButton
              className="btn-ghost"
              label={`${strings.skip} ⏭`}
              holdingLabel={strings.holdHint}
              onActivate={engine.skip}
            />
          </div>
          <p className="hold-note">{strings.holdNote}</p>
        </div>
      </div>
    </div>
  )
}
