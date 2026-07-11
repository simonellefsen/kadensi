# KadensI 🏃

**Find din kadens** — a Danish-language PWA running coach that takes you from beginner to 3 km, then on to 5 km, with timed run/walk intervals (Couch-to-5K style).

## Features

- **10-week program**: 3 sessions/week, from 8×(1 min run / 1½ min walk) up to 35 min continuous running. 3 km milestone at week 6, 5 km at week 10.
- **Guided sessions**: full-screen color-coded RUN/WALK timer with beeps, spoken Danish cues (Web Speech API), countdown beeps, halfway and last-interval announcements.
- **Installable PWA**: add to iOS home screen (custom banner — iOS has no install prompt), works fully offline, screen kept awake during workouts via the Wake Lock API.
- **Local-first**: all progress in `localStorage`, no account, no backend. JSON export/import backup in settings.
- **Resilient timer**: absolute-timestamp based, survives Safari throttling; interrupted sessions can be resumed after a reload or lock.

## Development

```sh
npm install
npm run dev        # dev server
npm run lint       # static checks
npm test           # unit tests
npm run build      # type-check + production build (dist/)
npm run check      # lint + tests + production build
npm run preview    # serve the production build
```

Append `?demo=1` to the URL to compress every segment to ~5 seconds for quick testing.

## Deployment

Static Vite app — push to `main` and let Vercel auto-build (framework preset: Vite, output `dist/`).

## Project wiki

The source-driven, LLM-maintained project wiki lives in [wiki/index.md](wiki/index.md).
It records the current architecture, roadmap, source notes, and release runbook;
follow [wiki/schema.md](wiki/schema.md) when maintaining it.

## Notes for iOS

- Audio cues require the ring/silent switch to be off silent; the screen always shows the current segment regardless.
- Wake Lock requires iOS ≥ 16.4.
- Installed home-screen apps are exempt from Safari's 7-day storage eviction — install the app to keep your progress safe.
