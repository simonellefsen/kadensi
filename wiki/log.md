---
type: wiki-log
tags:
  - kadensi/wiki
  - maintained-by-llm
updated: 2026-07-13
---

# Wiki log

Append-only timeline for project-wiki maintenance. Use headings in the format
`## [YYYY-MM-DD] kind | summary` so agents and shell tools can parse it.

## [2026-07-11] bootstrap | Source-driven project knowledge wiki

- Added the LLM-wiki schema, content index, source note, architecture, roadmap,
  release runbook, and decision/experiment indexes.
- Captured the LLM-wiki pattern as a source note and used it to define KadensI's
  source, synthesis, query, and lint workflows.
- Documented the verified local-first PWA architecture and recorded a
  device-validation-first roadmap. No user data or private deployment details
  were added.

## [2026-07-13] rename | Rebrand to KadensI, bilingual UI

- Repo and folder renamed `kadens` → `kadensi`; `origin` now points at
  github.com/simonellefsen/kadensi (full history preserved).
- Fixed a dropped "Føj" (imperative "Add") in the install-banner title that
  the branding refactor had accidentally removed, via a new `installLead`
  string (commit 85fd14e).
- Added a full English locale (`src/i18n.ts`) alongside Danish, including the
  per-week programme descriptions (moved out of `program.ts` into per-locale
  `weekLabels`). Language auto-detects from `navigator.languages` on first
  launch and is overridable in Settings; the choice persists and always wins
  over re-detection (commit cbefa84).

## [2026-07-13] p0 | Timer state-machine tests, safe import validation

- Added `src/hooks/useSessionEngine.test.ts` (jsdom + fake timers): full-session
  completion, pause/resume freezing the countdown, a single tick overshooting
  more than one segment boundary, and restoring both running and paused
  snapshots after a simulated reload.
- Found and fixed a real bug while writing these tests: `advance()` had no
  guard against running again once a session was already finished, so a burst
  of redundant overdue ticks (54 observed in one test run) could re-fire
  `onFinished` repeatedly — a plausible source of duplicate history entries
  after a real throttling episode. Fixed with an early return on an
  already-finished state.
- Hardened `importData` (`src/store.ts`): validates the whole file — exact
  version match, every completed entry checked against real known session ids
  plus valid date/duration, any settings patch checked for a known language
  and in-range `holdMs` — before writing anything, so a malformed file can
  never partially overwrite existing progress. Verified in the browser: a bad
  file shows the error message and leaves stored completions untouched.
  New test coverage in `src/store.test.ts` (commit 76693e5).
- Test infra: added `@testing-library/react` + `jsdom`, wired through vitest's
  `test` config in `vite.config.ts`. Node 22+'s experimental global
  `localStorage` shadows jsdom's real implementation; `src/test-setup.ts`
  restores the working one from `globalThis.jsdom`.
- Remaining P0 item — the real-iPhone release pass — was handed to Simon as a
  checklist; it requires a physical device and cannot be run by an agent.
