import { useEffect, useRef } from 'react'

/**
 * Keeps the screen awake while `active` is true.
 * Supported in iOS Safari >= 16.4; silently does nothing elsewhere.
 */
export function useWakeLock(active: boolean): void {
  const lockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return

    let cancelled = false

    const acquire = async () => {
      try {
        const lock = await navigator.wakeLock.request('screen')
        if (cancelled) {
          void lock.release()
        } else {
          lockRef.current = lock
        }
      } catch {
        // e.g. low battery mode — the app still works, screen may dim
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void acquire()
    }

    void acquire()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      void lockRef.current?.release()
      lockRef.current = null
    }
  }, [active])
}
