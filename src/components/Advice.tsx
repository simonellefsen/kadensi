import type { Strings } from '../i18n'

export function Advice({ strings }: { strings: Strings }) {
  return (
    <div className="advice">
      <header className="app-header">
        <h1>{strings.adviceTitle}</h1>
      </header>
      <p className="advice-intro">{strings.adviceIntro}</p>
      {strings.adviceSections.map((section) => (
        <section key={section.title} className="card advice-card">
          <h3>
            <span className="advice-icon">{section.icon}</span> {section.title}
          </h3>
          <ul className="advice-list">
            {section.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
