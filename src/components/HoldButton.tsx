import { useCallback, useRef, useState } from 'react'

interface Props {
  label: string
  /** Text shown while the user is holding, e.g. "Hold inde…" */
  holdingLabel?: string
  onActivate: () => void
  holdMs?: number
  className?: string
}

/**
 * A button that only fires after the user holds it for `holdMs`.
 * Prevents accidental taps while the phone is in a pocket during a run.
 * A fill grows across the button so the hold is discoverable.
 */
export function HoldButton({ label, holdingLabel, onActivate, holdMs = 650, className = '' }: Props) {
  const [holding, setHolding] = useState(false)
  const timerRef = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setHolding(false)
  }, [])

  const start = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault()
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId)
      } catch {
        // pointer may already be released; capture is a nicety, not required
      }
      setHolding(true)
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        setHolding(false)
        onActivate()
      }, holdMs)
    },
    [holdMs, onActivate],
  )

  return (
    <button
      className={`btn hold-btn ${holding ? 'is-holding' : ''} ${className}`}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      style={{ ['--hold-ms' as string]: `${holdMs}ms` }}
    >
      <span className="hold-fill" />
      <span className="hold-label">{holding && holdingLabel ? holdingLabel : label}</span>
    </button>
  )
}
