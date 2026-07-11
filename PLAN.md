# KadensI — PWA running coach (3 km → 5 km)

## Context

Simon wants a browser-based running coach to take him from beginner to 3 km, then on to 5 km, used on his iPhone. It guides each workout with timed run/walk intervals (Couch-to-5K style), speaks/beeps the transitions, stores all progress locally on the device (web storage), and installs to the iOS home screen as a PWA. UI is Danish, structured so more languages can be added later.

- **Project folder:** `/Users/lindau/codex/kadensi` (git repo, remote `github.com/simonellefsen/kadensi`, branch `main`)
- **Deployment:** Simon connects Vercel to the repo — every push to `main` auto-builds and deploys to a `*.vercel.app` domain (HTTPS, required for PWA install)
- **Decisions made:** name **KadensI** ("Find din kadens"), timer + cues only (no GPS for now), beeps + spoken cues, Danish UI

## Stack

- **Vite + React + TypeScript** with **vite-plugin-pwa** (Workbox service worker, auto-update, generated manifest). Vercel auto-detects Vite — zero config.
- No backend, no router, no UI library — a single-page app with view state, hand-rolled mobile-first CSS.
- **Persistence: localStorage** via a small typed wrapper (progress + settings are tiny; IndexedDB adds complexity for no benefit here). JSON export/import in Settings as backup.

## Training program (data-driven, `src/program.ts`)

10 weeks, 3 sessions/week. Every session = 5 min warmup walk + intervals + 5 min cooldown walk. Defined as plain data: `Segment = { type: 'warmup'|'run'|'walk'|'cooldown', seconds }` so the plan is tweakable without touching logic.

| Week | Intervals (per session) |
|---|---|
| 1 | 8× (60 s løb / 90 s gå) |
| 2 | 6× (90 s løb / 2 min gå) |
| 3 | 2× (90 s løb, 90 s gå, 3 min løb, 3 min gå) |
| 4 | 3 min løb, 90 s gå, 5 min løb, 2½ min gå, 3 min løb, 90 s gå, 5 min løb |
| 5 | s1: 3× (5 min løb / 3 min gå) · s2: 2× (8 min løb / 5 min gå) · s3: 20 min løb |
| 6 | s1: 5/8/5 min løb m. gåpauser · s2: 2× (10 min løb / 3 min gå) · s3: 25 min løb — **🎉 3 km milestone** |
| 7–8 | 25 → 28 min kontinuerligt løb |
| 9 | 30 min løb |
| 10 | 30–35 min løb — **🎉 5 km milestone** |

## Screens

- **Hjem/Plan** — week-by-week grid with completed/next/locked sessions, "next session" hero card, progress %, milestone badges.
- **Session** — huge countdown, full-screen segment color (grøn = LØB, blå = GÅ, gul = opvarmning/nedkøling), "næste: …" preview, overall progress bar, pause/genoptag, skip segment, afslut.
- **Historik** — list of completed sessions with dates.
- **Indstillinger** — beeps on/off, speech on/off, export/import data, reset progress, (hidden) demo mode.

## Session engine & iOS specifics (the tricky bits)

- **Timer state machine** (`src/hooks/useSessionEngine.ts`): driven by absolute timestamps (segment end-times vs `Date.now()`), never accumulated `setInterval` ticks — stays correct through Safari throttling. Active-session snapshot persisted to localStorage on every transition, so an accidental reload/lock resumes mid-workout.
- **Wake Lock API** (`src/hooks/useWakeLock.ts`): keep screen on during a session (iOS Safari ≥ 16.4); re-acquire on `visibilitychange`.
- **Audio** (`src/audio.ts`): `AudioContext` unlocked in the Start-button tap handler (iOS requires a user gesture). Distinct oscillator beep patterns for run vs walk, plus `speechSynthesis` with a `da-DK` voice ("Løb nu!", "Gå nu", "Halvvejs!", "Sidste interval!"). Caveat surfaced in UI: silent switch mutes audio; screen colors always work.
- **Install prompt** (`src/components/InstallBanner.tsx`): iOS has no `beforeinstallprompt`, so detect iOS Safari + not-standalone (`display-mode: standalone` / `navigator.standalone`) and show a dismissible banner with "Tryk Del ⎋ → Føj til hjemmeskærm". On Android/desktop, hook the real `beforeinstallprompt` event.
- **Manifest/icons:** name KadensI, `display: standalone`, theme colors; simple "K + pulse" logo as SVG rendered to 192/512/maskable PNGs + 180 px `apple-touch-icon`. Installed home-screen apps are exempt from Safari's 7-day storage eviction — one more reason the install banner matters.

## File structure

```
kadensi/
├─ index.html · vite.config.ts · tsconfig.json · package.json · .gitignore
├─ public/            icons (192/512/maskable/apple-touch-icon)
└─ src/
   ├─ main.tsx · App.tsx          (view switching, install banner mount)
   ├─ program.ts                  (types + 10-week plan data)
   ├─ store.ts                    (typed localStorage: progress, settings, active session)
   ├─ i18n.ts                     (all UI strings, `da` locale; add `en` later)
   ├─ audio.ts                    (beeps + speech cues)
   ├─ hooks/ useSessionEngine.ts · useWakeLock.ts
   ├─ components/ Home.tsx · Session.tsx · History.tsx · Settings.tsx · InstallBanner.tsx
   └─ styles.css                  (mobile-first, safe-area insets, dark-friendly)
```

## Verification

1. `npm run dev` + Claude Preview browser: enable **demo mode** (`?demo=1` compresses every segment to ~5 s), run a full session end-to-end — segment transitions, cues firing, pause/resume, reload-mid-session resume, completion marking progress on Hjem.
2. Mobile viewport check (375×812) + dark mode.
3. `npm run build && npm run preview`: service worker registers, manifest served, app works offline after first load.
4. Commit + push to `main` → Simon connects Vercel → real-device test on iPhone: Add to Home Screen, standalone launch, wake lock and speech during an actual session.
