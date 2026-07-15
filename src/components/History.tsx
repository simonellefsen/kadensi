import type { CompletedSession } from '../store'
import type { Language, Strings } from '../i18n'
import { formatDate, formatDuration } from '../i18n'

interface Props {
  completed: CompletedSession[]
  strings: Strings
  language: Language
}

export function History({ completed, strings, language }: Props) {
  const items = [...completed].reverse()
  return (
    <div className="history">
      <header className="app-header">
        <h1>{strings.historyTitle}</h1>
      </header>
      {items.length === 0 ? (
        <p className="empty">{strings.historyEmpty}</p>
      ) : (
        <ul className="history-list">
          {items.map((c, i) => {
            const [week, index] = c.id.split('-')
            return (
              <li key={`${c.id}-${i}`} className="card history-item">
                <div>
                  <strong>
                    {strings.week} {week} · {strings.session} {index}
                  </strong>
                  <span className="history-date">{formatDate(c.completedAt, language)}</span>
                </div>
                <span className="history-duration">{formatDuration(c.durationSeconds)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
