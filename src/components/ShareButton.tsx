import { useEffect, useRef, useState } from 'react'
import type { Strings } from '../i18n'

export function ShareButton({ strings }: { strings: Strings }) {
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | null>(null)

  useEffect(() => () => {
    if (toastTimer.current !== null) clearTimeout(toastTimer.current)
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    if (toastTimer.current !== null) clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2500)
  }

  const onShare = async () => {
    const payload = {
      title: strings.shareTitle,
      text: strings.shareText,
      url: window.location.origin + window.location.pathname,
    }
    if (navigator.share) {
      try {
        await navigator.share(payload)
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') showToast(strings.shareFailed)
      }
      return
    }
    try {
      await navigator.clipboard.writeText(payload.url)
      showToast(strings.shareCopied)
    } catch {
      showToast(strings.shareFailed)
    }
  }

  return (
    <div className="share-slot">
      <button
        className="share-btn"
        onClick={() => void onShare()}
        aria-label={strings.shareTitle}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
          <path
            d="M12 3v12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 7.5 12 3l4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 11v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {toast && <div className="share-toast">{toast}</div>}
    </div>
  )
}
