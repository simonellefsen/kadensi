import { useRef, useState } from 'react'
import type { Settings } from '../store'
import { HOLD_MS_MAX, HOLD_MS_MIN, exportData, importData, resetProgress } from '../store'
import type { Strings } from '../i18n'
import { BrandName } from './BrandName'

interface Props {
  settings: Settings
  strings: Strings
  onChange: (settings: Settings) => void
  onDataChanged: () => void
}

export function SettingsScreen({ settings, strings, onChange, onDataChanged }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)

  const doExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kadensi-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const doImport = async (file: File) => {
    const text = await file.text()
    const result = importData(text)
    setImportMsg(result.ok ? strings.importOk : strings.importError)
    if (result.ok) onDataChanged()
    setTimeout(() => setImportMsg(null), 3000)
  }

  const doReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true)
      setTimeout(() => setConfirmingReset(false), 4000)
      return
    }
    resetProgress()
    setConfirmingReset(false)
    onDataChanged()
  }

  return (
    <div className="settings">
      <header className="app-header">
        <h1>{strings.settingsTitle}</h1>
      </header>

      <section className="card">
        <label className="toggle-row">
          <span>{strings.beeps}</span>
          <input
            type="checkbox"
            checked={settings.beeps}
            onChange={(e) => onChange({ ...settings, beeps: e.target.checked })}
          />
        </label>
        <label className="toggle-row">
          <span>{strings.speechSetting}</span>
          <input
            type="checkbox"
            checked={settings.speech}
            onChange={(e) => onChange({ ...settings, speech: e.target.checked })}
          />
        </label>
        <p className="hint">{strings.silentHint}</p>
      </section>

      <section className="card">
        <div className="slider-header">
          <span>{strings.holdDuration}</span>
          <strong>{strings.holdSeconds((settings.holdMs / 1000).toFixed(2).replace('.', ','))}</strong>
        </div>
        <input
          className="slider"
          type="range"
          min={HOLD_MS_MIN}
          max={HOLD_MS_MAX}
          step={50}
          value={settings.holdMs}
          onChange={(e) => onChange({ ...settings, holdMs: Number(e.target.value) })}
        />
        <p className="hint">{strings.holdDurationHint}</p>
      </section>

      <section className="card">
        <h3>{strings.dataTitle}</h3>
        <div className="row">
          <button className="btn btn-secondary" onClick={doExport}>
            {strings.exportBtn}
          </button>
          <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
            {strings.importBtn}
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void doImport(f)
            e.target.value = ''
          }}
        />
        {importMsg && <p className="hint">{importMsg}</p>}
        <button className="btn btn-danger" onClick={doReset}>
          {confirmingReset ? strings.confirmReset : strings.resetBtn}
        </button>
      </section>

      <p className="about">
        <BrandName appName={strings.appName} /> {strings.about}
      </p>
    </div>
  )
}
