---
type: architecture
tags:
  - kadensi/pwa
  - react
  - local-first
updated: 2026-07-11
sources:
  - src/App.tsx
  - src/hooks/useSessionEngine.ts
  - src/store.ts
  - vite.config.ts
---

# Architecture

## System shape

KadensI is a browser-only, single-page running coach built with Vite, React,
and TypeScript. It is deployed as static files; there is no API, server-side
database, login, telemetry, GPS tracking, or cloud sync. The browser owns the
programme, workout state, cues, and persistence.

```text
Browser / installed PWA
  ├── React views and components
  ├── training programme data
  ├── timestamp-based session engine ──> audio and wake lock APIs
  └── localStorage <──> completion history, settings, session snapshot

Vite/PWA build ──> static dist/ ──> Vercel
```

## Code boundaries

| Area | Responsibility |
| --- | --- |
| [`src/App.tsx`](/Users/lindau/codex/kadensi/src/App.tsx) | View selection, persisted app state, resume handling, and active-session boundary. |
| [`src/program.ts`](/Users/lindau/codex/kadensi/src/program.ts) | The data-driven 10-week / 30-session plan with stable session IDs. |
| [`src/hooks/useSessionEngine.ts`](/Users/lindau/codex/kadensi/src/hooks/useSessionEngine.ts) | Segment transitions, timestamp-derived remaining time, cues, snapshots, and completion. |
| [`src/store.ts`](/Users/lindau/codex/kadensi/src/store.ts) | Typed localStorage reads/writes, defaults, reset, and JSON export/import. |
| [`src/audio.ts`](/Users/lindau/codex/kadensi/src/audio.ts) | User-gesture audio unlock, oscillator beeps, and Danish speech cues. |
| [`src/hooks/useWakeLock.ts`](/Users/lindau/codex/kadensi/src/hooks/useWakeLock.ts) | Best-effort screen wake lock and visibility re-acquisition. |
| [`src/components/`](/Users/lindau/codex/kadensi/src/components) | Mobile-first plan, session, history, advice, settings, installation, and sharing UI. |
| [`src/i18n.ts`](/Users/lindau/codex/kadensi/src/i18n.ts) | The Danish locale and common display formatting. |

## Workout lifecycle

1. The plan presents the first uncompleted session by default, while allowing
   the runner to select any session.
2. Starting unlocks audio in the user gesture, clears stale resume data, and
   mounts the full-screen session view.
3. The session engine derives segments from the programme. `?demo=1` caps each
   segment at five seconds for development verification.
4. The active segment has an absolute end time. A 200 ms display tick calculates
   remaining time from `Date.now()` rather than accumulating interval ticks;
   this avoids drift after Safari throttles a page.
5. A snapshot is persisted on state transitions and pause/resume. After reload,
   the app offers to resume only if the referenced session ID still exists.
6. Completion clears the snapshot and appends history. Abandoning clears the
   snapshot but does not mark the session complete.

Pause, skip, and end use hold-to-activate controls to reduce accidental touches
during a run. Sound is supplementary: colour, labels, and the countdown remain
the primary cues.

## Persistence and privacy

All state is local browser storage:

| Key | Data |
| --- | --- |
| `kadens.completed` | Completion records: session ID, ISO time, duration. |
| `kadens.settings` | Beep, speech, locale, and hold-duration preferences. |
| `kadens.activeSession` | Segment and timing snapshot for reload recovery. |
| `kadens.installDismissed` | Install-banner dismissal choice. |

The `kadens.*` prefix is intentionally retained after the KadensI brand rename
to preserve user progress. Export produces a versioned JSON backup with
settings and completions. Import currently checks that completions are an
array; stricter schema and range validation is roadmap work.

## PWA and deployment

`vite-plugin-pwa` generates a standalone portrait manifest, service worker,
and precache list for built application assets and icons. iOS receives a custom
Add to Home Screen explanation because it does not implement the standard
install prompt; supported non-iOS browsers receive the native prompt. Vercel
can deploy the static `dist/` build from `main`; production PWA and wake-lock
features require HTTPS.

The quality gate is `npm run check`: ESLint, Vitest programme/formatting tests,
TypeScript checking, and the production PWA build.
