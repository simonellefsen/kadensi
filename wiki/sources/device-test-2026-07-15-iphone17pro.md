---
type: source-note
tags:
  - kadensi/device-test
  - kadensi/pwa
updated: 2026-07-15
source: first-party
author: Simon Ellefsen
---

# Source note: iPhone 17 Pro real-device release pass

Source: first-party device test, reported directly by Simon Ellefsen.

## Device

- Model: iPhone 17 Pro
- OS: iOS 26.5.2
- Deployment: `kadensi.vercel.app` (Vercel, HTTPS)

## Result

Simon ran the [real-iPhone release pass](../runbooks/build-test-release.md)
checklist and confirmed steps 1–7 pass on this device/OS:

1. Add to Home Screen from iOS Safari.
2. Force-close and relaunch the installed PWA offline after initial load.
3. Audible beeps and spoken cues with the ringer on; screen stays
   understandable with sound off.
4. Lock/background and return during a session; countdown stays correct and
   wake lock re-acquires.
5. Reload/close mid-session; resume/discard banner works both ways.
6. Complete one session and abandon another; only the completed one appears
   in history.
7. Export, reset, and re-import progress; settings and history are restored.

No issues were reported for any of these steps. Step 8 of the runbook (record
the result) is satisfied by this source note.

## Limitations

- Single-device, single-OS-version data point. Does not by itself establish
  the full supported release matrix (see the roadmap's open question on this).
- No notes were captured on borderline cases (e.g. Low Power Mode's effect on
  wake lock, or very long backgrounding periods) — worth a follow-up pass if
  they matter.

## Links

- [release runbook](../runbooks/build-test-release.md)
- [roadmap](../roadmap.md)
- [architecture](../architecture.md)
