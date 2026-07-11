---
type: runbook
tags:
  - kadensi/release
  - kadensi/pwa
updated: 2026-07-11
sources:
  - package.json
  - vite.config.ts
  - src/hooks/useSessionEngine.ts
---

# Build, test, and release

## Local quality gate

Run the complete required gate before a release or merge:

```sh
rtk npm run check
```

This runs ESLint, Vitest, TypeScript checking, and a production Vite/PWA build.
For focused feedback, use `rtk npm run lint`, `rtk npm test`, or `rtk npm run
build` individually.

## Fast workout smoke test

1. Start `rtk npm run dev`.
2. Open the app with `?demo=1`; every segment is capped at five seconds.
3. Start a session and verify visible segment labels, countdown changes, and
   pause/resume/skip/end hold controls.
4. Reload mid-session, select resume, and verify the timer returns to the
   stored session rather than starting again.
5. Finish a demo session and confirm the home progress and history update.
6. Export the data, then import it and verify the same state is shown.

## Real-iPhone release pass

Perform this on an HTTPS deployment and record the result as a source note.

1. Visit the app in iOS Safari and add it to the Home Screen.
2. Launch the installed PWA, then force-close and relaunch it while offline
   after the initial assets have loaded.
3. With the ringer enabled, begin a session and verify audible beeps and Danish
   spoken cues. Also verify the screen remains understandable with sound off.
4. Lock/background and return to the app during a session; check that the
   timestamp-based countdown is still correct and the screen wake lock is
   re-acquired when supported.
5. Reload or close the app mid-session; verify the resume/discard banner and
   both paths.
6. Complete and abandon separate sessions. Confirm only the completed session
   appears in history.
7. Export progress, reset it, and import the export. Confirm settings and
   completion history are restored.
8. Record device model, iOS version, installation mode, results, limitations,
   and links to any follow-up roadmap/decision pages.

## Deployment

The project is a static Vite build. Push the verified `main` branch and let
Vercel deploy `dist/` using its Vite preset. Do not rely only on desktop
preview for the final PWA verification: installation, audio, wake lock, and
offline behaviour are platform-specific.
