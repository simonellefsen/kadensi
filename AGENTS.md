# KadensI contributor guide

KadensI is a Danish, local-first PWA running coach. Follow the global command
rule in `/Users/lindau/.codex/RTK.md`: prefix shell commands with `rtk`.

## Current architecture

The active application is a Vite + React + TypeScript single-page app. It has
no backend, account, analytics, GPS, or cloud sync. The browser holds the
training plan, workout timer, audio cues, and all user data. `vite-plugin-pwa`
generates the installable manifest and offline service worker; Vercel serves
the static `dist/` output.

Important implementation boundaries:

- `src/program.ts`: 10-week / 30-session programme and stable session IDs.
- `src/hooks/useSessionEngine.ts`: timestamp-based workout state machine.
- `src/store.ts`: typed localStorage state and JSON backup/import format.
- `src/i18n.ts`: all user-facing Danish copy and display formatting.
- `src/components/`: mobile-first app screens and interaction controls.

## Project rules

- Keep all user-facing copy in `src/i18n.ts`; Danish is the only locale today,
  but additions must remain localisable.
- Preserve the `kadens.*` localStorage keys. They intentionally survive the
  Kadens-to-KadensI brand rename so existing user progress is not lost.
- Do not change session IDs or programme ordering without a data migration:
  progress and active-session snapshots reference those IDs.
- Keep timers tied to wall-clock timestamps, never accumulated `setInterval`
  ticks, because Safari throttles background and lock-screen pages.
- Do not add a backend, telemetry, or account system without an explicit
  product decision. The current privacy promise is local-only data.

## Knowledge wiki

This repository uses an LLM-maintained knowledge wiki under `wiki/`. Treat it
as a persistent synthesis layer, not raw source of truth.

- Read `wiki/index.md` before project-history, architecture, or roadmap work.
- Follow `wiki/schema.md` when adding or updating wiki pages.
- Append durable wiki maintenance actions to `wiki/log.md`.
- Keep source notes in `wiki/sources/` immutable after capture; update linked
  synthesis pages rather than silently rewriting a source claim.
- Never store user backup files, device data, secrets, or private URLs in the
  wiki.

## Quality checks

```sh
rtk npm run lint
rtk npm test
rtk npm run build
rtk npm run check
```

Use `?demo=1` to cap each workout segment at five seconds. Any change to the
timer, audio, wake lock, installation, or offline behaviour also needs a real
iPhone release pass.
