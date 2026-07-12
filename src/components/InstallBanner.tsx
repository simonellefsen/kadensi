import { useEffect, useState } from 'react'
import type { Strings } from '../i18n'
import { loadInstallDismissed, saveInstallDismissed } from '../store'
import { BrandName } from './BrandName'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as { standalone?: boolean }).standalone === true
  )
}

function isIos(): boolean {
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod/.test(ua) || (ua.includes('Mac') && navigator.maxTouchPoints > 1)
}

export function InstallBanner({ strings }: { strings: Strings }) {
  const [dismissed, setDismissed] = useState(() => loadInstallDismissed())
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (dismissed || isStandalone()) return null

  const ios = isIos()
  // On non-iOS we only show the banner once the browser says the app is installable
  if (!ios && !installEvent) return null

  const dismiss = () => {
    saveInstallDismissed()
    setDismissed(true)
  }

  return (
    <div className="install-banner card">
      <strong className="install-title">
        {strings.installLead}
        <BrandName appName={strings.appName} />
        {strings.installTitle}
      </strong>
      <p>{ios ? strings.installBodyIos : strings.installBodyOther}</p>
      <div className="row">
        {!ios && installEvent && (
          <button
            className="btn btn-primary"
            onClick={() => {
              void installEvent.prompt()
              dismiss()
            }}
          >
            {strings.installBtn}
          </button>
        )}
        <button className="btn btn-ghost" onClick={dismiss}>
          {strings.installDismiss}
        </button>
      </div>
    </div>
  )
}
