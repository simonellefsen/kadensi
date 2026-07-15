---
type: roadmap
tags:
  - kadensi/product
  - kadensi/pwa
updated: 2026-07-13
sources:
  - wiki/architecture.md
  - wiki/runbooks/build-test-release.md
  - wiki/log.md
---

# Roadmap

This roadmap favours confidence in the core running experience over feature
expansion. It preserves KadensI's local-first privacy model unless a future,
explicit product decision changes that model.

## Current baseline

| Capability | Status | Evidence |
| --- | --- | --- |
| 10-week / 30-session programme | Landed | [`src/program.ts`](/Users/lindau/codex/kadensi/src/program.ts) and unit tests. |
| Guided timer, cues, resume snapshots | Landed | [`useSessionEngine.ts`](/Users/lindau/codex/kadensi/src/hooks/useSessionEngine.ts). |
| Local-only progress, settings, backup/import | Landed | [`store.ts`](/Users/lindau/codex/kadensi/src/store.ts). |
| Installable offline PWA | Landed | [`vite.config.ts`](/Users/lindau/codex/kadensi/vite.config.ts). |
| Automated lint, unit-test, and production-build gate | Landed | `npm run check`. |
| Bilingual UI (Danish + English) with browser auto-detect | Landed | `src/i18n.ts`, `src/store.ts` `detectLanguage()`. |
| Timer state-machine tests | Landed | [`useSessionEngine.test.ts`](/Users/lindau/codex/kadensi/src/hooks/useSessionEngine.test.ts); caught and fixed a real duplicate-`onFinished` bug. |
| Safe import validation | Landed | [`store.ts`](/Users/lindau/codex/kadensi/src/store.ts) `importData`, [`store.test.ts`](/Users/lindau/codex/kadensi/src/store.test.ts). |
| Complete real-iPhone release pass | Pending — requires a physical device | [release runbook](runbooks/build-test-release.md). |

## P0 — prove the core on target devices

| Work | Shape | Acceptance evidence |
| --- | --- | --- |
| Real-iPhone release pass | Test iOS Safari and installed PWA on a supported iPhone: install, offline relaunch, sound/speech, wake lock, pause/resume, reload recovery, and backup/import. | A dated source note with device/browser versions, results, and linked follow-up issues. **The only remaining P0 item — needs Simon's physical iPhone, not runnable by an agent.** |
| ~~Timer state-machine tests~~ | ~~Use fake timers to cover pause/resume, segment overshoot, reload snapshots, and exactly-once completion.~~ | Done 2026-07-13: [`useSessionEngine.test.ts`](/Users/lindau/codex/kadensi/src/hooks/useSessionEngine.test.ts). |
| ~~Safe import validation~~ | ~~Validate backup version, records, known session IDs, and setting ranges before writes. Preserve current data on an invalid file.~~ | Done 2026-07-13: [`store.test.ts`](/Users/lindau/codex/kadensi/src/store.test.ts). |

## P1 — accessibility and robustness

| Work | Shape | Acceptance evidence |
| --- | --- | --- |
| Interaction accessibility pass | Check keyboard operation, visible focus, accessible names, colour contrast, reduced motion, and a non-pointer route for hold controls. | Tested accessibility checklist and resolved findings. |
| Service-worker update UX | Confirm updates do not surprise an active workout and communicate a safe refresh point. | Device test with a deployed update while installed. |
| Programme data safeguards | Add invariant tests for durations, segment shapes, milestone placement, and migration rules for any future programme change. | Tests and a decision record before changing IDs or ordering. |

## P2 — product improvements, only after P0/P1 evidence

- Recovery guidance for missed workouts without silently changing the plan.
- Further locales beyond the landed Danish/English pair, through complete
  `src/i18n.ts` translations.
- Optional programme variants with a clear selection and saved-progress
  migration strategy.
- A privacy-preserving feedback mechanism only if a backend/telemetry decision
  is explicitly approved.

## Non-goals

- Accounts, cloud sync, social features, advertising, or analytics.
- GPS, pace, or distance claims; the programme is time based.
- Personal medical, training, or nutrition prescriptions.

## Open questions

- What iOS versions and devices form the supported release matrix?
- Is the present 10-week plan the single canonical programme, or should future
  variants require a separate data model and migration path?
- What is the smallest useful feedback loop that preserves the local-first
  privacy promise?
